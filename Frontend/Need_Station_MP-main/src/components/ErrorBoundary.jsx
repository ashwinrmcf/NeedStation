import React from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-8">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-3xl font-bold mb-2 text-red-400">Oops! Something went wrong</h1>
              <p className="text-gray-300 mb-6">
                We encountered an unexpected error. Don't worry, our team has been notified.
              </p>
            </div>
            
            <div className="space-y-4">
              <Link 
                to="/" 
                className="block w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Go to Home
              </Link>
              
              <button 
                onClick={() => window.location.reload()} 
                className="block w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Reload Page
              </button>
              
              <button 
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })} 
                className="block w-full bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-8 text-left">
                <summary className="cursor-pointer text-red-400 font-medium mb-2">
                  Error Details (Development Mode)
                </summary>
                <div className="bg-gray-800 p-4 rounded-lg text-xs overflow-auto">
                  <div className="text-red-400 font-bold mb-2">Error:</div>
                  <pre className="whitespace-pre-wrap mb-4">{this.state.error.toString()}</pre>
                  
                  <div className="text-red-400 font-bold mb-2">Stack Trace:</div>
                  <pre className="whitespace-pre-wrap text-gray-400">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
