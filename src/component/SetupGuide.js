import React, { useState } from 'react';
import { Card, Alert, Button, Modal, Form } from 'react-bootstrap';
import ApiKeyTester from './ApiKeyTester';

const SetupGuide = ({ backgroundColo }) => {
  const [showModal, setShowModal] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const cardStyle = {
    backgroundColor: backgroundColo === 'dark' ? '#2B3035' : 'white',
    color: backgroundColo === 'dark' ? 'white' : 'black',
    border: backgroundColo === 'dark' ? '1px solid #444' : '1px solid #ddd'
  };

  const hasApiKey = (process.env.REACT_APP_GEMINI_API_KEY && 
                   process.env.REACT_APP_GEMINI_API_KEY !== 'your_gemini_api_key_here') ||
                   localStorage.getItem('gemini_api_key');

  const handleSaveKey = () => {
    // In a real app, you'd save this to localStorage or a secure backend
    localStorage.setItem('gemini_api_key', apiKey);
    setShowModal(false);
    window.location.reload(); // Reload to apply the new key
  };

  if (hasApiKey) {
    return (
      <>
        <Alert variant="success" className="mb-3">
          ✅ Gemini API is configured! All AI features are ready to use.
        </Alert>
        <ApiKeyTester backgroundColo={backgroundColo} />
      </>
    );
  }

  return (
    <>
      <Card style={cardStyle} className="mb-3">
        <Card.Body>
          <Card.Title>🔧 Setup Required</Card.Title>
          <Alert variant="warning">
            <strong>AI Features Not Available</strong><br />
            To use advanced AI features (sentiment analysis, grammar check, summarization, etc.), 
            you need to configure your Gemini API key.
          </Alert>
          
          <div className="mb-3">
            <h6>Quick Setup Steps:</h6>
            <ol>
              <li>Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a></li>
              <li>Create a new API key</li>
              <li>Use the API Key Tester below to verify it works</li>
            </ol>
          </div>

          <ApiKeyTester backgroundColo={backgroundColo} />

          <Button variant="primary" onClick={() => setShowModal(true)}>
            🔑 Add API Key
          </Button>
          
          <div className="mt-3">
            <small className="text-muted">
              <strong>Note:</strong> Without an API key, you'll still have access to basic text analysis features 
              like word count, character count, and local sentiment analysis.
            </small>
          </div>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Gemini API Key</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>API Key</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your Gemini API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <Form.Text className="text-muted">
                Your API key will be stored locally and used for AI features.
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveKey} disabled={!apiKey.trim()}>
            Save Key
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SetupGuide;