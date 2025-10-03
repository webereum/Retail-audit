# Retail Audit Mobile App

React Native mobile application for field audit execution using Expo.

## Features

- View published audit templates
- Complete audits with various question types
- Offline-capable (coming soon)
- Submit audit data to backend API
- Real-time template synchronization

## Installation

```bash
npm install
```

## Configuration

Update the API URL in these files to match your backend:

- `src/screens/TemplateListScreen.tsx`
- `src/screens/AuditFormScreen.tsx`

```typescript
const API_URL = 'http://your-backend-url:3001/api';
```

### Connection URLs

- **Android Emulator**: `http://10.0.2.2:3001/api`
- **iOS Simulator**: `http://localhost:3001/api`
- **Physical Device**: `http://192.168.x.x:3001/api` (your computer's IP)

## Running the App

```bash
# Start Expo development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on web
npm run web
```

## Supported Question Types

1. Text Input
2. Numeric Input
3. Single Choice (radio buttons)
4. Multiple Choice (checkboxes)
5. Dropdown
6. Date/Time
7. File Upload (placeholder)
8. Barcode Scanner (text input)

## Project Structure

```
mobile/
├── App.tsx                 # Main navigation
├── src/
│   └── screens/
│       ├── TemplateListScreen.tsx    # List of templates
│       ├── AuditFormScreen.tsx       # Audit execution form
│       └── AuditSuccessScreen.tsx    # Success confirmation
├── app.json               # Expo configuration
└── package.json
```

## Usage Flow

1. **Template List**: Pull to refresh to sync templates from backend
2. **Start Audit**: Tap a template card to begin
3. **Fill Form**: Answer questions in each section
4. **Submit**: Validate and submit audit to backend
5. **Success**: Confirmation screen with option to return

## Development

The app uses:
- React Native with TypeScript
- Expo for development and building
- React Navigation for routing
- Axios for API calls

## Building for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

## Troubleshooting

### Can't connect to backend

1. Check backend is running on port 3001
2. Verify API_URL is correct for your device
3. Ensure devices are on same network (for physical devices)
4. Check firewall settings

### Templates not loading

1. Pull to refresh
2. Check backend has published templates
3. Verify API endpoint returns data
4. Check network console logs

### Validation errors

- Required questions marked with *
- Must be answered before submission
- Check question type matches expected input

## Next Features

- [ ] Offline mode with local storage
- [ ] Photo capture for file upload questions
- [ ] Real barcode scanner integration
- [ ] GPS location capture
- [ ] Draft save functionality
- [ ] Audit history view

## License

Proprietary - All rights reserved
