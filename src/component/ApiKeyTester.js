import React, { useState } from 'react';
import { Card, Button, Alert, Form, Badge } from 'react-bootstrap';
import { GoogleGenerativeAI } from '@google/generative-ai';

const ApiKeyTester = ({ backgroundColo }) => {
  const [testKey, setTestKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState(null);

  const cardStyle = {
    backgroundColor: backgroundColo === 'dark' ? '#2B3035' : 'white',
    color: backgroundColo === 'dark' ? 'white' : 'black',
    border: backgroundColo === 'dark' ? '1px solid #444' : '1px solid #ddd'
  };

  const testApiKey = async () => {
    if (!testKey.trim()) {
      setResult({ success: false, message: 'Please enter an API key' });
      return;
    }

    setTesting(true);
    setResult(null);

    try {
      const genAI = new GoogleGenerativeAI(testKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const result = await model.generateContent("Say 'Hello, API key is working!'");
      const response = await result.response;
      const text = response.text();
      
      setResult({ 
        success: true, 
        message: 'API key is valid!', 
        response: text 
      });
      
      // Save the working key
      localStorage.setItem('gemini_api_key', testKey);
      
    } catch (error) {
      console.error('API Key Test Error:', error);
      setResult({ 
        success: false, 
        message: `API key test failed: ${error.message}` 
      });
    } finally {
      setTesting(false);
    }
  };

  const getCurrentKey = () => {
    return process.env.REACT_APP_GEMINI_API_KEY || localStorage.getItem('gemini_api_key') || 'Not set';
  };

  return (
    <Card style={cardStyle} className="mb-3">
      <Card.Body>
        <Card.Title>🔑 API Key Tester</Card.Title>
        
        <div className="mb-3">
          <strong>Current API Key Status:</strong>
          <Badge bg="secondary" className="ms-2">
            {getCurrentKey().substring(0, 10)}...
          </Badge>
        </div>

        <Form.Group className="mb-3">
          <Form.Label>Test a new API Key:</Form.Label>
          <Form.Control
            type="password"
            placeholder="Paste your Gemini API key here"
            value={testKey}
            onChange={(e) => setTestKey(e.target.value)}
          />
          <Form.Text className="text-muted">
            Get your API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a>
          </Form.Text>
        </Form.Group>

        <Button 
          variant="primary" 
          onClick={testApiKey}
          disabled={testing || !testKey.trim()}
        >
          {testing ? '🔄 Testing...' : '🧪 Test API Key'}
        </Button>

        {result && (
          <Alert variant={result.success ? 'success' : 'danger'} className="mt-3">
            <strong>{result.success ? '✅ Success!' : '❌ Error:'}</strong> {result.message}
            {result.response && (
              <div className="mt-2">
                <small><strong>API Response:</strong> {result.response}</small>
              </div>
            )}
          </Alert>
        )}

        <Alert variant="info" className="mt-3">
          <strong>Troubleshooting Tips:</strong>
          <ul className="mb-0 mt-2">
            <li>Make sure your API key starts with "AIza"</li>
            <li>Ensure you've enabled the Gemini API in Google Cloud Console</li>
            <li>Check that your API key has the correct permissions</li>
            <li>Try generating a new API key if the current one doesn't work</li>
          </ul>
        </Alert>
      </Card.Body>
    </Card>
  );
};

export default ApiKeyTester;