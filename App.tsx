import React from 'react';
import AuthGate from './components/auth/AuthGate';
import MainShell from './components/layout/MainShell';
import ThemeManager from './components/common/ThemeManager';
import ErrorBoundary from './components/common/ErrorBoundary';
import Toast from './components/common/Toast';

const App: React.FC = () => {
    return (
        <ErrorBoundary>
            <AuthGate>
                <ThemeManager />
                <MainShell />
                <Toast />
            </AuthGate>
        </ErrorBoundary>
    );
};

export default App;
