import React, { useState } from 'react';
import { Card, Button, Badge, ButtonGroup } from 'react-bootstrap';

const OptionsDisplay = ({ 
  title, 
  icon, 
  options, 
  backgroundColo, 
  onCopy, 
  onUseAsInput,
  extraInfo = null 
}) => {
  const [selectedOption, setSelectedOption] = useState(0);

  const cardStyle = {
    backgroundColor: backgroundColo === 'dark' ? '#1a1a1a' : '#f8f9fa',
    border: backgroundColo === 'dark' ? '1px solid #444' : '1px solid #ddd'
  };

  if (!options || options.length === 0) return null;

  return (
    <div className="mb-3 p-3 border rounded">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0">
          {icon} {title}
          {extraInfo && <small className="text-muted ms-2">({extraInfo})</small>}
        </h6>
        <div>
          <Button 
            size="sm" 
            variant="outline-primary" 
            className="me-2"
            onClick={() => onCopy(options[selectedOption].text, `${title} - ${options[selectedOption].title}`)}
          >
            📋 Copy
          </Button>
          <Button 
            size="sm" 
            variant="outline-success"
            onClick={() => onUseAsInput(options[selectedOption].text)}
          >
            ✏️ Use as Input
          </Button>
        </div>
      </div>

      {/* Option Selection Buttons */}
      <div className="mb-3">
        <ButtonGroup size="sm" className="w-100">
          {options.map((option, index) => (
            <Button
              key={index}
              variant={selectedOption === index ? "primary" : "outline-primary"}
              onClick={() => setSelectedOption(index)}
              className="flex-fill"
            >
              Option {option.option || index + 1}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      {/* Selected Option Display */}
      <Card style={cardStyle}>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <Badge bg="secondary" className="mb-0">
              {options[selectedOption].title}
            </Badge>
            <small className="text-muted">
              Option {options[selectedOption].option || selectedOption + 1} of {options.length}
            </small>
          </div>
          <p className="mb-0" style={{ fontSize: '0.9em', lineHeight: '1.5' }}>
            {options[selectedOption].text}
          </p>
        </Card.Body>
      </Card>

      {/* Quick Preview of Other Options */}
      {options.length > 1 && (
        <div className="mt-2">
          <small className="text-muted">Other options:</small>
          <div className="d-flex flex-wrap gap-1 mt-1">
            {options.map((option, index) => (
              index !== selectedOption && (
                <Badge 
                  key={index}
                  bg="outline-secondary" 
                  className="cursor-pointer"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedOption(index)}
                >
                  {option.title}
                </Badge>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OptionsDisplay;