import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Alert, Dropdown, ProgressBar } from 'react-bootstrap';
import OCRFeatures from './OCRFeatures';
import TextToSpeech from './TextToSpeech';
import BatchProcessor from './BatchProcessor';
import SetupGuide from './SetupGuide';
import ApiStatus from './ApiStatus';
import OptionsDisplay from './OptionsDisplay';
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
  const [buttonLoading, setButtonLoading] = useState({});
  const [selectedTone, setSelectedTone] = useState('formal');
  const [selectedLanguage, setSelectedLanguage] = useState('spanish');
  const [aiResults, setAiResults] = useState({}); // Store AI transformation results

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
        sentiment: await analyzeSentiment(text),
        language: detectLanguage(text),
        grammar: await checkGrammar(text),
        readability: calculateReadability(text),
        keywords: await extractKeywords(text),
        hashtags: await generateHashtags(text)
      };
      setAnalysis(results);
    } catch (error) {
      console.error('Analysis error:', error);

      let errorMessage = 'Error analyzing text. Using fallback analysis.';
      if (error.message.includes('503')) {
        errorMessage = 'AI service is busy. Using local analysis. Please try again later.';
      } else if (error.message.includes('API key')) {
        errorMessage = 'API key issue. Please check your configuration.';
      }

      showAlert(errorMessage, 'warning');

      // Provide fallback analysis
      setAnalysis({
        sentiment: null,
        language: detectLanguage(text),
        grammar: [],
        readability: calculateReadability(text),
        keywords: [],
        hashtags: []
      });
    }
    setLoading(false);
  };

  // AI Transformation Handlers - Save results in AI Analysis tab
  const handleSummarize = async () => {
    setButtonLoading(prev => ({ ...prev, summarize: true }));
    try {
      const summaryOptions = await summarizeText(text, 3);
      setAiResults(prev => ({ ...prev, summaryOptions }));
      showAlert('Summary options generated!', 'success');
      return summaryOptions;
    } catch (error) {
      showAlert('Error generating summary', 'danger');
      return [];
    } finally {
      setButtonLoading(prev => ({ ...prev, summarize: false }));
    }
  };

  const handleParaphrase = async () => {
    setButtonLoading(prev => ({ ...prev, paraphrase: true }));
    try {
      const paraphraseOptions = await paraphraseText(text);
      setAiResults(prev => ({ ...prev, paraphraseOptions }));
      showAlert('Paraphrase options generated!', 'success');
      return paraphraseOptions;
    } catch (error) {
      showAlert('Error paraphrasing text', 'danger');
      return [];
    } finally {
      setButtonLoading(prev => ({ ...prev, paraphrase: false }));
    }
  };

  const handleToneAdjustment = async () => {
    setButtonLoading(prev => ({ ...prev, tone: true }));
    try {
      const toneOptions = await adjustTone(text, selectedTone);
      setAiResults(prev => ({ 
        ...prev, 
        toneOptions: { options: toneOptions, tone: selectedTone }
      }));
      showAlert(`${selectedTone} tone options generated!`, 'success');
      return toneOptions;
    } catch (error) {
      showAlert('Error adjusting tone', 'danger');
      return [];
    } finally {
      setButtonLoading(prev => ({ ...prev, tone: false }));
    }
  };

  const handleTranslate = async () => {
    setButtonLoading(prev => ({ ...prev, translate: true }));
    try {
      const translationOptions = await translateText(text, selectedLanguage);
      setAiResults(prev => ({ 
        ...prev, 
        translationOptions: { options: translationOptions, language: selectedLanguage }
      }));
      showAlert(`Translation options to ${selectedLanguage} generated!`, 'success');
      return translationOptions;
    } catch (error) {
      showAlert('Error translating text', 'danger');
      return [];
    } finally {
      setButtonLoading(prev => ({ ...prev, translate: false }));
    }
  };

  const handleGeneratePrompt = async () => {
    setButtonLoading(prev => ({ ...prev, prompt: true }));
    try {
      const prompt = await generateWritingPrompts(analysis.keywords || []);
      setAiResults(prev => ({ ...prev, writingPrompt: prompt }));
      showAlert('Writing prompt generated!', 'success');
    } catch (error) {
      showAlert('Error generating writing prompt', 'danger');
    } finally {
      setButtonLoading(prev => ({ ...prev, prompt: false }));
    }
  };

  // Helper function to copy text to clipboard
  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      showAlert(`${label} copied to clipboard!`, 'success');
    } catch (error) {
      showAlert(`${label}: ${text}`, 'info');
    }
  };

  // Helper function to use result as new input
  const replaceOriginalText = (text) => {
    onTextUpdate(text);
    showAlert('Text updated in editor!', 'success');
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
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>🤖 AI-Powered Analysis</h4>
        <ApiStatus />
      </div>
      <SetupGuide backgroundColo={backgroundColo} />
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
                  {analysis.sentiment.positive?.length > 0 && (
                    <small>Positive words: {analysis.sentiment.positive.join(', ')}</small>
                  )}
                  {analysis.sentiment.negative?.length > 0 && (
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
          {analysis.grammar?.length > 0 ? (
            <div>
              {analysis.grammar.map((suggestion, index) => (
                <Alert key={index} variant="warning" className="small">
                  <strong>{suggestion.type}:</strong> {suggestion.message}
                  <br />
                  <em>"{suggestion.original || suggestion.sentence}"</em>
                </Alert>
              ))}
            </div>
          ) : (
            <Alert variant="success">No grammar issues detected! ✅</Alert>
          )}
        </Card.Body>
      </Card>

      {/* Readability */}
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
                  disabled={buttonLoading.summarize}
                  onClick={handleSummarize}
                >
                  {buttonLoading.summarize ? '⏳ Summarizing...' : '📄 Summarize'}
                </Button>
                <Button 
                  variant="outline-secondary"
                  disabled={buttonLoading.paraphrase}
                  onClick={handleParaphrase}
                >
                  {buttonLoading.paraphrase ? '⏳ Paraphrasing...' : '🔄 Paraphrase'}
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
                disabled={buttonLoading.tone}
                onClick={handleToneAdjustment}
              >
                {buttonLoading.tone ? '⏳ Adjusting...' : 'Adjust Tone'}
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
                disabled={buttonLoading.translate}
                onClick={handleTranslate}
              >
                {buttonLoading.translate ? '⏳ Translating...' : 'Translate'}
              </Button>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* AI Results Display Section */}
      {Object.keys(aiResults).length > 0 && (
        <Card style={cardStyle} className="mb-4">
          <Card.Body>
            <Card.Title>✨ AI Transformation Results</Card.Title>
            
            {aiResults.summaryOptions && (
              <OptionsDisplay
                title="Summary"
                icon="📄"
                options={aiResults.summaryOptions}
                backgroundColo={backgroundColo}
                onCopy={copyToClipboard}
                onUseAsInput={replaceOriginalText}
              />
            )}

            {aiResults.paraphraseOptions && (
              <OptionsDisplay
                title="Paraphrased"
                icon="🔄"
                options={aiResults.paraphraseOptions}
                backgroundColo={backgroundColo}
                onCopy={copyToClipboard}
                onUseAsInput={replaceOriginalText}
              />
            )}

            {aiResults.toneOptions && (
              <OptionsDisplay
                title="Tone Adjustment"
                icon="🎭"
                options={aiResults.toneOptions.options}
                backgroundColo={backgroundColo}
                onCopy={copyToClipboard}
                onUseAsInput={replaceOriginalText}
                extraInfo={aiResults.toneOptions.tone}
              />
            )}

            {aiResults.translationOptions && (
              <OptionsDisplay
                title="Translation"
                icon="🌐"
                options={aiResults.translationOptions.options}
                backgroundColo={backgroundColo}
                onCopy={copyToClipboard}
                onUseAsInput={replaceOriginalText}
                extraInfo={aiResults.translationOptions.language}
              />
            )}

            {aiResults.writingPrompt && (
              <div className="mb-3 p-3 border rounded">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="mb-0">💡 Writing Prompt</h6>
                  <div>
                    <Button 
                      size="sm" 
                      variant="outline-primary" 
                      className="me-2"
                      onClick={() => copyToClipboard(aiResults.writingPrompt, 'Writing prompt')}
                    >
                      📋 Copy
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline-success"
                      onClick={() => replaceOriginalText(aiResults.writingPrompt)}
                    >
                      ✏️ Use as Input
                    </Button>
                  </div>
                </div>
                <p className="mb-0" style={{ fontSize: '0.9em' }}>{aiResults.writingPrompt}</p>
              </div>
            )}

            <div className="text-end mt-3">
              <Button 
                variant="outline-danger" 
                size="sm"
                onClick={() => setAiResults({})}
              >
                🗑️ Clear All Results
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Phase 3: Advanced Features */}
      <div className="row">
        <div className="col-md-6">
          <Card style={cardStyle} className="mb-3">
            <Card.Body>
              <Card.Title>🔑 Keywords</Card.Title>
              {analysis.keywords?.length > 0 ? (
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
              {analysis.hashtags?.length > 0 ? (
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
            disabled={buttonLoading.prompt}
            onClick={handleGeneratePrompt}
          >
            {buttonLoading.prompt ? '⏳ Generating...' : 'Generate Writing Prompt'}
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
