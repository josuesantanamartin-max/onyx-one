import React from 'react';
import AuthGate from './components/auth/AuthGate';
import MainShell from './components/layout/MainShell';
import ThemeManager from './components/common/ThemeManager';

const App: React.FC = () => {
    return (
        <AuthGate>
            <ThemeManager />
            <MainShell />
        </AuthGate>
    );
};

export default App;
