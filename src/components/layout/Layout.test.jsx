import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Shell, Header } from './Layout';

describe('Layout Components', () => {
    describe('Shell', () => {
        it('renders children correctly', () => {
            render(
                <Shell>
                    <div data-testid="child">Test Child</div>
                </Shell>
            );
            expect(screen.getByTestId('child')).toBeInTheDocument();
            expect(screen.getByText('Test Child')).toBeInTheDocument();
        });
    });

    describe('Header', () => {
        const defaultProps = {
            onBack: vi.fn(),
            onLangToggle: vi.fn(),
            onUnitToggle: vi.fn(),
            onHistory: vi.fn(),
            onCalculator: vi.fn(),
            lang: 'en',
            unit: 'kg',
            appState: 'home'
        };

        beforeEach(() => {
            vi.clearAllMocks();
        });

        it('renders the title correctly', () => {
            render(<Header {...defaultProps} />);
            expect(screen.getByText('WOD GEN')).toBeInTheDocument();
        });

        it('triggers onBack when title is clicked', async () => {
            const user = userEvent.setup();
            render(<Header {...defaultProps} />);

            const titleElement = screen.getByText('WOD GEN');
            await user.click(titleElement);
            expect(defaultProps.onBack).toHaveBeenCalledTimes(1);
        });

        it('renders language text correctly', () => {
            render(<Header {...defaultProps} lang="de" />);
            expect(screen.getByText('DE')).toBeInTheDocument();
        });

        it('triggers onLangToggle when language button is clicked', async () => {
            const user = userEvent.setup();
            render(<Header {...defaultProps} />);

            const langButton = screen.getByText('EN').closest('button');
            await user.click(langButton);
            expect(defaultProps.onLangToggle).toHaveBeenCalledTimes(1);
        });

        it('renders unit toggle correctly', () => {
            render(<Header {...defaultProps} unit="lbs" />);
            expect(screen.getByText('LBS')).toBeInTheDocument();
        });

        it('triggers onUnitToggle when unit button is clicked', async () => {
            const user = userEvent.setup();
            render(<Header {...defaultProps} />);

            const unitButton = screen.getByText('KG').closest('button');
            await user.click(unitButton);
            expect(defaultProps.onUnitToggle).toHaveBeenCalledTimes(1);
        });

        it('triggers onCalculator when calculator button is clicked', async () => {
            const user = userEvent.setup();
            const { container } = render(<Header {...defaultProps} />);

            const buttons = container.querySelectorAll('button');
            const calcButton = buttons[2];

            await user.click(calcButton);
            expect(defaultProps.onCalculator).toHaveBeenCalledTimes(1);
        });

        it('triggers onHistory when history button is clicked', async () => {
            const user = userEvent.setup();
            const { container } = render(<Header {...defaultProps} />);

            const buttons = container.querySelectorAll('button');
            const historyButton = buttons[3];

            await user.click(historyButton);
            expect(defaultProps.onHistory).toHaveBeenCalledTimes(1);
        });

        it('applies active styling to calculator button when appState is calculator', () => {
            const { container } = render(<Header {...defaultProps} appState="calculator" />);
            const buttons = container.querySelectorAll('button');
            const calcButton = buttons[2];

            expect(calcButton.className).toContain('bg-slate-700');
            expect(calcButton.className).not.toContain('hover:bg-slate-800');
        });

        it('applies active styling to history button when appState is history', () => {
            const { container } = render(<Header {...defaultProps} appState="history" />);
            const buttons = container.querySelectorAll('button');
            const historyButton = buttons[3];

            expect(historyButton.className).toContain('bg-slate-700');
            expect(historyButton.className).not.toContain('hover:bg-slate-800');
        });
    });
});
