import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdatePrompt } from './UpdatePrompt';
import { useRegisterSW } from 'virtual:pwa-register/react';

vi.mock('virtual:pwa-register/react', () => ({
    useRegisterSW: vi.fn()
}));

describe('UpdatePrompt', () => {
    let mockSetNeedRefresh;
    let mockUpdateServiceWorker;

    beforeEach(() => {
        vi.clearAllMocks();
        mockSetNeedRefresh = vi.fn();
        mockUpdateServiceWorker = vi.fn();

        // Default mock implementation (needRefresh is false)
        useRegisterSW.mockReturnValue({
            needRefresh: [false, mockSetNeedRefresh],
            updateServiceWorker: mockUpdateServiceWorker,
        });
    });

    it('returns null and renders nothing when needRefresh is false', () => {
        const { container } = render(<UpdatePrompt />);
        expect(container).toBeEmptyDOMElement();
        expect(screen.queryByText('Update Available')).not.toBeInTheDocument();
    });

    it('renders the update UI when needRefresh is true', () => {
        useRegisterSW.mockReturnValue({
            needRefresh: [true, mockSetNeedRefresh],
            updateServiceWorker: mockUpdateServiceWorker,
        });

        render(<UpdatePrompt />);
        expect(screen.getByText('Update Available')).toBeInTheDocument();
        expect(screen.getByText('A new version of the app is ready.')).toBeInTheDocument();
        expect(screen.getByText('Reload to Update')).toBeInTheDocument();
        expect(screen.getByText('✕')).toBeInTheDocument();
    });

    it('calls setNeedRefresh(false) when close button is clicked', async () => {
        useRegisterSW.mockReturnValue({
            needRefresh: [true, mockSetNeedRefresh],
            updateServiceWorker: mockUpdateServiceWorker,
        });

        render(<UpdatePrompt />);

        const user = userEvent.setup();
        const closeButton = screen.getByText('✕');

        await user.click(closeButton);

        expect(mockSetNeedRefresh).toHaveBeenCalledWith(false);
        expect(mockSetNeedRefresh).toHaveBeenCalledTimes(1);
    });

    it('calls updateServiceWorker(true) when "Reload to Update" button is clicked', async () => {
        useRegisterSW.mockReturnValue({
            needRefresh: [true, mockSetNeedRefresh],
            updateServiceWorker: mockUpdateServiceWorker,
        });

        render(<UpdatePrompt />);

        const user = userEvent.setup();
        const updateButton = screen.getByText('Reload to Update');

        await user.click(updateButton);

        expect(mockUpdateServiceWorker).toHaveBeenCalledWith(true);
        expect(mockUpdateServiceWorker).toHaveBeenCalledTimes(1);
    });

    it('logs to console.error when onRegisterError callback is triggered', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        render(<UpdatePrompt />);

        // Extract the config object passed to useRegisterSW
        expect(useRegisterSW).toHaveBeenCalled();
        const config = useRegisterSW.mock.calls[0][0];

        // Trigger the error callback manually
        const testError = new Error('Test SW Error');
        config.onRegisterError(testError);

        expect(consoleSpy).toHaveBeenCalledWith('SW registration error', testError);

        consoleSpy.mockRestore();
    });
});
