"use client";

import { Component, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  name?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorId: string | null;
}

function generateErrorId(): string {
  // Generate a short error ID for tracking (timestamp + random)
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `err_${timestamp}_${random}`;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private boundaryName: string;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorId: null };
    this.boundaryName = props.name || "UnnamedBoundary";
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    const errorId = generateErrorId();
    return { hasError: true, errorId };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error with boundary name for observability
    console.error(`[ErrorBoundary:${this.boundaryName}] Caught error:`, {
      errorId: this.state.errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      boundaryName: this.boundaryName,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A96E]/10 mb-4">
              <svg
                className="h-8 w-8 text-[#C9A96E]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold mb-1 text-foreground">Something went wrong</h2>
            {this.state.errorId && (
              <p className="text-xs text-muted-foreground mb-3">
                Error ID: {this.state.errorId}
              </p>
            )}
            <button
              onClick={() => this.setState({ hasError: false, errorId: null })}
              className="text-sm font-medium text-[#C9A96E] hover:underline"
            >
              Try again
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
