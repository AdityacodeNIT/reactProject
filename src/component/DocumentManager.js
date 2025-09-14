import React, { useState, useEffect } from 'react';
import { 
  Card, Button, Table, Modal, Form, Badge, Alert, 
  ProgressBar, InputGroup, Row, Col,
  ButtonGroup, Offcanvas
} from 'react-bootstrap';
import { 
  analyzeSentiment, 
  summarizeText, 
  extractKeywords, 
  translateText,
  checkGrammar,
  analyzeResearchPaper,
  generateStudyNotes,
  checkPlagiarism,
  generateQuizQuestions,
  analyzeCodeDocumentation,
  generateProjectIdeas
} from '../services/aiServices';

const DocumentManager = ({ backgroundColo, showAlert }) => {
  // Document State
  const [documents, setDocuments] = useState([]);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [currentPage, setCurrentPage] = useState(1);
  const [docsPerPage] = useState(10);

  // Modal States
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [showBulkModal, setBulkModal] = useState(false);
  const [showDetailsOffcanvas, setShowDetailsOffcanvas] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  
  // Simplified modals
  const [showStudyNotesModal, setShowStudyNotesModal] = useState(false);
  const [showPlagiarismModal, setShowPlagiarismModal] = useState(false);

  // Processing States
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState({});
  
  // Simplified results
  const [studyNotes, setStudyNotes] = useState([]);
  const [plagiarismResults, setPlagiarismResults] = useState(null);

  // Upload States
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});

  const cardStyle = {
    backgroundColor: backgroundColo === 'dark' ? '#2B3035' : 'white',
    color: backgroundColo === 'dark' ? 'white' : 'black',
    border: backgroundColo === 'dark' ? '1px solid #444' : '1px solid #ddd'
  };

  // Load documents from localStorage on component mount
  useEffect(() => {
    const savedDocs = localStorage.getItem('documents');
    if (savedDocs) {
      setDocuments(JSON.parse(savedDocs));
    }
  }, []);

  // Save documents to localStorage whenever documents change
  useEffect(() => {
    localStorage.setItem('documents', JSON.stringify(documents));
  }, [documents]);

  // Generate unique ID
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // File upload handler
  const handleFileUpload = async (files) => {
    setUploading(true);
    const newDocuments = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileId = generateId();
      
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

      try {
        const content = await readFileContent(file);
        const wordCount = content.split(/\s+/).filter(word => word).length;
        const charCount = content.length;

        const newDoc = {
          id: fileId,
          name: file.name,
          type: file.type || 'text/plain',
          size: file.size,
          content: content,
          uploadDate: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          wordCount: wordCount,
          charCount: charCount,
          status: 'uploaded',
          tags: [],
          analysis: null
        };

        newDocuments.push(newDoc);
        setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
        
      } catch (error) {
        showAlert(`Error uploading ${file.name}: ${error.message}`, 'danger');
      }
    }

    setDocuments(prev => [...prev, ...newDocuments]);
    setUploading(false);
    setUploadFiles([]);
    setUploadProgress({});
    setShowUploadModal(false);
    showAlert(`${newDocuments.length} document(s) uploaded successfully!`, 'success');
  };

  // Read file content
  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  // AI Analysis for single document
  const analyzeDocument = async (doc) => {
    setAnalyzing(true);
    try {
      const results = {
        sentiment: await analyzeSentiment(doc.content),
        summary: await summarizeText(doc.content, 3),
        keywords: await extractKeywords(doc.content),
        grammar: await checkGrammar(doc.content),
        readability: calculateReadabilityScore(doc.content)
      };

      // Update document with analysis
      setDocuments(prev => prev.map(d => 
        d.id === doc.id 
          ? { ...d, analysis: results, status: 'analyzed' }
          : d
      ));

      setAnalysisResults(results);
      setShowAnalysisModal(true);
      showAlert('Document analysis completed!', 'success');
    } catch (error) {
      showAlert('Error analyzing document', 'danger');
    }
    setAnalyzing(false);
  };

  // Simplified analysis functions
  const generateStudyNotesForDoc = async (doc) => {
    setAnalyzing(true);
    try {
      const notes = await generateStudyNotes(doc.content);
      setStudyNotes(notes);
      setSelectedDocument(doc);
      setShowStudyNotesModal(true);
      showAlert('Study notes generated!', 'success');
    } catch (error) {
      showAlert('Error generating study notes', 'danger');
    }
    setAnalyzing(false);
  };

  const checkDocumentPlagiarism = async (doc) => {
    setAnalyzing(true);
    try {
      const results = await checkPlagiarism(doc.content);
      setPlagiarismResults(results);
      setSelectedDocument(doc);
      setShowPlagiarismModal(true);
      showAlert('Plagiarism check completed!', 'success');
    } catch (error) {
      showAlert('Error checking plagiarism', 'danger');
    }
    setAnalyzing(false);
  };

  // Bulk operations
  const bulkAnalyze = async () => {
    if (!selectedDocs || selectedDocs.length === 0) {
      showAlert('Please select documents to analyze', 'warning');
      return;
    }

    setBulkProcessing(true);
    let processed = 0;

    for (const docId of selectedDocs) {
      const doc = documents.find(d => d.id === docId);
      if (doc) {
        try {
          const results = {
            sentiment: await analyzeSentiment(doc.content),
            summary: await summarizeText(doc.content, 2),
            keywords: await extractKeywords(doc.content),
            readability: calculateReadabilityScore(doc.content)
          };

          setDocuments(prev => prev.map(d => 
            d.id === docId 
              ? { ...d, analysis: results, status: 'analyzed' }
              : d
          ));
          processed++;
        } catch (error) {
          console.error(`Error analyzing document ${doc.name}:`, error);
        }
      }
    }

    setBulkProcessing(false);
    setSelectedDocs([]);
    setBulkModal(false);
    showAlert(`${processed} documents analyzed successfully!`, 'success');
  };

  // Calculate readability score
  const calculateReadabilityScore = (text) => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
    const words = text.split(/\s+/).filter(word => word).length;
    const avgWordsPerSentence = words / sentences;
    
    let score = 100;
    if (avgWordsPerSentence > 20) score -= 20;
    if (avgWordsPerSentence > 15) score -= 10;
    
    return Math.max(0, Math.min(100, score));
  };

  // Filter and search documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'analyzed' && doc.analysis) ||
                         (filterType === 'unanalyzed' && !doc.analysis) ||
                         (filterType === 'text' && doc.type.includes('text'));
    
    return matchesSearch && matchesFilter;
  });

  // Sort documents
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'size':
        return b.size - a.size;
      case 'date':
      default:
        return new Date(b.uploadDate) - new Date(a.uploadDate);
    }
  });

  // Show all documents (simplified)
  const currentDocs = sortedDocuments;

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Export documents
  const exportDocuments = (format) => {
    let content = '';
    let filename = '';
    let mimeType = '';

    switch (format) {
      case 'json':
        content = JSON.stringify(documents, null, 2);
        filename = 'documents-export.json';
        mimeType = 'application/json';
        break;
      case 'csv':
        const headers = ['Name', 'Type', 'Size', 'Word Count', 'Upload Date', 'Status'];
        const rows = documents.map(doc => [
          doc.name,
          doc.type,
          formatFileSize(doc.size),
          doc.wordCount,
          new Date(doc.uploadDate).toLocaleDateString(),
          doc.status
        ]);
        content = [headers, ...rows].map(row => row.join(',')).join('\n');
        filename = 'documents-export.csv';
        mimeType = 'text/csv';
        break;
      case 'summary':
        content = documents.map(doc => {
          let summary = `Document: ${doc.name}\n`;
          summary += `Upload Date: ${new Date(doc.uploadDate).toLocaleDateString()}\n`;
          summary += `Word Count: ${doc.wordCount}\n`;
          if (doc.analysis) {
            summary += `Sentiment: ${doc.analysis.sentiment?.label || 'N/A'}\n`;
            summary += `Keywords: ${doc.analysis.keywords?.join(', ') || 'N/A'}\n`;
            summary += `Summary: ${doc.analysis.summary?.[0]?.text || 'N/A'}\n`;
          }
          return summary + '\n---\n';
        }).join('\n');
        filename = 'documents-summary.txt';
        mimeType = 'text/plain';
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showAlert(`Documents exported as ${format.toUpperCase()}!`, 'success');
  };

  return (
    <div className="document-manager">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4>📁 Smart Document Analyzer</h4>
          <p className="text-muted mb-0">Upload documents and get AI insights</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => setShowUploadModal(true)}
        >
          📤 Upload Documents
        </Button>
      </div>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card style={cardStyle} className="text-center">
            <Card.Body>
              <h3 className="text-primary">{documents?.length || 0}</h3>
              <p className="mb-0">Total Documents</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card style={cardStyle} className="text-center">
            <Card.Body>
              <h3 className="text-success">
                {documents?.filter(d => d.analysis)?.length || 0}
              </h3>
              <p className="mb-0">Analyzed</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card style={cardStyle} className="text-center">
            <Card.Body>
              <h3 className="text-info">
                {documents?.reduce((sum, doc) => sum + (doc.wordCount || 0), 0)?.toLocaleString() || '0'}
              </h3>
              <p className="mb-0">Total Words</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card style={cardStyle} className="text-center">
            <Card.Body>
              <h3 className="text-warning">
                {formatFileSize(documents?.reduce((sum, doc) => sum + (doc.size || 0), 0) || 0)}
              </h3>
              <p className="mb-0">Total Size</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Simple Search */}
      <Card style={cardStyle} className="mb-3">
        <Card.Body>
          <Row>
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>🔍</InputGroup.Text>
                <Form.Control
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={6}>
              <div className="d-flex gap-2">
                <Form.Select 
                  value={filterType} 
                  onChange={(e) => setFilterType(e.target.value)}
                  style={{ maxWidth: '150px' }}
                >
                  <option value="all">All Files</option>
                  <option value="analyzed">Analyzed</option>
                  <option value="unanalyzed">Not Analyzed</option>
                </Form.Select>
                {selectedDocs?.length > 0 && (
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => {
                      setDocuments(prev => prev.filter(d => !selectedDocs.includes(d.id)));
                      setSelectedDocs([]);
                      showAlert('Selected documents deleted!', 'info');
                    }}
                  >
                    🗑️ Delete ({selectedDocs.length})
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Documents Table */}
      <Card style={cardStyle}>
        <Card.Body>
          {currentDocs.length === 0 ? (
            <Alert variant="info" className="text-center">
              <h5>📄 No Documents Found</h5>
              <p>Upload some documents to get started with AI-powered analysis!</p>
              <Button variant="primary" onClick={() => setShowUploadModal(true)}>
                📤 Upload Your First Document
              </Button>
            </Alert>
          ) : (
            <>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>
                      <Form.Check
                        type="checkbox"
                        checked={selectedDocs?.length === currentDocs?.length && currentDocs?.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedDocs(currentDocs.map(d => d.id));
                          } else {
                            setSelectedDocs([]);
                          }
                        }}
                      />
                    </th>
                    <th>Document</th>
                    <th>Type</th>
                    <th>Size</th>
                    <th>Words</th>
                    <th>Status</th>
                    <th>Upload Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentDocs.map(doc => (
                    <tr key={doc.id}>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={selectedDocs.includes(doc.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedDocs(prev => [...prev, doc.id]);
                            } else {
                              setSelectedDocs(prev => prev.filter(id => id !== doc.id));
                            }
                          }}
                        />
                      </td>
                      <td>
                        <div>
                          <strong>{doc.name}</strong>
                          {doc.analysis?.keywords && (
                            <div className="mt-1">
                              {doc.analysis.keywords.slice(0, 3).map((keyword, idx) => (
                                <Badge key={idx} bg="secondary" className="me-1" style={{ fontSize: '0.7em' }}>
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <Badge bg="info">
                          {doc.type.split('/')[1] || 'text'}
                        </Badge>
                      </td>
                      <td>{formatFileSize(doc.size)}</td>
                      <td>{doc.wordCount.toLocaleString()}</td>
                      <td>
                        <Badge 
                          bg={doc.status === 'analyzed' ? 'success' : 'warning'}
                        >
                          {doc.status === 'analyzed' ? '✅ Analyzed' : '⏳ Pending'}
                        </Badge>
                      </td>
                      <td>{new Date(doc.uploadDate).toLocaleDateString()}</td>
                      <td>
                        <ButtonGroup size="sm">
                          <Button
                            variant="outline-primary"
                            onClick={() => {
                              setSelectedDocument(doc);
                              setShowDetailsOffcanvas(true);
                            }}
                            title="View Details"
                          >
                            👁️
                          </Button>
                          <Button
                            variant="outline-success"
                            onClick={() => analyzeDocument(doc)}
                            disabled={analyzing}
                            title="AI Analysis"
                          >
                            {analyzing ? '⏳' : '🔍'}
                          </Button>
                          <Button
                            variant="outline-info"
                            onClick={() => generateStudyNotesForDoc(doc)}
                            disabled={analyzing}
                            title="Study Notes"
                          >
                            📝
                          </Button>
                          <Button
                            variant="outline-warning"
                            onClick={() => checkDocumentPlagiarism(doc)}
                            disabled={analyzing}
                            title="Plagiarism Check"
                          >
                            🔍
                          </Button>
                          <Button
                            variant="outline-danger"
                            onClick={() => {
                              setDocuments(prev => prev.filter(d => d.id !== doc.id));
                              showAlert('Document deleted!', 'info');
                            }}
                            title="Delete"
                          >
                            🗑️
                          </Button>
                        </ButtonGroup>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>


            </>
          )}
        </Card.Body>
      </Card>

      {/* Upload Modal */}
      <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>📤 Upload Documents</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Select Files</Form.Label>
            <Form.Control
              type="file"
              multiple
              accept=".txt,.doc,.docx,.pdf,.md"
              onChange={(e) => setUploadFiles(Array.from(e.target.files))}
            />
            <Form.Text className="text-muted">
              Supported formats: TXT, DOC, DOCX, PDF, MD
            </Form.Text>
          </Form.Group>

          {uploadFiles.length > 0 && (
            <div className="mb-3">
              <h6>Selected Files:</h6>
              {uploadFiles.map((file, idx) => (
                <div key={idx} className="d-flex justify-content-between align-items-center p-2 border rounded mb-2">
                  <div>
                    <strong>{file.name}</strong>
                    <small className="text-muted ms-2">({formatFileSize(file.size)})</small>
                  </div>
                  {uploading && uploadProgress[file.name] !== undefined && (
                    <ProgressBar 
                      now={uploadProgress[file.name]} 
                      style={{ width: '100px' }}
                      size="sm"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUploadModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={() => handleFileUpload(uploadFiles)}
            disabled={uploadFiles.length === 0 || uploading}
          >
            {uploading ? '⏳ Uploading...' : '📤 Upload Documents'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Analysis Results Modal */}
      <Modal show={showAnalysisModal} onHide={() => setShowAnalysisModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>🔍 Analysis Results</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {analysisResults.sentiment && (
            <div className="mb-3">
              <h6>😊 Sentiment Analysis</h6>
              <Badge bg={analysisResults.sentiment.score > 0 ? 'success' : 'danger'}>
                {analysisResults.sentiment.label}
              </Badge>
              <small className="ms-2">Score: {analysisResults.sentiment.score}</small>
            </div>
          )}

          {analysisResults?.summary && analysisResults.summary?.length > 0 && (
            <div className="mb-3">
              <h6>📄 Summary</h6>
              <p className="border p-2 rounded">{analysisResults.summary[0]?.text}</p>
            </div>
          )}

          {analysisResults?.keywords && analysisResults.keywords?.length > 0 && (
            <div className="mb-3">
              <h6>🔑 Keywords</h6>
              {analysisResults.keywords.map((keyword, idx) => (
                <Badge key={idx} bg="secondary" className="me-1">
                  {keyword}
                </Badge>
              ))}
            </div>
          )}

          {analysisResults.readability && (
            <div className="mb-3">
              <h6>📊 Readability Score</h6>
              <ProgressBar 
                now={analysisResults.readability} 
                label={`${analysisResults.readability}%`}
                variant={analysisResults.readability > 70 ? 'success' : 'warning'}
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAnalysisModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Bulk Processing Modal */}
      <Modal show={showBulkModal} onHide={() => setBulkModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>🔄 Bulk Analysis</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Analyze {selectedDocs.length} selected documents with AI?</p>
          <Alert variant="info">
            This will perform sentiment analysis, summarization, and keyword extraction on all selected documents.
          </Alert>
          {bulkProcessing && (
            <ProgressBar animated now={100} label="Processing..." />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setBulkModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={bulkAnalyze}
            disabled={bulkProcessing}
          >
            {bulkProcessing ? '⏳ Processing...' : '🚀 Start Analysis'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Document Details Offcanvas */}
      <Offcanvas 
        show={showDetailsOffcanvas} 
        onHide={() => setShowDetailsOffcanvas(false)}
        placement="end"
        style={{ width: '500px' }}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>📄 Document Details</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {selectedDocument && (
            <div>
              <h5>{selectedDocument.name}</h5>
              
              <div className="mb-3">
                <strong>File Info:</strong>
                <ul className="list-unstyled ms-3">
                  <li>Size: {formatFileSize(selectedDocument.size)}</li>
                  <li>Type: {selectedDocument.type}</li>
                  <li>Words: {selectedDocument.wordCount.toLocaleString()}</li>
                  <li>Characters: {selectedDocument.charCount.toLocaleString()}</li>
                  <li>Uploaded: {new Date(selectedDocument.uploadDate).toLocaleString()}</li>
                </ul>
              </div>

              {selectedDocument.analysis && (
                <div className="mb-3">
                  <strong>AI Analysis:</strong>
                  <div className="ms-3">
                    {selectedDocument.analysis.sentiment && (
                      <div className="mb-2">
                        <small>Sentiment:</small>
                        <Badge bg="primary" className="ms-2">
                          {selectedDocument.analysis.sentiment.label}
                        </Badge>
                      </div>
                    )}
                    
                    {selectedDocument.analysis.keywords && (
                      <div className="mb-2">
                        <small>Keywords:</small>
                        <div className="mt-1">
                          {selectedDocument.analysis.keywords.map((keyword, idx) => (
                            <Badge key={idx} bg="secondary" className="me-1 mb-1">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="mb-3">
                <strong>Content Preview:</strong>
                <div 
                  className="border p-2 rounded mt-2"
                  style={{ 
                    maxHeight: '200px', 
                    overflowY: 'auto',
                    fontSize: '0.9em',
                    backgroundColor: backgroundColo === 'dark' ? '#1a1a1a' : '#f8f9fa'
                  }}
                >
                  {selectedDocument.content.substring(0, 500)}
                  {selectedDocument.content.length > 500 && '...'}
                </div>
              </div>

              <div className="d-grid gap-2">
                <Button 
                  variant="primary"
                  onClick={() => analyzeDocument(selectedDocument)}
                  disabled={analyzing}
                >
                  {analyzing ? '⏳ Analyzing...' : '🔍 Analyze Document'}
                </Button>
                <Button 
                  variant="outline-secondary"
                  onClick={() => {
                    const blob = new Blob([selectedDocument.content], { type: 'text/plain' });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = selectedDocument.name;
                    link.click();
                  }}
                >
                  💾 Download Original
                </Button>
              </div>
            </div>
          )}
        </Offcanvas.Body>
      </Offcanvas>

      {/* Study Notes Modal */}
      <Modal show={showStudyNotesModal} onHide={() => setShowStudyNotesModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>📝 Study Notes - {selectedDocument?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
          {studyNotes.map((section, idx) => (
            <div key={idx} className="mb-4">
              <h6 className="text-primary">{section.section}</h6>
              <ul>
                {section.content.map((item, itemIdx) => (
                  <li key={itemIdx} className="mb-1">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="primary" 
            onClick={() => {
              const content = studyNotes.map(section => 
                `${section.section}:\n${section.content.map(item => `• ${item}`).join('\n')}`
              ).join('\n\n');
              const blob = new Blob([content], { type: 'text/plain' });
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = `study-notes-${selectedDocument?.name}.txt`;
              link.click();
            }}
          >
            💾 Download Notes
          </Button>
          <Button variant="secondary" onClick={() => setShowStudyNotesModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>



      {/* Plagiarism Check Modal */}
      <Modal show={showPlagiarismModal} onHide={() => setShowPlagiarismModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>🔍 Plagiarism Analysis - {selectedDocument?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {plagiarismResults && (
            <div>
              <div className="mb-3">
                <h6>Originality Score</h6>
                <ProgressBar 
                  now={plagiarismResults.originalityScore} 
                  label={`${plagiarismResults.originalityScore}%`}
                  variant={plagiarismResults.originalityScore > 80 ? 'success' : plagiarismResults.originalityScore > 60 ? 'warning' : 'danger'}
                />
              </div>
              
              <div className="mb-3">
                <h6>Risk Level</h6>
                <Badge bg={plagiarismResults.riskLevel === 'Low' ? 'success' : plagiarismResults.riskLevel === 'Medium' ? 'warning' : 'danger'}>
                  {plagiarismResults.riskLevel} Risk
                </Badge>
              </div>

              {plagiarismResults?.suspiciousPatterns?.length > 0 && (
                <div className="mb-3">
                  <h6>Suspicious Patterns</h6>
                  <ul>
                    {plagiarismResults.suspiciousPatterns.map((pattern, idx) => (
                      <li key={idx}>{pattern}</li>
                    ))}
                  </ul>
                </div>
              )}

              {plagiarismResults?.commonPhrases?.length > 0 && (
                <div className="mb-3">
                  <h6>Common Phrases</h6>
                  {plagiarismResults.commonPhrases.map((phrase, idx) => (
                    <Badge key={idx} bg="secondary" className="me-1 mb-1">{phrase}</Badge>
                  ))}
                </div>
              )}

              <div className="mb-3">
                <h6>Recommendations</h6>
                <ul>
                  {plagiarismResults.recommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="primary" 
            onClick={() => {
              const content = `Plagiarism Analysis Report\n\nDocument: ${selectedDocument?.name}\nOriginality Score: ${plagiarismResults?.originalityScore}%\nRisk Level: ${plagiarismResults?.riskLevel}\n\nRecommendations:\n${plagiarismResults?.recommendations.join('\n')}\n\nGenerated on: ${new Date().toLocaleString()}`;
              const blob = new Blob([content], { type: 'text/plain' });
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = `plagiarism-report-${selectedDocument?.name}.txt`;
              link.click();
            }}
          >
            💾 Download Report
          </Button>
          <Button variant="secondary" onClick={() => setShowPlagiarismModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>


    </div>
  );
};

export default DocumentManager;