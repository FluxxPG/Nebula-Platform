import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GlassSearchableDropdown } from './GlassSearchableDropdown';

// Mock options for testing
const mockOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
  { value: 'option4', label: 'Option 4' },
  { value: 'option5', label: 'Option 5' },
];

describe('GlassSearchableDropdown', () => {
  test('renders with placeholder', () => {
    render(
      <GlassSearchableDropdown
        options={mockOptions}
        placeholder="Select an option"
      />
    );
    
    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });

  test('opens dropdown when clicked', () => {
    render(
      <GlassSearchableDropdown
        options={mockOptions}
        placeholder="Select an option"
      />
    );
    
    fireEvent.click(screen.getByText('Select an option'));
    
    // Check if search input is visible
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    
    // Check if options are visible
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  test('filters options when searching', () => {
    render(
      <GlassSearchableDropdown
        options={mockOptions}
        placeholder="Select an option"
      />
    );
    
    fireEvent.click(screen.getByText('Select an option'));
    
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: '1' } });
    
    // Only Option 1 should be visible
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
  });

  test('selects an option when clicked', () => {
    const handleChange = jest.fn();
    
    render(
      <GlassSearchableDropdown
        options={mockOptions}
        placeholder="Select an option"
        onChange={handleChange}
      />
    );
    
    fireEvent.click(screen.getByText('Select an option'));
    fireEvent.click(screen.getByText('Option 2'));
    
    expect(handleChange).toHaveBeenCalledWith('option2');
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  test('supports multiple selection', () => {
    const handleChange = jest.fn();
    
    render(
      <GlassSearchableDropdown
        options={mockOptions}
        placeholder="Select options"
        multiple
        onChange={handleChange}
      />
    );
    
    fireEvent.click(screen.getByText('Select options'));
    fireEvent.click(screen.getByText('Option 1'));
    
    expect(handleChange).toHaveBeenCalledWith(['option1']);
    
    // Dropdown should still be open
    fireEvent.click(screen.getByText('Option 3'));
    
    expect(handleChange).toHaveBeenCalledWith(['option1', 'option3']);
  });

  test('supports server-side search', async () => {
    const handleSearch = jest.fn().mockImplementation((query) => {
      return [
        { value: 'server1', label: 'Server Option 1' },
        { value: 'server2', label: 'Server Option 2' },
      ];
    });
    
    render(
      <GlassSearchableDropdown
        options={mockOptions}
        placeholder="Select an option"
        serverSideSearch
        onSearch={handleSearch}
        debounceMs={0} // No debounce for testing
      />
    );
    
    fireEvent.click(screen.getByText('Select an option'));
    
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    await waitFor(() => {
      expect(handleSearch).toHaveBeenCalledWith('test');
      expect(screen.getByText('Server Option 1')).toBeInTheDocument();
      expect(screen.getByText('Server Option 2')).toBeInTheDocument();
    });
  });

  test('shows loading state during server-side search', async () => {
    const handleSearch = jest.fn().mockImplementation(async (query) => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 100));
      return [
        { value: 'server1', label: 'Server Option 1' },
      ];
    });
    
    render(
      <GlassSearchableDropdown
        options={mockOptions}
        placeholder="Select an option"
        serverSideSearch
        onSearch={handleSearch}
        loadingMessage="Loading options..."
        debounceMs={0} // No debounce for testing
      />
    );
    
    fireEvent.click(screen.getByText('Select an option'));
    
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    // Should show loading state
    expect(screen.getByText('Loading options...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Server Option 1')).toBeInTheDocument();
    });
  });
});