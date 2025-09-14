import React, { useState, useEffect } from 'react';
import { Badge, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { GoogleGenerativeAI } from '@google/generative-ai';

const ApiStatus = () => {
  const [status, setStatus] = useState('checking');
  const [lastCheck, setLastCheck] = useState(null);

  const checkApiStatus = async () => {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY || localStorage.getItem('gemini_api_key');
    
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      setStatus('no-key');
      return;
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const result = await model.generateContent("Test");
      await result.response;
      
      setStatus('online');
      setLastCheck(new Date());
    } catch (error) {
      if (error.message.includes('503')) {
        setStatus('overloaded');
      } else if (error.message.includes('API key')) {
        setStatus('invalid-key');
      } else {
        setStatus('offline');
      }
      setLastCheck(new Date());
    }
  };

  useEffect(() => {
    checkApiStatus();
    // Check status every 5 minutes
    const interval = setInterval(checkApiStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusInfo = () => {
    switch (status) {
      case 'checking':
        return { variant: 'secondary', text: 'Checking...', tooltip: 'Checking API status' };
      case 'online':
        return { variant: 'success', text: 'AI Online', tooltip: 'All AI features available' };
      case 'overloaded':
        return { variant: 'warning', text: 'AI Busy', tooltip: 'AI service is overloaded, using fallbacks' };
      case 'offline':
        return { variant: 'danger', text: 'AI Offline', tooltip: 'AI service unavailable, using local analysis' };
      case 'no-key':
        return { variant: 'secondary', text: 'No API Key', tooltip: 'Please configure your API key' };
      case 'invalid-key':
        return { variant: 'danger', text: 'Invalid Key', tooltip: 'API key is invalid or expired' };
      default:
        return { variant: 'secondary', text: 'Unknown', tooltip: 'Status unknown' };
    }
  };

  const statusInfo = getStatusInfo();

  const tooltip = (
    <Tooltip>
      {statusInfo.tooltip}
      {lastCheck && (
        <div>Last checked: {lastCheck.toLocaleTimeString()}</div>
      )}
    </Tooltip>
  );

  return (
    <OverlayTrigger placement="top" overlay={tooltip}>
      <Badge 
        bg={statusInfo.variant} 
        style={{ cursor: 'pointer' }}
        onClick={checkApiStatus}
      >
        🤖 {statusInfo.text}
      </Badge>
    </OverlayTrigger>
  );
};

export default ApiStatus;