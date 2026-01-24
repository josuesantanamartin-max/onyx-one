import React from 'react';
import AuthGate from './components/auth/AuthGate';
import MainShell from './components/layout/MainShell';
import ThemeManager from './components/common/ThemeManager';
import ErrorBoundary from './components/common/ErrorBoundary';
import Toast from './components/common/Toast';
import CookieConsent from './components/common/CookieConsent';
import { VoiceAssistantFab } from './components/features/voice/VoiceAssistantFab';

const App: React.FC = () => {
    return (
        <ErrorBoundary>
            <AuthGate>
                <ThemeManager />
                <MainShell />
                <br />
                <Toast />
                <CookieConsent />
                <VoiceAssistantFab />

            </AuthGate>
        </ErrorBoundary>
    );
};

export default App;
