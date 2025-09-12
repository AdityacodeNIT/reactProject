import React, { useState, useEffect } from 'react';
import { Card, Button, Dropdown, Alert, Form } from 'react-bootstrap';

const TextToSpeech = ({ text, backgroundColo, showAlert }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);

  const cardStyle = {
    backgroundColor: backgroundColo === 'dark' ? '#2B3035' : 'white',
    color: backgroundColo === 'dark' ? 'white' : 'black',
    border: backgroundColo === 'dark' ? '1px solid #444' : '1px solid #ddd'
  };

  useEffect(() => {
    // Load available voices
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !selectedVoice) {
        setSelectedVoice(availableVoices[0]);
      }
    };

    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, [selectedVoice]);

  const speakText = () => {
    if (!text.trim()) {
      showAlert('Please enter some text to speak', 'warning');
      return;
    }

    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    utterance.onstart = () => {
      setIsPlaying(true);
      showAlert('Started speaking text', 'info');
    };

    utterance.onend = () => {
      setIsPlaying(false);
      showAlert('Finished speaking text', 'success');
    };

    utterance.onerror = (event) => {
      setIsPlaying(false);
      showAlert('Error occurred while speaking', 'danger');
    };

    speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    showAlert('Speech stopped', 'info');
  };

  const pauseResume = () => {
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
      showAlert('Speech resumed', 'info');
    } else {
      speechSynthesis.pause();
      showAlert('Speech paused', 'info');
    }
  };

  return (
    <Card style={cardStyle} className="mb-3">
      <Card.Body>
        <Card.Title>🔊 Text-to-Speech</Card.Title>
        <Card.Text>
          Convert your text to speech with customizable voice settings.
        </Card.Text>

        {/* Voice Selection */}
        <div className="mb-3">
          <label className="form-label">Voice:</label>
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" size="sm">
              {selectedVoice ? selectedVoice.name : 'Select Voice'}
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {voices.map((voice, index) => (
                <Dropdown.Item 
                  key={index}
                  onClick={() => setSelectedVoice(voice)}
                >
                  {voice.name} ({voice.lang})
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>

        {/* Voice Controls */}
        <div className="row mb-3">
          <div className="col-md-4">
            <Form.Group>
              <Form.Label>Speed: {rate}x</Form.Label>
              <Form.Range
                min="0.5"
                max="2"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
              />
            </Form.Group>
          </div>
          <div className="col-md-4">
            <Form.Group>
              <Form.Label>Pitch: {pitch}</Form.Label>
              <Form.Range
                min="0"
                max="2"
                step="0.1"
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
              />
            </Form.Group>
          </div>
          <div className="col-md-4">
            <Form.Group>
              <Form.Label>Volume: {Math.round(volume * 100)}%</Form.Label>
              <Form.Range
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
              />
            </Form.Group>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="d-flex gap-2 flex-wrap">
          <Button 
            variant={isPlaying ? "danger" : "primary"}
            onClick={isPlaying ? stopSpeaking : speakText}
            disabled={!text.trim()}
          >
            {isPlaying ? '⏹️ Stop' : '▶️ Speak'}
          </Button>
          
          {speechSynthesis.speaking && (
            <Button variant="warning" onClick={pauseResume}>
              {speechSynthesis.paused ? '▶️ Resume' : '⏸️ Pause'}
            </Button>
          )}
        </div>

        {!('speechSynthesis' in window) && (
          <Alert variant="warning" className="mt-3">
            Text-to-Speech is not supported in your browser.
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
};

export default TextToSpeech;