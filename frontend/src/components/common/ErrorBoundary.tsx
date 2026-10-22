import React, { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error in component tree:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center',
          color: '#0d1b2a',
          fontFamily: 'Inter, system-ui, sans-serif'
        }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem', color: '#1B2A4A' }}>
            Something went wrong
          </h2>
          <p style={{ maxWidth: '500px', marginBottom: '1.5rem', color: '#555', lineHeight: 1.5 }}>
            An unexpected error occurred while loading this view. You can reload the page to try again.
          </p>
          {this.state.error && (
            <pre style={{
              background: '#f4f4f4',
              padding: '0.75rem 1.25rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              color: '#d32f2f',
              maxWidth: '600px',
              overflowX: 'auto',
              marginBottom: '1.5rem',
              textAlign: 'left'
            }}>
              {this.state.error.message}
            </pre>
          )}
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 1.75rem',
              fontSize: '1rem',
              fontWeight: 600,
              backgroundColor: '#1B2A4A',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
