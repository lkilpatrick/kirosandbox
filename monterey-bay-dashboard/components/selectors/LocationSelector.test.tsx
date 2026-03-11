import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LocationSelector from './LocationSelector';
import { MONTEREY_BAY_LOCATIONS } from '@/models';

describe('LocationSelector', () => {
  it('renders all locations in the dropdown', () => {
    const mockOnChange = vi.fn();
    const selectedLocation = MONTEREY_BAY_LOCATIONS[0];

    render(
      <LocationSelector
        locations={MONTEREY_BAY_LOCATIONS}
        selectedLocation={selectedLocation}
        onChange={mockOnChange}
      />
    );

    const select = screen.getByLabelText('Location');
    expect(select).toBeInTheDocument();

    // Check all locations are present
    MONTEREY_BAY_LOCATIONS.forEach(location => {
      expect(screen.getByText(location.name)).toBeInTheDocument();
    });
  });

  it('displays the selected location', () => {
    const mockOnChange = vi.fn();
    const selectedLocation = MONTEREY_BAY_LOCATIONS[1]; // Breakwater

    render(
      <LocationSelector
        locations={MONTEREY_BAY_LOCATIONS}
        selectedLocation={selectedLocation}
        onChange={mockOnChange}
      />
    );

    const select = screen.getByLabelText('Location') as HTMLSelectElement;
    expect(select.value).toBe(selectedLocation.id);
  });

  it('calls onChange when a new location is selected', () => {
    const mockOnChange = vi.fn();
    const selectedLocation = MONTEREY_BAY_LOCATIONS[0];

    render(
      <LocationSelector
        locations={MONTEREY_BAY_LOCATIONS}
        selectedLocation={selectedLocation}
        onChange={mockOnChange}
      />
    );

    const select = screen.getByLabelText('Location');
    fireEvent.change(select, { target: { value: MONTEREY_BAY_LOCATIONS[2].id } });

    expect(mockOnChange).toHaveBeenCalledWith(MONTEREY_BAY_LOCATIONS[2]);
  });

  it('displays activity notes when available', () => {
    const mockOnChange = vi.fn();
    const selectedLocation = MONTEREY_BAY_LOCATIONS[0];

    render(
      <LocationSelector
        locations={MONTEREY_BAY_LOCATIONS}
        selectedLocation={selectedLocation}
        onChange={mockOnChange}
      />
    );

    if (selectedLocation.activityNotes) {
      expect(screen.getByText(selectedLocation.activityNotes)).toBeInTheDocument();
    }
  });

  it('handles locations without activity notes', () => {
    const mockOnChange = vi.fn();
    const locationWithoutNotes = {
      id: 'test-location',
      name: 'Test Location',
      latitude: 36.6,
      longitude: -121.9
    };

    render(
      <LocationSelector
        locations={[locationWithoutNotes]}
        selectedLocation={locationWithoutNotes}
        onChange={mockOnChange}
      />
    );

    const select = screen.getByLabelText('Location');
    expect(select).toBeInTheDocument();
  });
});
