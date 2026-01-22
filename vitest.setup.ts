import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
    cleanup();
});

// Mock environment variables
vi.stubEnv('VITE_GEMINI_API_KEY', 'test-api-key');
vi.stubEnv('VITE_SUPABASE_URL', 'https://test.supabase.co');
vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'test-anon-key');

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};

    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value.toString();
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

// Mock fetch
global.fetch = vi.fn();

// Mock Image for canvas operations
class ImageMock {
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    src = '';
    width = 1024;
    height = 768;

    constructor() {
        setTimeout(() => {
            if (this.onload) this.onload();
        }, 0);
    }
}

global.Image = ImageMock as any;

// Mock canvas
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    drawImage: vi.fn(),
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    getImageData: vi.fn(),
    putImageData: vi.fn(),
    createImageData: vi.fn(),
    setTransform: vi.fn(),
    resetTransform: vi.fn(),
    canvas: document.createElement('canvas'),
})) as any;

HTMLCanvasElement.prototype.toDataURL = vi.fn(() => 'data:image/webp;base64,mockImageData');
