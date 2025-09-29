# Service Form Template System

This centralized template system allows you to create dynamic service forms for all 13 services in NeedStation based on the field configurations from `SERVICE_SUBCATEGORIES_SCHEMA.md`.

## Files Created

### 1. `ServiceFormTemplate.jsx`
- **Location**: `src/components/ServiceForms/ServiceFormTemplate.jsx`
- **Purpose**: Centralized template component that dynamically generates forms
- **Features**:
  - Dynamic field rendering based on configuration
  - Automatic form validation
  - Local storage persistence
  - Responsive design with modern UI
  - Icon mapping for different field types
  - Support for text, number, date, select, checkbox, and textarea fields

### 2. `ServiceConfigurations.js`
- **Location**: `src/data/ServiceConfigurations.js`
- **Purpose**: Contains field configurations for all 13 services
- **Structure**: Based on `SERVICE_SUBCATEGORIES_SCHEMA.md`

## How to Use

### For Any Service (Example: Security Guard)

```jsx
import React from "react";
import ServiceFormTemplate from "../../components/ServiceForms/ServiceFormTemplate";
import { getServiceConfiguration } from "../../data/ServiceConfigurations";

const SecurityUniqueDetails = ({ onDataChange, initialData = {} }) => {
  // Get the service configuration
  const serviceConfig = getServiceConfiguration("HOME_SECURITY_GUARD");

  return (
    <ServiceFormTemplate
      serviceConfig={serviceConfig}
      serviceName="Home Security Guard"
      onDataChange={onDataChange}
      initialData={initialData}
    />
  );
};

export default SecurityUniqueDetails;
```

### Available Service Configurations

1. **ELDERLY_CARE** - Patient info, care requirements, medical conditions, preferences
2. **NURSING_CARE** - Patient details, nursing requirements, medical equipment, doctor details
3. **CARETAKER_AT_HOME** - Household info, caretaker duties, specific requirements
4. **BEDRIDDEN_PATIENT_CARE** - Patient condition, care intensity, support equipment
5. **PARKINSONS_CARE** - Disease stage, current management, specific challenges
6. **PHYSIOTHERAPY** - Condition details, therapy requirements, mobility status
7. **HOME_SECURITY_GUARD** - Property details, security requirements, specific duties, guard specifications
8. **MOTHER_AND_BABY_CARE** - Baby details, mother details, care preferences, specific needs
9. **PARALYSIS_CARE** - Paralysis type, functional status, rehabilitation plan
10. **PATHOLOGY_CARE** - Test requirements, patient info, service preferences
11. **DIABETES_MANAGEMENT** - Diabetes profile, monitoring needs, complications, lifestyle factors
12. **HEALTH_CHECK_UP_SERVICE** - Patient demographics, checkup preferences, medical history
13. **POST_SURGERY_CARE** - Surgery details, post-op requirements, recovery status, home care needs

## Field Types Supported

### 1. Text Input
```json
"field_name": "text"
```

### 2. Number Input
```json
"age": "number"
```

### 3. Date Input
```json
"start_date": "date"
```

### 4. Phone Input
```json
"emergency_contact": "phone"
```

### 5. Email Input
```json
"email": "email"
```

### 6. Select Dropdown
```json
"gender": "male/female"
"care_level": "basic/intermediate/advanced"
```

### 7. Multiple Choice Checkboxes
```json
"specific_needs": ["medication_reminder", "meal_preparation", "mobility_assistance", "companionship"]
```

### 8. Textarea (for long text)
```json
"special_instructions": "text"  // Automatically detects 'instruction' keyword
```

## Form Features

### 1. **Dynamic Field Generation**
- Fields are automatically generated based on the service configuration
- Proper labels with title case formatting
- Appropriate input types based on field configuration

### 2. **Validation**
- Built-in form validation
- Required field checking
- Submit button disabled until form is valid

### 3. **Persistence**
- Automatic localStorage saving
- Form data persists across page refreshes
- Unique storage keys per service

### 4. **Responsive Design**
- Modern glassmorphism UI
- Gradient backgrounds and borders
- Hover and focus effects
- Mobile-friendly responsive layout

### 5. **Icon Integration**
- Automatic icon assignment based on field section
- 15+ different icons for various field types
- Consistent visual hierarchy

## Customization

### Adding New Services
1. Add service configuration to `ServiceConfigurations.js`
2. Follow the schema format from `SERVICE_SUBCATEGORIES_SCHEMA.md`
3. Create a new component using the template

### Custom Field Types
To add new field types, modify the `renderField` function in `ServiceFormTemplate.jsx`:

```jsx
// Example: Adding a custom rating field
if (fieldConfig === "rating") {
  return (
    <div>
      {/* Custom rating component */}
    </div>
  );
}
```

## Benefits

1. **Consistency**: All service forms have the same look and feel
2. **Maintainability**: Single template to update for all services
3. **Scalability**: Easy to add new services or modify existing ones
4. **DRY Principle**: No code duplication across service forms
5. **Type Safety**: Centralized configuration reduces errors
6. **Performance**: Optimized rendering and state management

## Migration Guide

### Converting Existing Service Forms

1. **Backup** your existing service form component
2. **Replace** the component content with the template usage pattern
3. **Test** the form functionality
4. **Update** any custom validation or business logic if needed

### Example Migration (Before/After)

**Before** (500+ lines of repetitive code):
```jsx
// Lots of repetitive form fields, state management, styling...
```

**After** (20 lines):
```jsx
import React from "react";
import ServiceFormTemplate from "../../components/ServiceForms/ServiceFormTemplate";
import { getServiceConfiguration } from "../../data/ServiceConfigurations";

const MyServiceDetails = ({ onDataChange, initialData = {} }) => {
  const serviceConfig = getServiceConfiguration("MY_SERVICE");
  
  return (
    <ServiceFormTemplate
      serviceConfig={serviceConfig}
      serviceName="My Service"
      onDataChange={onDataChange}
      initialData={initialData}
    />
  );
};

export default MyServiceDetails;
```

## Testing

To test the template with different services:

1. Navigate to any service form page
2. Verify all fields render correctly
3. Test form validation
4. Check localStorage persistence
5. Confirm form submission works

## Future Enhancements

1. **Conditional Fields**: Show/hide fields based on other field values
2. **Field Dependencies**: Link related fields together
3. **Custom Validation Rules**: Per-field validation logic
4. **Multi-step Forms**: Break large forms into steps
5. **Real-time Validation**: Validate as user types
6. **Accessibility**: Enhanced ARIA labels and keyboard navigation

---

**Created**: December 2024  
**Version**: 1.0  
**Compatibility**: React 18+, NeedStation Frontend
