import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Track error in analytics
    const win = window as unknown as { gtag?: (...args: unknown[]) => void };
    if (win.gtag) {
      win.gtag('event', 'exception', {
        description: error.message,
        fatal: true,
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center p-6">
          <div className="max-w-md text-center">
            <div className="mb-6">
              <span className="text-6xl">😅</span>
            </div>
            <h2 className="text-2xl font-bold text-[#2C1810] mb-3">
              Oops! Something went wrong
            </h2>
            <p className="text-[#2C1810]/70 mb-6">
              Don't worry - your data is safe. Try refreshing the page or going back home.
            </p>
            
            {this.state.error && (
              <details className="mb-6 text-left">
                <summary className="text-sm text-[#2C1810]/50 cursor-pointer hover:text-[#2C1810]/70">
                  Technical details
                </summary>
                <pre className="mt-2 p-3 bg-white rounded-lg text-xs text-[#2C1810]/60 overflow-auto max-h-32">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-[#7FBFA0] hover:bg-[#6AA88A] text-white rounded-xl font-semibold transition-colors"
              >
                Refresh Page
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 bg-[#E86A58] hover:bg-[#D35A4A] text-white rounded-xl font-semibold transition-colors"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
