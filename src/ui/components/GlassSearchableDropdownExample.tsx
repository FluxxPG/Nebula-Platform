import React, { useState } from 'react';
import { User, Building, Briefcase, Mail } from 'lucide-react';
import { GlassSearchableDropdown, DropdownOption } from './GlassSearchableDropdown';
import { GlassCard } from './GlassCard';
import { spacing } from '..';

// Example component to demonstrate GlassSearchableDropdown usage
export const GlassSearchableDropdownExample: React.FC = () => {
  // State for basic dropdown
  const [selectedValue, setSelectedValue] = useState<string>('');
  
  // State for multiple selection dropdown
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  
  // State for server-side search dropdown
  const [serverSelectedValue, setServerSelectedValue] = useState<string>('');
  
  // Mock options with icons
  const options: DropdownOption[] = [
    { value: 'user1', label: 'John Smith', icon: <User size={16} /> },
    { value: 'user2', label: 'Sarah Johnson', icon: <User size={16} /> },
    { value: 'user3', label: 'Michael Brown', icon: <User size={16} /> },
    { value: 'user4', label: 'Emily Davis', icon: <User size={16} /> },
    { value: 'user5', label: 'David Wilson', icon: <User size={16} /> },
    { value: 'building1', label: 'Headquarters', icon: <Building size={16} /> },
    { value: 'building2', label: 'Branch Office', icon: <Building size={16} /> },
    { value: 'company1', label: 'Acme Corp', icon: <Briefcase size={16} /> },
    { value: 'company2', label: 'Globex Inc', icon: <Briefcase size={16} /> },
    { value: 'company3', label: 'Initech', icon: <Briefcase size={16} /> },
  ];
  
  // Mock server-side search function
  const handleServerSearch = async (query: string): Promise<DropdownOption[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Filter options based on query
    if (!query) return [];
    
    // Simulate server-side filtering
    return [
      { value: `server1_${query}`, label: `${query} - Result 1`, icon: <Mail size={16} /> },
      { value: `server2_${query}`, label: `${query} - Result 2`, icon: <Mail size={16} /> },
      { value: `server3_${query}`, label: `${query} - Result 3`, icon: <Mail size={16} /> },
    ];
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>
      <GlassCard variant="primary" padding="lg">
        <h3 style={{ marginBottom: spacing.lg, fontSize: '1.25rem', fontWeight: '700' }}>Basic Searchable Dropdown</h3>
        <GlassSearchableDropdown
          options={options}
          value={selectedValue}
          onChange={(value) => setSelectedValue(value as string)}
          placeholder="Select a user or company"
          label="Basic Dropdown"
          required
        />
        <div style={{ marginTop: spacing.md, fontSize: '0.875rem' }}>
          Selected value: {selectedValue || 'None'}
        </div>
      </GlassCard>
      
      <GlassCard variant="primary" padding="lg">
        <h3 style={{ marginBottom: spacing.lg, fontSize: '1.25rem', fontWeight: '700' }}>Multiple Selection Dropdown</h3>
        <GlassSearchableDropdown
          options={options}
          value={selectedValues}
          onChange={(value) => setSelectedValues(value as string[])}
          placeholder="Select multiple options"
          label="Multiple Selection"
          multiple
        />
        <div style={{ marginTop: spacing.md, fontSize: '0.875rem' }}>
          Selected values: {selectedValues.length > 0 ? selectedValues.join(', ') : 'None'}
        </div>
      </GlassCard>
      
      <GlassCard variant="primary" padding="lg">
        <h3 style={{ marginBottom: spacing.lg, fontSize: '1.25rem', fontWeight: '700' }}>Server-side Search Dropdown</h3>
        <GlassSearchableDropdown
          options={[]}
          value={serverSelectedValue}
          onChange={(value) => setServerSelectedValue(value as string)}
          placeholder="Type to search server options"
          label="Server-side Search"
          serverSideSearch
          onSearch={handleServerSearch}
          minSearchLength={2}
          searchPlaceholder="Type at least 2 characters to search..."
          noOptionsMessage="Type to search for options"
          loadingMessage="Searching options..."
        />
        <div style={{ marginTop: spacing.md, fontSize: '0.875rem' }}>
          Selected value: {serverSelectedValue || 'None'}
        </div>
      </GlassCard>
    </div>
  );
};