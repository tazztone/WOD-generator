import { render, screen, fireEvent } from '@testing-library/react';
import { ConfigScreen } from './ConfigScreen';
import { describe, it, expect, vi } from 'vitest';
import { DEFAULT_CONFIG } from '../engine/storage';

describe('ConfigScreen', () => {
    const mockProps = {
        config: DEFAULT_CONFIG,
        setConfig: vi.fn(),
        onGenerate: vi.fn(),
        lang: 'en',
        onTooltip: vi.fn()
    };

    it('renders all main configuration sections', () => {
        render(<ConfigScreen {...mockProps} />);
        expect(screen.getByText(/duration/i)).toBeInTheDocument();
        expect(screen.getByText(/movements/i)).toBeInTheDocument();
        expect(screen.getByText(/style/i)).toBeInTheDocument();
        expect(screen.getByText(/level/i)).toBeInTheDocument();
        expect(screen.getByText(/focus/i)).toBeInTheDocument();
    });

    it('calls setConfig when duration slider changes', () => {
        render(<ConfigScreen {...mockProps} />);
        const slider = screen.getByLabelText('Duration');
        fireEvent.change(slider, { target: { value: '30' } });
        expect(mockProps.setConfig).toHaveBeenCalled();
    });

    it('calls setConfig when movements slider changes', () => {
        render(<ConfigScreen {...mockProps} />);
        const slider = screen.getByLabelText('Movements');
        fireEvent.change(slider, { target: { value: '5' } });
        expect(mockProps.setConfig).toHaveBeenCalled();
    });

    it('enables generate button when equipment is selected', () => {
        render(<ConfigScreen {...mockProps} />);
        const generateBtn = screen.getByRole('button', { name: /generate/i });
        expect(generateBtn).not.toBeDisabled();
    });

    it('disables generate button when no equipment is selected', () => {
        const noEquipConfig = {
            ...DEFAULT_CONFIG,
            equipment: { barbell: false, dumbbell: false, pullupBar: false, machine: false }
        };
        render(<ConfigScreen {...mockProps} config={noEquipConfig} />);
        const generateBtn = screen.getByRole('button', { name: /generate/i });
        expect(generateBtn).toBeDisabled();
    });
});
