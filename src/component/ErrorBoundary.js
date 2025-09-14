import React from 'react';
import { Alert, Button } from 'react-bootstrap';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('AI Features Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="danger" className="m-3">
          <Alert.Heading>🚨 Something went wrong</Alert.Heading>
          <p>
            There was an error with the AI features. This might be due to:
          </p>
          <ul>
            <li>Network connectivity issues</li>
            <li>API key configuration problems</li>
            <li>Temporary service unavailability</li>
          </ul>
          <hr />
          <div className="d-flex justify-content-end">
            <Button 
              variant="outline-danger"
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Try Again
            </Button>
          </div>
        </Alert>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;