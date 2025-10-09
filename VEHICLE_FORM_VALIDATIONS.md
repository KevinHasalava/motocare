# Vehicle Form Validations

## Overview
Simple and user-friendly validations have been implemented for the Vehicle Form in `frontend/src/components/vehicle/VehicleForm.jsx`.

## Validation Rules

### 1. Vehicle Number
- **Required**: Must be provided
- **Format**: Sri Lankan vehicle number format (XX-XXXX or XXX-XXXX)
  - Examples: `WP-1234`, `CAA-5678`
- **Auto-formatting**: Automatically formats as user types with hyphen
- **Character filtering**: Only allows letters, numbers, and hyphens
- **Case conversion**: Automatically converts to uppercase

### 2. Vehicle Type
- **Required**: Must be selected
- **Options**: Car, Three Wheel, Motorcycle, Van, SUV
- **Visual feedback**: Card-based selection with color coding
- **Error display**: Red border on cards and error message below when not selected

### 3. Brand
- **Required**: Must be provided
- **Format**: Only letters and spaces allowed
- **Character filtering**: Automatically removes invalid characters as user types
- **Examples**: `Toyota`, `Honda`, `Bajaj Auto`

### 4. Model
- **Required**: Must be provided
- **Format**: Letters, numbers, spaces, hyphens, and dots allowed
- **Character filtering**: Automatically removes invalid characters
- **Examples**: `Corolla`, `Civic Type-R`, `Pulsar 150`

### 5. Year
- **Required**: Must be selected
- **Range**: 1990 to current year
- **Interface**: Date picker with year-only view
- **Validation**: Immediate validation after selection

## Validation Features

### Real-time Feedback
- **Input formatting**: Auto-formats vehicle number as user types
- **Character filtering**: Prevents invalid characters in brand and model fields
- **Error clearing**: Errors disappear when user starts correcting the field
- **Visual indicators**: Error states shown with red borders and helper text

### User Experience
- **Blur validation**: Validates fields when user leaves them (onBlur)
- **Submit validation**: Comprehensive validation before form submission
- **Loading states**: Prevents multiple submissions during processing
- **Clear error messages**: Descriptive messages for each validation rule

### Error Display
- **TextField errors**: Red borders and helper text below fields
- **Type selection errors**: Red borders on selection cards with error message
- **Consistent styling**: All errors follow the same visual pattern

## Technical Implementation

### Validation Function
```javascript
const validate = (field = null) => {
  // Validates individual fields or all fields
  // Returns boolean indicating if form is valid
}
```

### Input Handlers
- `handleChange`: Real-time input formatting and error clearing
- `handleInputBlur`: Field-level validation when focus leaves
- `handleYearChange`: Special handling for year selection
- `handleSubmit`: Final validation before submission

### Error State Management
- Uses React state to track validation errors
- Errors are cleared when user starts correcting fields
- Form submission is prevented if validation fails

## Usage Example

The form automatically validates and provides feedback. Users will see:

1. **Required field errors** if they try to submit without filling mandatory fields
2. **Format errors** for incorrectly formatted vehicle numbers
3. **Character restrictions** for brand and model fields
4. **Year range errors** if they select invalid years
5. **Real-time formatting** for vehicle number input

## Benefits

- **Prevents invalid data** from being submitted
- **Guides users** with clear error messages
- **Improves data quality** with automatic formatting
- **Enhances user experience** with immediate feedback
- **Follows Sri Lankan vehicle registration standards**

## Supported Vehicle Types

- 🚗 Car
- 🛺 Three Wheel
- 🏍️ Motorcycle
- 🚐 Van
- 🚙 SUV

Each type has its own color coding and icon for better visual identification.