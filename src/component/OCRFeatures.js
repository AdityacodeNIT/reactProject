import React, { useState } from 'react';
import { Card, Button, Alert, ProgressBar } from 'react-bootstrap';
import Tesseract from 'tesseract.js';

const OCRFeatures = ({ backgroundColo, showAlert, onTextExtracted }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedText, setExtractedText] = useState('');

  const cardStyle = {
    backgroundColor: backgroundColo === 'dark' ? '#2B3035' : 'white',
    color: backgroundColo === 'dark' ? 'white' : 'black',
    border: backgroundColo === 'dark' ? '1px solid #444' : '1px solid #ddd'
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showAlert('Please select a valid image file', 'danger');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setExtractedText('');

    try {
      const result = await Tesseract.recognize(file, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        }
      });

      const text = result.data.text.trim();
      setExtractedText(text);
      
      if (text) {
        onTextExtracted(text);
        showAlert('Text extracted successfully from image!', 'success');
      } else {
        showAlert('No text found in the image', 'warning');
      }
    } catch (error) {
      console.error('OCR Error:', error);
      showAlert('Error extracting text from image', 'danger');
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(extractedText);
    showAlert('Text copied to clipboard!', 'success');
  };

  return (
    <Card style={cardStyle} className="mb-3">
      <Card.Body>
        <Card.Title>📷 OCR - Extract Text from Images</Card.Title>
        <Card.Text>
          Upload an image containing text, and we'll extract it for you using AI-powered OCR.
        </Card.Text>
        
        <input
          type="file"
          accept="image/*"
          className="form-control mb-3"
          onChange={handleImageUpload}
          disabled={isProcessing}
        />

        {isProcessing && (
          <div className="mb-3">
            <div className="d-flex justify-content-between mb-1">
              <span>Processing image...</span>
              <span>{progress}%</span>
            </div>
            <ProgressBar now={progress} animated />
          </div>
        )}

        {extractedText && (
          <div className="mt-3">
            <h6>Extracted Text:</h6>
            <div 
              className="p-3 border rounded mb-2"
              style={{
                backgroundColor: backgroundColo === 'dark' ? '#1a1a1a' : '#f8f9fa',
                maxHeight: '200px',
                overflowY: 'auto'
              }}
            >
              {extractedText}
            </div>
            <Button variant="outline-primary" size="sm" onClick={copyToClipboard}>
              📋 Copy Text
            </Button>
          </div>
        )}

        <Alert variant="info" className="mt-3 small">
          <strong>Tip:</strong> For best results, use clear images with good contrast and readable text.
          Supported formats: JPG, PNG, GIF, BMP, TIFF
        </Alert>
      </Card.Body>
    </Card>
  );
};

export default OCRFeatures;