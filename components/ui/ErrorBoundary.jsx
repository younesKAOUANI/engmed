import React from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw } from "lucide-react";

/**
 * React error boundary — catches uncaught render errors and shows a polished
 * fallback instead of a blank white screen.
 *
 * Wrap the root layout or individual page shells with this component.
 *
 * @example
 * <ErrorBoundary>
 *   <PageContent />
 * </ErrorBoundary>
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // In production you would send this to Sentry / Datadog / etc.
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center px-6">
          <div className="max-w-md w-full text-center flex flex-col items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-dangerBg flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-danger" aria-hidden="true" />
            </div>
            <div>
              <h1 className="heading-lg text-ink-900 mb-2">Something went wrong</h1>
              <p className="body-sm text-ink-500">
                An unexpected error occurred. Our team has been notified. You can try
                refreshing the page or return to the dashboard.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="inline-flex items-center gap-2 h-10 px-4 bg-surface border border-ink-300 rounded-sm text-[15px] font-medium text-ink-700 hover:bg-surface2 transition-colors"
              >
                <RefreshCw className="w-4 h-4" aria-hidden="true" />
                Refresh page
              </button>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 h-10 px-4 bg-brand-600 rounded-sm text-[15px] font-medium text-white hover:bg-brand-700 transition-colors"
              >
                Go to dashboard
              </Link>
            </div>
            {process.env.NODE_ENV !== "production" && this.state.error && (
              <pre className="mt-4 p-4 bg-surface2 rounded-sm text-left text-[12px] text-ink-700 overflow-auto w-full max-h-48">
                {this.state.error.toString()}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
