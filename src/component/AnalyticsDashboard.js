import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, Alert } from 'react-bootstrap';
import { analyzeSentiment, detectLanguage, calculateReadability, extractKeywords } from '../services/aiServices';

const AnalyticsDashboard = ({ text, backgroundColo }) => {
  const [analytics, setAnalytics] = useState({});
  const [writingStats, setWritingStats] = useState({});

  const cardStyle = {
    backgroundColor: backgroundColo === 'dark' ? '#2B3035' : 'white',
    color: backgroundColo === 'dark' ? 'white' : 'black',
    border: backgroundColo === 'dark' ? '1px solid #444' : '1px solid #ddd'
  };

  useEffect(() => {
    if (text.trim()) {
      calculateAnalytics();
    }
  }, [text]);

  const calculateAnalytics = () => {
    const words = text.split(/\s+/).filter(word => word).length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    
    // Advanced metrics
    const avgWordsPerSentence = sentences > 0 ? (words / sentences).toFixed(1) : 0;
    const avgCharsPerWord = words > 0 ? (charactersNoSpaces / words).toFixed(1) : 0;
    const readingTime = Math.ceil(words / 200); // Average reading speed
    
    // Complexity analysis
    const longWords = text.split(/\s+/).filter(word => word.length > 6).length;
    const complexityScore = words > 0 ? ((longWords / words) * 100).toFixed(1) : 0;
    
    // Sentence variety
    const shortSentences = text.split(/[.!?]+/).filter(s => s.trim().split(/\s+/).length <= 10).length;
    const mediumSentences = text.split(/[.!?]+/).filter(s => {
      const wordCount = s.trim().split(/\s+/).length;
      return wordCount > 10 && wordCount <= 20;
    }).length;
    const longSentences = text.split(/[.!?]+/).filter(s => s.trim().split(/\s+/).length > 20).length;
    
    setWritingStats({
      words,
      sentences,
      paragraphs,
      characters,
      charactersNoSpaces,
      avgWordsPerSentence,
      avgCharsPerWord,
      readingTime,
      complexityScore,
      longWords,
      shortSentences,
      mediumSentences,
      longSentences
    });

    // AI Analytics
    const sentiment = analyzeSentiment(text);
    const language = detectLanguage(text);
    const readability = calculateReadability(text);
    const keywords = extractKeywords(text);

    setAnalytics({
      sentiment,
      language,
      readability,
      keywords
    });
  };

  const getComplexityColor = (score) => {
    if (score < 20) return 'success';
    if (score < 40) return 'warning';
    return 'danger';
  };

  const getSentenceVarietyAnalysis = () => {
    const total = writingStats.shortSentences + writingStats.mediumSentences + writingStats.longSentences;
    if (total === 0) return null;

    return {
      short: ((writingStats.shortSentences / total) * 100).toFixed(1),
      medium: ((writingStats.mediumSentences / total) * 100).toFixed(1),
      long: ((writingStats.longSentences / total) * 100).toFixed(1)
    };
  };

  if (!text.trim()) {
    return (
      <Alert variant="info">
        📊 Enter some text to see detailed analytics and writing insights!
      </Alert>
    );
  }

  const sentenceVariety = getSentenceVarietyAnalysis();

  return (
    <div className="analytics-dashboard">
      <h4 className="mb-4">📊 Advanced Analytics Dashboard</h4>
      
      {/* Basic Statistics */}
      <Row className="mb-4">
        <Col md={3}>
          <Card style={cardStyle} className="text-center">
            <Card.Body>
              <h2 className="text-primary">{writingStats.words}</h2>
              <p className="mb-0">Words</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card style={cardStyle} className="text-center">
            <Card.Body>
              <h2 className="text-info">{writingStats.sentences}</h2>
              <p className="mb-0">Sentences</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card style={cardStyle} className="text-center">
            <Card.Body>
              <h2 className="text-success">{writingStats.paragraphs}</h2>
              <p className="mb-0">Paragraphs</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card style={cardStyle} className="text-center">
            <Card.Body>
              <h2 className="text-warning">{writingStats.readingTime}</h2>
              <p className="mb-0">Min Read</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Writing Quality Metrics */}
      <Row className="mb-4">
        <Col md={6}>
          <Card style={cardStyle}>
            <Card.Body>
              <Card.Title>✍️ Writing Quality</Card.Title>
              <div className="mb-2">
                <strong>Avg Words/Sentence:</strong> {writingStats.avgWordsPerSentence}
                <Badge bg={writingStats.avgWordsPerSentence > 20 ? 'warning' : 'success'} className="ms-2">
                  {writingStats.avgWordsPerSentence > 20 ? 'Too Long' : 'Good'}
                </Badge>
              </div>
              <div className="mb-2">
                <strong>Avg Chars/Word:</strong> {writingStats.avgCharsPerWord}
              </div>
              <div className="mb-2">
                <strong>Complexity Score:</strong> {writingStats.complexityScore}%
                <Badge bg={getComplexityColor(writingStats.complexityScore)} className="ms-2">
                  {writingStats.complexityScore < 20 ? 'Simple' : 
                   writingStats.complexityScore < 40 ? 'Moderate' : 'Complex'}
                </Badge>
              </div>
              <div>
                <strong>Long Words (6+ chars):</strong> {writingStats.longWords}
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card style={cardStyle}>
            <Card.Body>
              <Card.Title>📏 Sentence Variety</Card.Title>
              {sentenceVariety && (
                <>
                  <div className="mb-2">
                    <strong>Short (≤10 words):</strong> {sentenceVariety.short}%
                    <div className="progress mt-1" style={{ height: '8px' }}>
                      <div 
                        className="progress-bar bg-success" 
                        style={{ width: `${sentenceVariety.short}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="mb-2">
                    <strong>Medium (11-20 words):</strong> {sentenceVariety.medium}%
                    <div className="progress mt-1" style={{ height: '8px' }}>
                      <div 
                        className="progress-bar bg-warning" 
                        style={{ width: `${sentenceVariety.medium}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="mb-2">
                    <strong>Long (20+ words):</strong> {sentenceVariety.long}%
                    <div className="progress mt-1" style={{ height: '8px' }}>
                      <div 
                        className="progress-bar bg-danger" 
                        style={{ width: `${sentenceVariety.long}%` }}
                      ></div>
                    </div>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* AI Insights */}
      <Row className="mb-4">
        <Col md={4}>
          <Card style={cardStyle}>
            <Card.Body>
              <Card.Title>😊 Sentiment</Card.Title>
              {analytics.sentiment && (
                <>
                  <Badge 
                    bg={analytics.sentiment.score > 0 ? 'success' : 
                        analytics.sentiment.score < 0 ? 'danger' : 'secondary'}
                    className="mb-2"
                  >
                    {analytics.sentiment.label}
                  </Badge>
                  <div>
                    <strong>Score:</strong> {analytics.sentiment.score}
                  </div>
                  <div>
                    <strong>Confidence:</strong> {Math.abs(analytics.sentiment.comparative * 100).toFixed(1)}%
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card style={cardStyle}>
            <Card.Body>
              <Card.Title>🌍 Language</Card.Title>
              {analytics.language && (
                <>
                  <Badge bg="info" className="mb-2">
                    {analytics.language.language}
                  </Badge>
                  <div>
                    <strong>Code:</strong> {analytics.language.code}
                  </div>
                  <div>
                    <strong>Confidence:</strong> {analytics.language.confidence}
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card style={cardStyle}>
            <Card.Body>
              <Card.Title>📖 Readability</Card.Title>
              {analytics.readability && (
                <>
                  <Badge 
                    bg={analytics.readability.score >= 70 ? 'success' : 
                        analytics.readability.score >= 50 ? 'warning' : 'danger'}
                    className="mb-2"
                  >
                    {analytics.readability.level}
                  </Badge>
                  <div>
                    <strong>Score:</strong> {analytics.readability.score}
                  </div>
                  <div>
                    <strong>Grade Level:</strong> {analytics.readability.level}
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Keywords */}
      <Row>
        <Col>
          <Card style={cardStyle}>
            <Card.Body>
              <Card.Title>🔑 Key Terms</Card.Title>
              {analytics.keywords && analytics.keywords.length > 0 ? (
                <div>
                  {analytics.keywords.map((keyword, index) => (
                    <Badge key={index} bg="secondary" className="me-2 mb-2">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No keywords detected</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AnalyticsDashboard;