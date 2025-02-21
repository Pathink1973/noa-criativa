import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Erro na aplicação:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-primary-purple via-primary-orange to-accent-pink flex items-center justify-center p-4">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-primary-purple mb-4">
              Ops! Algo correu mal.
            </h2>
            <p className="text-neutral-600 mb-4">
              Pedimos desculpa pelo inconveniente. Por favor, tenta recarregar a página.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary-purple text-white px-4 py-2 rounded-xl hover:bg-accent-purple transition-colors"
            >
              Recarregar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;