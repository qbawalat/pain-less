Test Scenario: New User Login Flow

1. Login Form Interaction
   ├── Navigate to /auth/login
   ├── Fill in email field with: kubawalat@gmail.com
   ├── Fill in password field with: Dotestowe2e1!
   └── Click "Sign in" button

2. Authentication Process
   ├── Wait for successful login response
   ├── Verify redirect to MainLayout
   └── Check for successful cookie set (sb-auth-token)

3. MainLayout Initialization
   ├── Verify MainView component loads
   ├── Check useHealthProfile hook execution
   └── Confirm profile is null (new user)

4. CreateHealthProfile Dialog
   ├── Verify CreateHealthProfile component renders
   │ ├── Check for "Create Health Profile" title
   │ ├── Verify form fields:
   │ │ ├── Birth Date input
   │ │ ├── Height input (cm)
   │ │ ├── Weight input (kg)
   │ │ ├── Medical Conditions section
   │ │ └── Family History section
   │ └── Confirm "Create Profile" button is present
   │
   └── Verify form validation
   ├── Check age restriction (18+ years)
   ├── Verify required fields
   └── Test medical conditions suggestions
