import React from 'react';
import { 
  Type, 
  AlignLeft, 
  CheckSquare, 
  List, 
  Calendar, 
  Mail, 
  Hash, 
  Lock, 
  Upload,
  CreditCard,
  Minus,
  Space,
  Image as ImageIcon,
  FileText,
  Clock,
  Phone,
  Globe,
  MapPin,
  Star,
  ToggleLeft,
  Radio,
  CalendarClock,
  Palette,
  Link2,
  Sliders,
  Percent,
  DollarSign,
  FileDigit,
  Fingerprint,
  QrCode,
  Scan,
  Layers,
  Search,
  User,
  Camera
} from 'lucide-react';
import { useThemeColors } from '../../ui/hooks/useThemeColors';
import { spacing, borderRadius, shadows } from '../../ui';

interface WidgetType {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: 'input' | 'display' | 'layout' | 'advanced';
  description: string;
  defaultConfig: any;
}

interface WidgetLibraryProps {
  onWidgetDrag: (widgetType: WidgetType) => void;
  className?: string;
}

export const WidgetLibrary: React.FC<WidgetLibraryProps> = ({ onWidgetDrag, className = '' }) => {
  const colors = useThemeColors();

  const widgetTypes: WidgetType[] = [
    // Basic Input Widgets
    {
      id: 'text',
      name: 'Text Input',
      icon: <Type size={20} />,
      category: 'input',
      description: 'Single line text input field',
      defaultConfig: {
        type: 'text',
        label: 'Text Field',
        placeholder: 'Enter text...',
        required: false,
        width: 'full',
        validations: []
      }
    },
    {
      id: 'textarea',
      name: 'Text Area',
      icon: <AlignLeft size={20} />,
      category: 'input',
      description: 'Multi-line text input field',
      defaultConfig: {
        type: 'textarea',
        label: 'Text Area',
        placeholder: 'Enter description...',
        required: false,
        width: 'full',
        validations: []
      }
    },
    {
      id: 'select',
      name: 'Dropdown',
      icon: <List size={20} />,
      category: 'input',
      description: 'Dropdown selection field',
      defaultConfig: {
        type: 'select',
        label: 'Select Option',
        placeholder: 'Choose an option...',
        required: false,
        width: 'full',
        options: [
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' }
        ],
        validations: []
      }
    },
    {
      id: 'searchable-dropdown',
      name: 'Searchable Dropdown',
      icon: <Search size={20} />,
      category: 'input',
      description: 'Dropdown with search functionality',
      defaultConfig: {
        type: 'searchable-dropdown',
        label: 'Searchable Dropdown',
        placeholder: 'Search and select...',
        required: false,
        width: 'full',
        options: [
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' },
          { value: 'option3', label: 'Option 3' },
          { value: 'option4', label: 'Option 4' },
          { value: 'option5', label: 'Option 5' }
        ],
        serverSideSearch: false,
        multiple: false,
        validations: []
      }
    },
    {
      id: 'checkbox',
      name: 'Checkbox',
      icon: <CheckSquare size={20} />,
      category: 'input',
      description: 'Checkbox for boolean values',
      defaultConfig: {
        type: 'checkbox',
        label: 'Checkbox',
        required: false,
        width: 'half',
        defaultValue: false,
        validations: []
      }
    },
    {
      id: 'number',
      name: 'Number',
      icon: <Hash size={20} />,
      category: 'input',
      description: 'Numeric input field',
      defaultConfig: {
        type: 'number',
        label: 'Number',
        placeholder: 'Enter number...',
        required: false,
        width: 'half',
        validations: []
      }
    },
    {
      id: 'email',
      name: 'Email',
      icon: <Mail size={20} />,
      category: 'input',
      description: 'Email input with validation',
      defaultConfig: {
        type: 'email',
        label: 'Email Address',
        placeholder: 'Enter email...',
        required: false,
        width: 'full',
        validations: [
          {
            id: 'email-validation',
            type: 'email',
            message: 'Please enter a valid email address',
            enabled: true
          }
        ]
      }
    },
    {
      id: 'password',
      name: 'Password',
      icon: <Lock size={20} />,
      category: 'input',
      description: 'Password input field',
      defaultConfig: {
        type: 'password',
        label: 'Password',
        placeholder: 'Enter password...',
        required: false,
        width: 'full',
        validations: []
      }
    },
    {
      id: 'date',
      name: 'Date',
      icon: <Calendar size={20} />,
      category: 'input',
      description: 'Date picker field',
      defaultConfig: {
        type: 'date',
        label: 'Date',
        required: false,
        width: 'half',
        validations: []
      }
    },
    {
      id: 'file',
      name: 'File Upload',
      icon: <Upload size={20} />,
      category: 'input',
      description: 'File upload field',
      defaultConfig: {
        type: 'file',
        label: 'Upload File',
        required: false,
        width: 'full',
        validations: []
      }
    },
    {
      id: 'radio',
      name: 'Radio Group',
      icon: <Radio size={20} />,
      category: 'input',
      description: 'Radio button group for single selection',
      defaultConfig: {
        type: 'radio',
        label: 'Select One Option',
        required: false,
        width: 'full',
        options: [
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' },
          { value: 'option3', label: 'Option 3' }
        ],
        validations: []
      }
    },
    {
      id: 'avatar',
      name: 'Avatar Upload',
      icon: <User size={20} />,
      category: 'input',
      description: 'Profile picture upload with preview',
      defaultConfig: {
        type: 'avatar',
        label: 'Profile Picture',
        required: false,
        width: 'full',
        validations: []
      }
    },
    {
      id: 'photo',
      name: 'Photo Capture',
      icon: <Camera size={20} />,
      category: 'input',
      description: 'Take photo with camera or upload',
      defaultConfig: {
        type: 'photo',
        label: 'Photo',
        required: false,
        width: 'full',
        validations: []
      }
    },
    
    // Advanced Input Widgets
    {
      id: 'datetime',
      name: 'Date & Time',
      icon: <CalendarClock size={20} />,
      category: 'advanced',
      description: 'Combined date and time picker',
      defaultConfig: {
        type: 'datetime',
        label: 'Date & Time',
        required: false,
        width: 'full',
        validations: []
      }
    },
    {
      id: 'time',
      name: 'Time',
      icon: <Clock size={20} />,
      category: 'advanced',
      description: 'Time picker field',
      defaultConfig: {
        type: 'time',
        label: 'Time',
        required: false,
        width: 'half',
        validations: []
      }
    },
    {
      id: 'phone',
      name: 'Phone Number',
      icon: <Phone size={20} />,
      category: 'advanced',
      description: 'Phone number input with formatting',
      defaultConfig: {
        type: 'tel',
        label: 'Phone Number',
        placeholder: 'Enter phone number...',
        required: false,
        width: 'half',
        validations: [
          {
            id: 'phone-validation',
            type: 'pattern',
            value: '^[+]?[(]?[0-9]{3}[)]?[-\\s.]?[0-9]{3}[-\\s.]?[0-9]{4,6}$',
            message: 'Please enter a valid phone number',
            enabled: true
          }
        ]
      }
    },
    {
      id: 'country',
      name: 'Country Select',
      icon: <Globe size={20} />,
      category: 'advanced',
      description: 'Country selection dropdown',
      defaultConfig: {
        type: 'select',
        label: 'Country',
        placeholder: 'Select country...',
        required: false,
        width: 'full',
        options: [
          { value: 'us', label: 'United States' },
          { value: 'ca', label: 'Canada' },
          { value: 'uk', label: 'United Kingdom' },
          { value: 'au', label: 'Australia' },
          { value: 'de', label: 'Germany' },
          { value: 'fr', label: 'France' },
          { value: 'jp', label: 'Japan' },
          { value: 'in', label: 'India' },
          { value: 'br', label: 'Brazil' },
          { value: 'cn', label: 'China' }
        ],
        validations: [],
        cascadeTarget: 'state'
      }
    },
    {
      id: 'state',
      name: 'State/Province',
      icon: <MapPin size={20} />,
      category: 'advanced',
      description: 'State/province selection based on country',
      defaultConfig: {
        type: 'select',
        label: 'State/Province',
        placeholder: 'Select state...',
        required: false,
        width: 'half',
        options: [],
        validations: [],
        cascadeSource: 'country',
        cascadeMapping: {
          'us': [
            { value: 'ca', label: 'California' },
            { value: 'ny', label: 'New York' },
            { value: 'tx', label: 'Texas' },
            { value: 'fl', label: 'Florida' },
            { value: 'il', label: 'Illinois' }
          ],
          'ca': [
            { value: 'on', label: 'Ontario' },
            { value: 'qc', label: 'Quebec' },
            { value: 'bc', label: 'British Columbia' },
            { value: 'ab', label: 'Alberta' },
            { value: 'mb', label: 'Manitoba' }
          ],
          'uk': [
            { value: 'eng', label: 'England' },
            { value: 'sct', label: 'Scotland' },
            { value: 'wls', label: 'Wales' },
            { value: 'nir', label: 'Northern Ireland' }
          ]
        },
        cascadeTarget: 'city'
      }
    },
    {
      id: 'city',
      name: 'City',
      icon: <MapPin size={20} />,
      category: 'advanced',
      description: 'City selection based on state/province',
      defaultConfig: {
        type: 'select',
        label: 'City',
        placeholder: 'Select city...',
        required: false,
        width: 'half',
        options: [],
        validations: [],
        cascadeSource: 'state',
        cascadeMapping: {
          'ca': [
            { value: 'sf', label: 'San Francisco' },
            { value: 'la', label: 'Los Angeles' },
            { value: 'sd', label: 'San Diego' },
            { value: 'sj', label: 'San Jose' },
            { value: 'fr', label: 'Fresno' }
          ],
          'ny': [
            { value: 'nyc', label: 'New York City' },
            { value: 'buf', label: 'Buffalo' },
            { value: 'roc', label: 'Rochester' },
            { value: 'syr', label: 'Syracuse' },
            { value: 'alb', label: 'Albany' }
          ],
          'tx': [
            { value: 'hou', label: 'Houston' },
            { value: 'aus', label: 'Austin' },
            { value: 'dal', label: 'Dallas' },
            { value: 'sat', label: 'San Antonio' },
            { value: 'elp', label: 'El Paso' }
          ]
        }
      }
    },
    {
      id: 'rating',
      name: 'Rating',
      icon: <Star size={20} />,
      category: 'advanced',
      description: 'Star rating input',
      defaultConfig: {
        type: 'rating',
        label: 'Rating',
        required: false,
        width: 'full',
        maxRating: 5,
        defaultValue: 0,
        validations: []
      }
    },
    {
      id: 'toggle',
      name: 'Toggle Switch',
      icon: <ToggleLeft size={20} />,
      category: 'advanced',
      description: 'Toggle switch for boolean values',
      defaultConfig: {
        type: 'toggle',
        label: 'Toggle Switch',
        required: false,
        width: 'half',
        defaultValue: false,
        validations: []
      }
    },
    {
      id: 'color',
      name: 'Color Picker',
      icon: <Palette size={20} />,
      category: 'advanced',
      description: 'Color selection input',
      defaultConfig: {
        type: 'color',
        label: 'Color',
        required: false,
        width: 'half',
        defaultValue: '#4A2D85',
        validations: []
      }
    },
    {
      id: 'url',
      name: 'URL Input',
      icon: <Link2 size={20} />,
      category: 'advanced',
      description: 'URL input with validation',
      defaultConfig: {
        type: 'url',
        label: 'Website URL',
        placeholder: 'https://example.com',
        required: false,
        width: 'full',
        validations: [
          {
            id: 'url-validation',
            type: 'pattern',
            value: '^(https?:\\/\\/)?([\\da-z.-]+)\\.([a-z.]{2,6})([\\/\\w .-]*)*\\/?$',
            message: 'Please enter a valid URL',
            enabled: true
          }
        ]
      }
    },
    {
      id: 'slider',
      name: 'Range Slider',
      icon: <Sliders size={20} />,
      category: 'advanced',
      description: 'Range slider for numeric input',
      defaultConfig: {
        type: 'range',
        label: 'Range Slider',
        required: false,
        width: 'full',
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 50,
        showValue: true,
        validations: []
      }
    },
    {
      id: 'percentage',
      name: 'Percentage',
      icon: <Percent size={20} />,
      category: 'advanced',
      description: 'Percentage input with validation',
      defaultConfig: {
        type: 'number',
        label: 'Percentage',
        placeholder: 'Enter percentage...',
        required: false,
        width: 'half',
        min: 0,
        max: 100,
        step: 1,
        suffix: '%',
        validations: [
          {
            id: 'percentage-validation',
            type: 'number',
            message: 'Please enter a valid percentage (0-100)',
            enabled: true
          }
        ]
      }
    },
    {
      id: 'currency',
      name: 'Currency',
      icon: <DollarSign size={20} />,
      category: 'advanced',
      description: 'Currency input with formatting',
      defaultConfig: {
        type: 'currency',
        label: 'Amount',
        placeholder: 'Enter amount...',
        required: false,
        width: 'half',
        currencySymbol: '$',
        currencyCode: 'USD',
        validations: []
      }
    },
    {
      id: 'mask',
      name: 'Masked Input',
      icon: <FileDigit size={20} />,
      category: 'advanced',
      description: 'Input with custom mask pattern',
      defaultConfig: {
        type: 'mask',
        label: 'Masked Input',
        placeholder: 'Enter value...',
        required: false,
        width: 'full',
        mask: '999-99-9999',
        validations: []
      }
    },
    {
      id: 'biometric',
      name: 'Biometric',
      icon: <Fingerprint size={20} />,
      category: 'advanced',
      description: 'Biometric authentication input',
      defaultConfig: {
        type: 'biometric',
        label: 'Biometric Authentication',
        required: false,
        width: 'half',
        validations: []
      }
    },
    {
      id: 'qrcode',
      name: 'QR Code Scanner',
      icon: <QrCode size={20} />,
      category: 'advanced',
      description: 'QR code scanner input',
      defaultConfig: {
        type: 'qrcode',
        label: 'Scan QR Code',
        required: false,
        width: 'full',
        validations: []
      }
    },
    {
      id: 'barcode',
      name: 'Barcode Scanner',
      icon: <Scan size={20} />,
      category: 'advanced',
      description: 'Barcode scanner input',
      defaultConfig: {
        type: 'barcode',
        label: 'Scan Barcode',
        required: false,
        width: 'full',
        validations: []
      }
    },
    {
      id: 'multiselect',
      name: 'Multi-Select',
      icon: <Layers size={20} />,
      category: 'advanced',
      description: 'Multiple selection dropdown',
      defaultConfig: {
        type: 'multiselect',
        label: 'Select Multiple Options',
        placeholder: 'Choose options...',
        required: false,
        width: 'full',
        options: [
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' },
          { value: 'option3', label: 'Option 3' },
          { value: 'option4', label: 'Option 4' },
          { value: 'option5', label: 'Option 5' }
        ],
        validations: []
      }
    },
    
    // Display Widgets
    {
      id: 'text-display',
      name: 'Text Block',
      icon: <FileText size={20} />,
      category: 'display',
      description: 'Static text content',
      defaultConfig: {
        type: 'text',
        content: 'Text content goes here...',
        fontSize: 'medium',
        fontWeight: 'normal',
        textAlign: 'left'
      }
    },
    {
      id: 'image',
      name: 'Image',
      icon: <ImageIcon size={20} />,
      category: 'display',
      description: 'Image display',
      defaultConfig: {
        type: 'image',
        src: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
        alt: 'Image',
        width: 'full',
        height: '200px'
      }
    },
    
    // Layout Widgets
    {
      id: 'divider',
      name: 'Divider',
      icon: <Minus size={20} />,
      category: 'layout',
      description: 'Horizontal divider line',
      defaultConfig: {
        type: 'divider',
        style: 'solid',
        color: '#e2e8f0',
        thickness: '1px',
        margin: '20px'
      }
    },
    {
      id: 'spacer',
      name: 'Spacer',
      icon: <Space size={20} />,
      category: 'layout',
      description: 'Empty space for layout',
      defaultConfig: {
        type: 'spacer',
        height: '20px'
      }
    }
  ];

  const categories = [
    { id: 'input', name: 'Basic Inputs', color: '#4A2D85' }, // Professional indigo
    { id: 'advanced', name: 'Advanced Inputs', color: '#8b5cf6' }, // Professional violet
    { id: 'display', name: 'Display', color: '#047857' }, // Professional green
    { id: 'layout', name: 'Layout', color: '#b45309' } // Professional amber
  ];

  const containerStyles: React.CSSProperties = {
    width: '300px',
    height: '100%',
    background: colors.glass.primary,
    border: `1px solid ${colors.border.light}`,
    borderRadius: borderRadius.xl,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: shadows.glass,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  };

  const headerStyles: React.CSSProperties = {
    padding: spacing.xl,
    borderBottom: `1px solid ${colors.border.light}`,
    background: colors.glass.secondary,
  };

  const categoryStyles: React.CSSProperties = {
    marginBottom: spacing.lg,
  };

  const categoryHeaderStyles: React.CSSProperties = {
    fontSize: '0.875rem',
    fontWeight: '700',
    color: colors.text.primary,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: spacing.md,
    padding: `0 ${spacing.md}`,
  };

  const widgetItemStyles = (category: string): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    margin: `0 ${spacing.md} ${spacing.sm} ${spacing.md}`,
    background: colors.glass.secondary,
    border: `1px solid ${colors.border.light}`,
    borderRadius: borderRadius.lg,
    cursor: 'grab',
    transition: 'all 0.2s ease',
    userSelect: 'none',
  });

  const widgetIconStyles = (categoryColor: string): React.CSSProperties => ({
    width: '40px',
    height: '40px',
    background: `${categoryColor}20`,
    border: `2px solid ${categoryColor}40`,
    borderRadius: borderRadius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: categoryColor,
    flexShrink: 0,
  });

  const handleDragStart = (e: React.DragEvent, widget: WidgetType) => {
    console.log('Drag started for widget:', widget.name);
    
    // Set drag effect
    e.dataTransfer.effectAllowed = 'copy';
    
    // Create a serializable version of the widget without the icon
    const serializableWidget = {
      id: widget.id,
      name: widget.name,
      category: widget.category,
      description: widget.description,
      defaultConfig: widget.defaultConfig
    };
    
    // Set the data to transfer
    e.dataTransfer.setData('application/json', JSON.stringify(serializableWidget));
    e.dataTransfer.setData('text/plain', widget.name); // Fallback
    
    // Create a custom drag image
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
    dragImage.style.transform = 'rotate(5deg)';
    dragImage.style.opacity = '0.8';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 50, 25);
    
    // Clean up the drag image after a short delay
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    console.log('Drag ended');
    e.currentTarget.style.cursor = 'grab';
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.currentTarget.style.cursor = 'grabbing';
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.currentTarget.style.cursor = 'grab';
  };

  return (
    <>
      <style>
        {`
          .widget-item:hover {
            background: ${colors.glass.primary} !important;
            transform: translateY(-2px) !important;
            box-shadow: ${shadows.glassHover} !important;
            border-color: ${colors.border.medium} !important;
          }
          
          .widget-item:active {
            cursor: grabbing !important;
            transform: translateY(0) scale(0.98) !important;
          }
          
          .widget-library-content {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          
          .widget-library-content::-webkit-scrollbar {
            display: none;
          }
          
          .widget-item.dragging {
            opacity: 0.5 !important;
            transform: rotate(5deg) !important;
          }
          
          /* Enhanced drag feedback */
          .widget-item[draggable="true"] {
            cursor: grab;
          }
          
          .widget-item[draggable="true"]:active {
            cursor: grabbing;
          }
          
          /* Category headers with subtle separators */
          .category-header {
            position: relative;
            padding-bottom: 8px;
            margin-top: 16px;
          }
          
          .category-header::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 8px;
            right: 8px;
            height: 1px;
            background: linear-gradient(90deg, transparent, ${colors.border.light}, transparent);
          }
          
          /* Search filter for widgets */
          .widget-search {
            margin: 0 ${spacing.md} ${spacing.md} ${spacing.md};
            position: relative;
          }
          
          .widget-search input {
            width: 100%;
            padding: ${spacing.md} ${spacing.lg};
            padding-left: 36px;
            background: ${colors.glass.secondary};
            border: 1px solid ${colors.border.light};
            border-radius: ${borderRadius.lg};
            font-size: 0.875rem;
            color: ${colors.text.primary};
            outline: none;
            transition: all 0.2s ease;
          }
          
          .widget-search input:focus {
            border-color: ${colors.border.medium};
            box-shadow: ${shadows.glassHover};
          }
          
          .widget-search-icon {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: ${colors.text.secondary};
          }
          
          /* Category tabs */
          .category-tabs {
            display: flex;
            padding: ${spacing.sm};
            background: ${colors.glass.secondary};
            border-radius: ${borderRadius.lg};
            margin: 0 ${spacing.md} ${spacing.md} ${spacing.md};
            border: 1px solid ${colors.border.light};
          }
          
          .category-tab {
            flex: 1;
            padding: ${spacing.sm};
            text-align: center;
            font-size: 0.75rem;
            font-weight: 600;
            border-radius: ${borderRadius.md};
            cursor: pointer;
            transition: all 0.2s ease;
            color: ${colors.text.secondary};
          }
          
          .category-tab.active {
            background: ${colors.gradients.primary};
            color: white;
          }
          
          .category-tab:hover:not(.active) {
            background: ${colors.glass.primary};
            color: ${colors.text.primary};
          }
        `}
      </style>
      
      <div style={containerStyles} className={className}>
        <div style={headerStyles}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '700',
            color: colors.text.primary,
            margin: 0,
            marginBottom: spacing.sm,
          }}>
            Widget Library
          </h3>
          <p style={{
            fontSize: '0.875rem',
            color: colors.text.secondary,
            margin: 0,
          }}>
            Drag widgets to the canvas to build your form
          </p>
        </div>

        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: spacing.lg,
        }} className="widget-library-content">
          {/* Search Filter */}
          <div className="widget-search">
            <span className="widget-search-icon">
              <Search size={16} />
            </span>
            <input 
              type="text" 
              placeholder="Search widgets..." 
            />
          </div>
          
          {/* Category Tabs */}
          <div className="category-tabs">
            {categories.map(category => (
              <div 
                key={category.id} 
                className={`category-tab ${category.id === 'input' ? 'active' : ''}`}
              >
                {category.name}
              </div>
            ))}
          </div>
          
          {categories.map(category => (
            <div key={category.id} style={categoryStyles}>
              <div style={categoryHeaderStyles} className="category-header">
                {category.name}
              </div>
              
              {widgetTypes
                .filter(widget => widget.category === category.id)
                .map(widget => (
                  <div
                    key={widget.id}
                    style={widgetItemStyles(category.id)}
                    className="widget-item"
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, widget)}
                    onDragEnd={handleDragEnd}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onClick={() => onWidgetDrag(widget)}
                    title={`Drag to add ${widget.name}`}
                  >
                    <div style={widgetIconStyles(category.color)}>
                      {widget.icon}
                    </div>
                    
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: colors.text.primary,
                        marginBottom: spacing.xs,
                      }}>
                        {widget.name}
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: colors.text.secondary,
                        lineHeight: '1.4',
                      }}>
                        {widget.description}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};