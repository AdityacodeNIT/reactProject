import React, { useState } from 'react';
import { Card, Button, Alert, ProgressBar, Table, Badge } from 'react-bootstrap';
import { analyzeSentiment, detectLanguage, calculateReadability } from '../services/aiServices';

const BatchProcessor = ({ backgroundColo, showAlert }) => {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState([]);
  const [progress, setProgress] = useState(0);

  const cardStyle = {
    backgroundColor: backgroundColo === 'dark' ? '#2B3035' : 'white',
    color: backgroundColo === 'dark' ? 'white' : 'black',
    border: backgroundColo === 'dark' ? '1px solid #444' : '1px solid #ddd'
  };

  const handleFileSelection = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const textFiles = selectedFiles.filter(file => 
      file.type === 'text/plain' || file.name.endsWith('.txt')
    );
    
    if (textFiles.length !== selectedFiles.length) {
      showAlert('Some files were filtered out. Only .txt files are supported.', 'warning');
    }
    
    setFiles(textFiles);
    setResults([]);
  };

  const processFiles = async () => {
    if (files.length === 0) {
      showAlert('Please select files to process', 'warning');
      return;
    }

    setProcessing(true);
    setProgress(0);
    const processedResults = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        const text = await readFileContent(file);
        const analysis = {
          fileName: file.name,
          fileSize: formatFileSize(file.size),
          wordCount: text.split(/\s+/).filter(word => word).length,
          charCount: text.length,
          sentiment: analyzeSentiment(text),
          language: detectLanguage(text),
          readability: calculateReadability(text),
          status: 'success'
        };
        
        processedResults.push(analysis);
      } catch (error) {
        processedResults.push({
          fileName: file.name,
          status: 'error',
          error: error.message
        });
      }
      
      setProgress(((i + 1) / files.length) * 100);
    }

    setResults(processedResults);
    setProcessing(false);
    showAlert(`Processed ${processedResults.length} files successfully!`, 'success');
  };

  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const exportResults = () => {
    const csvContent = [
      ['File Name', 'Size', 'Words', 'Characters', 'Sentiment', 'Language', 'Readability Score'],
      ...results.map(result => [
        result.fileName,
        result.fileSize || 'N/A',
        result.wordCount || 'N/A',
        result.charCount || 'N/A',
        result.sentiment?.label || 'N/A',
        result.language?.language || 'N/A',
        result.readability?.score || 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'batch-analysis-results.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showAlert('Results exported to CSV!', 'success');
  };

  const getSentimentBadge = (sentiment) => {
    if (!sentiment) return <Badge bg="secondary">N/A</Badge>;
    
    const colors = {
      'Very Positive': 'success',
      'Positive': 'primary',
      'Neutral': 'secondary',
      'Negative': 'warning',
      'Very Negative': 'danger'
    };
    
    return <Badge bg={colors[sentiment.label] || 'secondary'}>{sentiment.label}</Badge>;
  };

  return (
    <Card style={cardStyle} className="mb-3">
      <Card.Body>
        <Card.Title>📁 Batch File Processor</Card.Title>
        <Card.Text>
          Process multiple text files at once and get comprehensive analysis for each.
        </Card.Text>

        <input
          type="file"
          multiple
          accept=".txt"
          className="form-control mb-3"
          onChange={handleFileSelection}
          disabled={processing}
        />

        {files.length > 0 && (
          <Alert variant="info" className="mb-3">
            Selected {files.length} file(s) for processing
          </Alert>
        )}

        {processing && (
          <div className="mb-3">
            <div className="d-flex justify-content-between mb-1">
              <span>Processing files...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <ProgressBar now={progress} animated />
          </div>
        )}

        <div className="d-flex gap-2 mb-3">
          <Button 
            variant="primary" 
            onClick={processFiles}
            disabled={files.length === 0 || processing}
          >
            {processing ? '⏳ Processing...' : '🚀 Process Files'}
          </Button>
          
          {results.length > 0 && (
            <Button variant="success" onClick={exportResults}>
              📊 Export Results
            </Button>
          )}
        </div>

        {results.length > 0 && (
          <div>
            <h6>Analysis Results:</h6>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <Table striped bordered hover size="sm" variant={backgroundColo === 'dark' ? 'dark' : 'light'}>
                <thead>
                  <tr>
                    <th>File</th>
                    <th>Size</th>
                    <th>Words</th>
                    <th>Sentiment</th>
                    <th>Language</th>
                    <th>Readability</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={index}>
                      <td>{result.fileName}</td>
                      <td>{result.fileSize || 'N/A'}</td>
                      <td>{result.wordCount || 'N/A'}</td>
                      <td>{getSentimentBadge(result.sentiment)}</td>
                      <td>{result.language?.language || 'N/A'}</td>
                      <td>
                        {result.readability ? (
                          <Badge bg={result.readability.score >= 70 ? 'success' : result.readability.score >= 50 ? 'warning' : 'danger'}>
                            {result.readability.score}
                          </Badge>
                        ) : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default BatchProcessor;