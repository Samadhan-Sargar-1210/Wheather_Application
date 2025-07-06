import React from 'react';
import { useTranslation } from 'react-i18next';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('Error caught by boundary:', error, errorInfo);
    }
    
    // In production, you would send this to an error reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo });
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback onRetry={this.handleRetry} />;
    }

    return this.props.children;
  }
}

// Error fallback component
const ErrorFallback = ({ onRetry }) => {
  const { t } = useTranslation();

  return (
    <div className="error-boundary" role="alert" aria-live="polite">
      <div className="error-boundary-content">
        <div className="error-icon">⚠️</div>
        <h2>{t('errors.boundary.title', 'Something went wrong')}</h2>
        <p>{t('errors.boundary.message', 'We encountered an unexpected error. Please try again.')}</p>
        
        <div className="error-actions">
          <button 
            onClick={onRetry}
            className="retry-button"
            aria-label={t('errors.boundary.retry', 'Retry')}
          >
            {t('errors.boundary.retry', 'Retry')}
          </button>
          
          <button 
            onClick={() => window.location.reload()}
            className="reload-button"
            aria-label={t('errors.boundary.reload', 'Reload page')}
          >
            {t('errors.boundary.reload', 'Reload Page')}
          </button>
        </div>
        
        {import.meta.env.DEV && (
          <details className="error-details">
            <summary>Error Details (Development Only)</summary>
            <pre className="error-stack">
              {this.state?.error?.toString()}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};

export default ErrorBoundary; 