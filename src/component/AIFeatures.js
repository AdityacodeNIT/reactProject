import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Alert, Dropdown, ProgressBar } from 'react-bootstrap';
import OCRFeatures from './OCRFeatures';
import TextToSpeech from './TextToSpeech';
import BatchProcessor from './BatchProcessor';
import './AIFeatures.css';
import {
  analyzeSentiment,
  detectLanguage,
  summarizeText,
  checkGrammar,
  paraphraseText,
  adjustTone,
  calculateReadability,
  generateWritingPrompts,
  extractKeywords,
  generateHashtags,
  translateText
} from '../services/aiServices';

const AIFeatures = ({ text, backgroundColo, showAlert, onTextUpdate }) => {
  const [analysis, setAnalysis] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedTone, setSelectedTone] = useState('formal');
  const [selectedLanguage, setSelectedLanguage] = useState('spanish');

  const cardStyle = {
    backgroundColor: backgroundColo === 'dark' ? '#2B3035' : 'white',
    color: backgroundColo === 'dark' ? 'white' : 'black',
    border: backgroundColo === 'dark' ? '1px solid #444' : '1px solid #ddd'
  };

  useEffect(() => {
    if (text.trim()) {
      analyzeText();
    }
  }, [text]);

  const analyzeText = async () => {
    setLoading(true);
    try {
      const results = {
        sentiment: analyzeSentiment(text),
        language: detectLanguage(text),
        grammar: checkGrammar(text),
        readability: calculateReadability(text),
        keywords: extractKeywords(text),
        hashtags: generateHashtags(text)
      };
      setAnalysis(results);
    } catch (error) {
      showAlert('Error analyzing text', 'danger');
    }
    setLoading(false);
  };

  const handleSummarize = () => {
    const summary = summarizeText(text, 3);
    showAlert('Summary generated!', 'success');
    return summary;
  };

  const handleParaphrase = () => {
    const paraphrased = paraphraseText(text);
    showAlert('Text paraphrased!', 'success');
    return paraphrased;
  };

  const handleToneAdjustment = () => {
    const adjusted = adjustTone(text, selectedTone);
    showAlert(`Tone adjusted to ${selectedTone}!`, 'success');
    return adjusted;
  };

  const handleTranslate = async () => {
    const translated = await translateText(text, selectedLanguage);
    showAlert(`Text translated to ${selectedLanguage}!`, 'success');
    return translated;
  };

  const getSentimentColor = (label) => {
    switch (label) {
      case 'Very Positive': return 'success';
      case 'Positive': return 'primary';
      case 'Neutral': return 'secondary';
      case 'Negative': return 'warning';
      case 'Very Negative': return 'danger';
      default: return 'secondary';
    }
  };

  const getReadabilityColor = (score) => {
    if (score >= 70) return 'success';
    if (score >= 50) return 'warning';
    return 'danger';
  };

  if (!text.trim()) {
    return (
      <Card style={cardStyle} className="mb-3">
        <Card.Body>
          <Card.Title>🤖 AI Analysis</Card.Title>
          <Alert variant="info">Enter some text to see AI-powered analysis and features!</Alert>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div className="ai-features-container">
      {loading && <ProgressBar animated now={100} className="mb-3" />}
      
      {/* Phase 1: Core Analysis */}
      <div className="row mb-4">
        <div className="col-md-6">
          <Card style={cardStyle} className="mb-3">
            <Card.Body>
              <Card.Title>😊 Sentiment Analysis</Card.Title>
              {analysis.sentiment && (
                <>
                  <Badge bg={getSentimentColor(analysis.sentiment.label)} className="mb-2">
                    {analysis.sentiment.label}
                  </Badge>
                  <p>Score: {analysis.sentiment.score}</p>
                  <p>Confidence: {Math.abs(analysis.sentiment.comparative * 100).toFixed(1)}%</p>
                  {analysis.sentiment.positive.length > 0 && (
                    <small>Positive words: {analysis.sentiment.positive.join(', ')}</small>
                  )}
                  {analysis.sentiment.negative.length > 0 && (
                    <small className="d-block">Negative words: {analysis.sentiment.negative.join(', ')}</small>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-6">
          <Card style={cardStyle} className="mb-3">
            <Card.Body>
              <Card.Title>🌍 Language Detection</Card.Title>
              {analysis.language && (
                <>
                  <Badge bg="info" className="mb-2">{analysis.language.language}</Badge>
                  <p>Code: {analysis.language.code}</p>
                  <p>Confidence: {analysis.language.confidence}</p>
                </>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Grammar Check */}
      <Card style={cardStyle} className="mb-3">
        <Card.Body>
          <Card.Title>✏️ Grammar & Style Check</Card.Title>
          {analysis.grammar && analysis.grammar.length > 0 ? (
            <div>
              {analysis.grammar.map((suggestion, index) => (
                <Alert key={index} variant="warning" className="small">
                  <strong>{suggestion.type}:</strong> {suggestion.message}
                  <br />
                  <em>"{suggestion.sentence}"</em>
                </Alert>
              ))}
            </div>
          ) : (
            <Alert variant="success">No grammar issues detected! ✅</Alert>
          )}
        </Card.Body>
      </Card>

      {/* Readability Score */}
      <Card style={cardStyle} className="mb-3">
        <Card.Body>
          <Card.Title>📊 Readability Analysis</Card.Title>
          {analysis.readability && (
            <>
              <div className="d-flex align-items-center mb-2">
                <Badge bg={getReadabilityColor(analysis.readability.score)} className="me-2">
                  Score: {analysis.readability.score}
                </Badge>
                <span>{analysis.readability.level}</span>
              </div>
              <small>
                Sentences: {analysis.readability.sentences} | 
                Words: {analysis.readability.words} | 
                Syllables: {analysis.readability.syllables}
              </small>
            </>
          )}
        </Card.Body>
      </Card>

      {/* Phase 2: Text Transformation */}
      <div className="row mb-4">
        <div className="col-md-4">
          <Card style={cardStyle} className="mb-3">
            <Card.Body>
              <Card.Title>📝 Text Tools</Card.Title>
              <div className="d-grid gap-2">
                <Button 
                  variant="outline-primary" 
                  onClick={() => {
                    const summary = handleSummarize();
                    navigator.clipboard.writeText(summary);
                  }}
                >
                  📄 Summarize
                </Button>
                <Button 
                  variant="outline-secondary"
                  onClick={() => {
                    const paraphrased = handleParaphrase();
                    navigator.clipboard.writeText(paraphrased);
                  }}
                >
                  🔄 Paraphrase
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-4">
          <Card style={cardStyle} className="mb-3">
            <Card.Body>
              <Card.Title>🎭 Tone Adjustment</Card.Title>
              <Dropdown className="mb-2">
                <Dropdown.Toggle variant="outline-info" size="sm">
                  {selectedTone}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setSelectedTone('formal')}>Formal</Dropdown.Item>
                  <Dropdown.Item onClick={() => setSelectedTone('casual')}>Casual</Dropdown.Item>
                  <Dropdown.Item onClick={() => setSelectedTone('professional')}>Professional</Dropdown.Item>
                  <Dropdown.Item onClick={() => setSelectedTone('friendly')}>Friendly</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Button 
                variant="outline-info" 
                size="sm"
                onClick={() => {
                  const adjusted = handleToneAdjustment();
                  navigator.clipboard.writeText(adjusted);
                }}
              >
                Adjust Tone
              </Button>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-4">
          <Card style={cardStyle} className="mb-3">
            <Card.Body>
              <Card.Title>🌐 Translation</Card.Title>
              <Dropdown className="mb-2">
                <Dropdown.Toggle variant="outline-success" size="sm">
                  {selectedLanguage}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setSelectedLanguage('spanish')}>Spanish</Dropdown.Item>
                  <Dropdown.Item onClick={() => setSelectedLanguage('french')}>French</Dropdown.Item>
                  <Dropdown.Item onClick={() => setSelectedLanguage('german')}>German</Dropdown.Item>
                  <Dropdown.Item onClick={() => setSelectedLanguage('italian')}>Italian</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Button 
                variant="outline-success" 
                size="sm"
                onClick={async () => {
                  const translated = await handleTranslate();
                  navigator.clipboard.writeText(translated);
                }}
              >
                Translate
              </Button>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Phase 3: Advanced Features */}
      <div className="row">
        <div className="col-md-6">
          <Card style={cardStyle} className="mb-3">
            <Card.Body>
              <Card.Title>🔑 Keywords</Card.Title>
              {analysis.keywords && analysis.keywords.length > 0 ? (
                <div>
                  {analysis.keywords.map((keyword, index) => (
                    <Badge key={index} bg="secondary" className="me-1 mb-1">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              ) : (
                <small>No keywords detected</small>
              )}
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-6">
          <Card style={cardStyle} className="mb-3">
            <Card.Body>
              <Card.Title>📱 Hashtags</Card.Title>
              {analysis.hashtags && analysis.hashtags.length > 0 ? (
                <div>
                  {analysis.hashtags.map((hashtag, index) => (
                    <Badge key={index} bg="primary" className="me-1 mb-1">
                      {hashtag}
                    </Badge>
                  ))}
                </div>
              ) : (
                <small>No hashtags generated</small>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Writing Prompt Generator */}
      <Card style={cardStyle} className="mb-3">
        <Card.Body>
          <Card.Title>💡 Writing Prompt Generator</Card.Title>
          <Button 
            variant="outline-warning"
            onClick={() => {
              const prompt = generateWritingPrompts(analysis.keywords || []);
              showAlert('New writing prompt generated!', 'info');
              navigator.clipboard.writeText(prompt);
            }}
          >
            Generate Writing Prompt
          </Button>
        </Card.Body>
      </Card>

      {/* OCR Features */}
      <OCRFeatures 
        backgroundColo={backgroundColo}
        showAlert={showAlert}
        onTextExtracted={onTextUpdate}
      />

      {/* Text-to-Speech */}
      <TextToSpeech 
        text={text}
        backgroundColo={backgroundColo}
        showAlert={showAlert}
      />

      {/* Batch Processing */}
      <BatchProcessor 
        backgroundColo={backgroundColo}
        showAlert={showAlert}
      />
    </div>
  );
};

export default AIFeatures;