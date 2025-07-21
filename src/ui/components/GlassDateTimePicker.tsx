import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useThemeColors } from '../hooks/useThemeColors';
import { spacing, borderRadius, shadows, animations } from '..';

interface GlassDateTimePickerProps {
  value?: string | { date?: string; time?: string };
  onChange?: (value: { date?: string; time?: string }) => void;
  placeholder?: string;
  disabled?: boolean;
  mode?: 'date' | 'time' | 'datetime';
  className?: string;
  label?: string;
  required?: boolean;
  error?: string;
}

export const GlassDateTimePicker: React.FC<GlassDateTimePickerProps> = ({
  value,
  onChange,
  placeholder = 'Select date and time',
  disabled = false,
  mode = 'datetime',
  className = '',
  label,
  required = false,
  error,
}) => {
  const colors = useThemeColors();
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | undefined>(
    typeof value === 'object' ? value?.date : undefined
  );
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    typeof value === 'object' ? value?.time : undefined
  );
  const [focused, setFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Parse value if it's an ISO string
  useEffect(() => {
    if (typeof value === 'string' && value) {
      try {
        const date = new Date(value);
        setSelectedDate(date.toISOString().split('T')[0]);
        setSelectedTime(date.toTimeString().split(' ')[0].substring(0, 5));
      } catch (e) {
        console.error('Invalid date string:', value);
      }
    } else if (typeof value === 'object' && value !== null) {
      setSelectedDate(value.date);
      setSelectedTime(value.time);
    }
  }, [value]);

  // Set current date to selected date when opening picker
  useEffect(() => {
    if (isOpen && selectedDate) {
      try {
        setCurrentDate(new Date(selectedDate));
      } catch (e) {
        setCurrentDate(new Date());
      }
    }
  }, [isOpen, selectedDate]);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current && 
        !pickerRef.current.contains(event.target as Node) &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const containerStyles: React.CSSProperties = {
    position: 'relative',
    width: '100%',
  };

  const labelStyles: React.CSSProperties = {
    display: 'block',
    marginBottom: spacing.sm,
    fontSize: '0.875rem',
    fontWeight: '600',
    color: colors.text.primary,
  };

  const inputContainerStyles: React.CSSProperties = {
    position: 'relative',
    width: '100%',
  };

  const inputStyles: React.CSSProperties = {
    width: '100%',
    padding: `${spacing.lg} ${spacing.xl}`,
    paddingLeft: mode !== 'time' ? '2.5rem' : spacing.xl,
    paddingRight: selectedDate || selectedTime ? '2.5rem' : spacing.xl,
    background: colors.glass.primary,
    border: `2px solid ${error ? '#ef4444' : focused ? colors.border.medium : colors.border.light}`,
    borderRadius: borderRadius.lg,
    fontSize: '0.875rem',
    color: colors.text.primary,
    outline: 'none',
    transition: 'all 0.2s ease',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    boxShadow: focused ? shadows.glassHover : shadows.glass,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.7 : 1,
  };

  const iconStyles: React.CSSProperties = {
    position: 'absolute',
    left: spacing.lg,
    top: '50%',
    transform: 'translateY(-50%)',
    color: colors.text.secondary,
    pointerEvents: 'none',
  };

  const clearButtonStyles: React.CSSProperties = {
    position: 'absolute',
    right: spacing.lg,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'transparent',
    border: 'none',
    color: colors.text.secondary,
    cursor: 'pointer',
    padding: spacing.xs,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  };

  const pickerStyles: React.CSSProperties = {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    left: 0,
    width: mode === 'datetime' ? '320px' : '280px',
    background: colors.glass.primary,
    border: `2px solid ${colors.border.medium}`,
    borderRadius: borderRadius.lg,
    backdropFilter: 'blur(40px)',
    WebkitBackdropFilter: 'blur(40px)',
    boxShadow: shadows.dropdown,
    zIndex: 1000,
    opacity: isOpen ? 1 : 0,
    visibility: isOpen ? 'visible' : 'hidden',
    transform: isOpen ? 'translateY(0)' : 'translateY(-10px)',
    transition: `all ${animations.duration.normal} ${animations.easing.smooth}`,
    overflow: 'hidden',
  };

  const pickerHeaderStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottom: `1px solid ${colors.border.light}`,
    background: colors.glass.secondary,
  };

  const monthYearStyles: React.CSSProperties = {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: colors.text.primary,
  };

  const navButtonStyles: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    color: colors.text.secondary,
    cursor: 'pointer',
    padding: spacing.xs,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  };

  const calendarStyles: React.CSSProperties = {
    padding: spacing.md,
  };

  const weekdaysStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  };

  const weekdayStyles: React.CSSProperties = {
    textAlign: 'center',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: colors.text.secondary,
    padding: spacing.xs,
  };

  const daysGridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: spacing.xs,
  };

  const dayButtonStyles = (isSelected: boolean, isToday: boolean, isCurrentMonth: boolean): React.CSSProperties => ({
    width: '100%',
    aspectRatio: '1/1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: isSelected || isToday ? '600' : '400',
    color: !isCurrentMonth 
      ? colors.text.tertiary 
      : isSelected 
        ? 'white' 
        : colors.text.primary,
    background: isSelected 
      ? colors.gradients.primary 
      : isToday 
        ? colors.glass.secondary 
        : 'transparent',
    border: isToday && !isSelected ? `1px solid ${colors.border.medium}` : 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  });

  const timePickerStyles: React.CSSProperties = {
    padding: spacing.md,
    borderTop: mode === 'datetime' ? `1px solid ${colors.border.light}` : 'none',
  };

  const timeInputStyles: React.CSSProperties = {
    width: '100%',
    padding: spacing.md,
    background: colors.glass.secondary,
    border: `1px solid ${colors.border.light}`,
    borderRadius: borderRadius.md,
    fontSize: '0.875rem',
    color: colors.text.primary,
    outline: 'none',
  };

  const actionButtonsStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    padding: spacing.md,
    borderTop: `1px solid ${colors.border.light}`,
    background: colors.glass.secondary,
  };

  const actionButtonStyles = (isPrimary: boolean): React.CSSProperties => ({
    padding: `${spacing.sm} ${spacing.md}`,
    background: isPrimary ? colors.gradients.primary : 'transparent',
    color: isPrimary ? 'white' : colors.text.secondary,
    border: 'none',
    borderRadius: borderRadius.md,
    fontSize: '0.75rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  });

  const errorStyles: React.CSSProperties = {
    fontSize: '0.75rem',
    color: '#ef4444',
    marginTop: spacing.xs,
  };

  const handleInputClick = () => {
    if (!disabled) {
      setIsOpen(true);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDate(undefined);
    setSelectedTime(undefined);
    onChange?.({ date: undefined, time: undefined });
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDayClick = (day: number, month: number, year: number) => {
    const newDate = new Date(year, month, day);
    const dateString = newDate.toISOString().split('T')[0];
    setSelectedDate(dateString);
    
    if (mode === 'date') {
      onChange?.({ date: dateString, time: selectedTime });
      setIsOpen(false);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(e.target.value);
  };

  const handleApply = () => {
    onChange?.({ date: selectedDate, time: selectedTime });
    setIsOpen(false);
  };

  const handleCancel = () => {
    // Revert to previous values
    if (typeof value === 'object' && value !== null) {
      setSelectedDate(value.date);
      setSelectedTime(value.time);
    } else if (typeof value === 'string' && value) {
      try {
        const date = new Date(value);
        setSelectedDate(date.toISOString().split('T')[0]);
        setSelectedTime(date.toTimeString().split(' ')[0].substring(0, 5));
      } catch (e) {
        setSelectedDate(undefined);
        setSelectedTime(undefined);
      }
    } else {
      setSelectedDate(undefined);
      setSelectedTime(undefined);
    }
    setIsOpen(false);
  };

  // Generate calendar days
  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get first day of month and last day
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Get day of week for first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay();
    
    // Get total days in month
    const daysInMonth = lastDay.getDate();
    
    // Get days from previous month to fill first week
    const daysFromPrevMonth = firstDayOfWeek;
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    // Get days from next month to fill last week
    const daysFromNextMonth = 42 - daysInMonth - daysFromPrevMonth; // 42 = 6 weeks * 7 days
    
    // Today's date for highlighting
    const today = new Date();
    const isToday = (day: number, month: number, year: number) => {
      return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    };
    
    // Check if a date is selected
    const isSelected = (day: number, month: number, year: number) => {
      if (!selectedDate) return false;
      const selected = new Date(selectedDate);
      return day === selected.getDate() && month === selected.getMonth() && year === selected.getFullYear();
    };
    
    // Weekday headers
    const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    
    return (
      <div style={calendarStyles}>
        <div style={weekdaysStyles}>
          {weekdays.map((day) => (
            <div key={day} style={weekdayStyles}>
              {day}
            </div>
          ))}
        </div>
        
        <div style={daysGridStyles}>
          {/* Previous month days */}
          {Array.from({ length: daysFromPrevMonth }).map((_, index) => {
            const day = prevMonthLastDay - daysFromPrevMonth + index + 1;
            const prevMonth = month - 1 < 0 ? 11 : month - 1;
            const prevYear = month - 1 < 0 ? year - 1 : year;
            
            return (
              <button
                key={`prev-${day}`}
                style={dayButtonStyles(
                  isSelected(day, prevMonth, prevYear),
                  isToday(day, prevMonth, prevYear),
                  false
                )}
                onClick={() => handleDayClick(day, prevMonth, prevYear)}
                type="button"
              >
                {day}
              </button>
            );
          })}
          
          {/* Current month days */}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            
            return (
              <button
                key={`current-${day}`}
                style={dayButtonStyles(
                  isSelected(day, month, year),
                  isToday(day, month, year),
                  true
                )}
                onClick={() => handleDayClick(day, month, year)}
                type="button"
              >
                {day}
              </button>
            );
          })}
          
          {/* Next month days */}
          {Array.from({ length: daysFromNextMonth }).map((_, index) => {
            const day = index + 1;
            const nextMonth = month + 1 > 11 ? 0 : month + 1;
            const nextYear = month + 1 > 11 ? year + 1 : year;
            
            return (
              <button
                key={`next-${day}`}
                style={dayButtonStyles(
                  isSelected(day, nextMonth, nextYear),
                  isToday(day, nextMonth, nextYear),
                  false
                )}
                onClick={() => handleDayClick(day, nextMonth, nextYear)}
                type="button"
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Format display value
  const getDisplayValue = () => {
    if (!selectedDate && !selectedTime) return '';
    
    let display = '';
    
    if (mode !== 'time' && selectedDate) {
      try {
        const date = new Date(selectedDate);
        display = date.toLocaleDateString();
      } catch (e) {
        display = selectedDate;
      }
    }
    
    if (mode !== 'date' && selectedTime) {
      if (display) display += ' ';
      display += selectedTime;
    }
    
    return display;
  };

  return (
    <>
      <style>
        {`
          .datetime-picker-input:hover {
            border-color: ${colors.border.medium} !important;
          }
          
          .datetime-picker-clear:hover {
            background: rgba(255, 255, 255, 0.1) !important;
            color: white !important;
          }
          
          .datetime-nav-button:hover {
            background: rgba(255, 255, 255, 0.1) !important;
            color: white !important;
          }
          
          .datetime-day-button:hover {
            background: ${colors.glass.secondary} !important;
            transform: scale(1.1) !important;
          }
          
          .datetime-action-button:hover {
            background: ${colors.glass.secondary} !important;
            color: white !important;
          }
          
          .datetime-action-button.primary:hover {
            background: ${colors.gradients.primary} !important;
            transform: translateY(-1px) !important;
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4) !important;
          }
        `}
      </style>
      
      <div ref={containerRef} style={containerStyles} className={className}>
        {label && (
          <label style={labelStyles}>
            {label}
            {required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
          </label>
        )}
        
        <div style={inputContainerStyles}>
          <div
            style={inputStyles}
            className="datetime-picker-input"
            onClick={handleInputClick}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            tabIndex={disabled ? -1 : 0}
            role="button"
          >
            {getDisplayValue() || placeholder}
          </div>
          
          {mode !== 'time' && (
            <div style={iconStyles}>
              <CalendarIcon size={16} />
            </div>
          )}
          
          {mode === 'time' && (
            <div style={iconStyles}>
              <Clock size={16} />
            </div>
          )}
          
          {(selectedDate || selectedTime) && (
            <button
              style={clearButtonStyles}
              onClick={handleClear}
              className="datetime-picker-clear"
              type="button"
              tabIndex={-1}
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        {error && (
          <div style={errorStyles}>{error}</div>
        )}
        
        {isOpen && (
          <div ref={pickerRef} style={pickerStyles}>
            {/* Date Picker */}
            {mode !== 'time' && (
              <>
                <div style={pickerHeaderStyles}>
                  <button
                    style={navButtonStyles}
                    onClick={handlePrevMonth}
                    className="datetime-nav-button"
                    type="button"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  
                  <div style={monthYearStyles}>
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </div>
                  
                  <button
                    style={navButtonStyles}
                    onClick={handleNextMonth}
                    className="datetime-nav-button"
                    type="button"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
                
                {renderCalendar()}
              </>
            )}
            
            {/* Time Picker */}
            {mode !== 'date' && (
              <div style={timePickerStyles}>
                <input
                  type="time"
                  value={selectedTime || ''}
                  onChange={handleTimeChange}
                  style={timeInputStyles}
                />
              </div>
            )}
            
            {/* Action Buttons */}
            <div style={actionButtonsStyles}>
              <button
                style={actionButtonStyles(false)}
                onClick={handleCancel}
                className="datetime-action-button"
                type="button"
              >
                Cancel
              </button>
              
              <button
                style={actionButtonStyles(true)}
                onClick={handleApply}
                className="datetime-action-button primary"
                type="button"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};