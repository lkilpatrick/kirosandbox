import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ActivitySelector, { Activity } from './ActivitySelector';

describe('ActivitySelector', () => {
  it('renders all three activity buttons', () => {
    const mockOnChange = vi.fn();
    const selectedActivity: Activity = 'boating';

    render(
      <ActivitySelector
        selectedActivity={selectedActivity}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('Boating')).toBeInTheDocument();
    expect(screen.getByText('Fishing')).toBeInTheDocument();
    expect(screen.getByText('Diving')).toBeInTheDocument();
  });

  it('highlights the selected activity', () => {
    const mockOnChange = vi.fn();
    const selectedActivity: Activity = 'fishing';

    render(
      <ActivitySelector
        selectedActivity={selectedActivity}
        onChange={mockOnChange}
      />
    );

    const fishingButton = screen.getByRole('button', { name: /Select Fishing/i });
    expect(fishingButton).toHaveAttribute('aria-pressed', 'true');
    expect(fishingButton).toHaveClass('bg-blue-600');
  });

  it('calls onChange when an activity button is clicked', () => {
    const mockOnChange = vi.fn();
    const selectedActivity: Activity = 'boating';

    render(
      <ActivitySelector
        selectedActivity={selectedActivity}
        onChange={mockOnChange}
      />
    );

    const divingButton = screen.getByRole('button', { name: /Select Diving/i });
    fireEvent.click(divingButton);

    expect(mockOnChange).toHaveBeenCalledWith('diving');
  });

  it('applies correct styling to unselected activities', () => {
    const mockOnChange = vi.fn();
    const selectedActivity: Activity = 'boating';

    render(
      <ActivitySelector
        selectedActivity={selectedActivity}
        onChange={mockOnChange}
      />
    );

    const fishingButton = screen.getByRole('button', { name: /Select Fishing/i });
    expect(fishingButton).toHaveAttribute('aria-pressed', 'false');
    expect(fishingButton).toHaveClass('bg-white');
  });

  it('allows switching between activities', () => {
    const mockOnChange = vi.fn();
    const selectedActivity: Activity = 'boating';

    render(
      <ActivitySelector
        selectedActivity={selectedActivity}
        onChange={mockOnChange}
      />
    );

    // Click fishing
    fireEvent.click(screen.getByRole('button', { name: /Select Fishing/i }));
    expect(mockOnChange).toHaveBeenCalledWith('fishing');

    // Click diving
    fireEvent.click(screen.getByRole('button', { name: /Select Diving/i }));
    expect(mockOnChange).toHaveBeenCalledWith('diving');

    // Click boating
    fireEvent.click(screen.getByRole('button', { name: /Select Boating/i }));
    expect(mockOnChange).toHaveBeenCalledWith('boating');
  });
});
