# PackRight Setup Guide

## Quick Start

### 1. Prerequisites
- macOS 14.0 or later
- Xcode 15.0 or later
- iOS 17.0+ device or simulator

### 2. Clone & Open

```bash
git clone https://github.com/yourusername/PackRight.git
cd PackRight
open PackRight.xcodeproj
```

### 3. Configure Colors

Since we can't commit `.xcassets` binary files, you'll need to add colors manually:

1. In Xcode, open `Assets.xcassets`
2. Create these Color Sets:

**PrimaryColor**: `#667eea`
**SecondaryColor**: `#764ba2` 
**AccentColor**: `#4facfe`
**LaunchScreenBackground**: `#f8f9fa` (light) / `#0f0f1e` (dark)

### 4. Add App Icon

Create an app icon using the refined logo:
1. Export logo as 1024x1024 PNG
2. Use https://www.appicon.co to generate all sizes
3. Drag the generated .appiconset into `Assets.xcassets`

### 5. Build & Run

1. Select your target device/simulator
2. Press `Cmd + R` or click Run
3. App will launch with onboarding

## Project Structure

```
PackRight/
├── PackRightApp.swift           # App entry point
├── Models/
│   └── Box.swift                # Data models (Box, BoxItem)
├── ViewModels/
│   └── BoxViewModel.swift       # State management & business logic
└── Views/
    ├── MainTabView.swift        # Bottom tab navigation
    ├── HomeView.swift           # Home with progress tracker
    ├── BoxDetailView.swift      # Individual box view
    ├── SearchView.swift         # Item search
    ├── CameraScanView.swift     # Camera placeholder (AI integration point)
    ├── OnboardingView.swift     # First-run experience
    └── SettingsView.swift       # App settings & themes
```

## Key Features Implemented

✅ **Box Management**
- Create, view, update, delete boxes
- Track items in each box
- Mark items as packed/unpacked
- Sample data for testing

✅ **Search**
- Full-text search across all boxes
- Search by item name, box title, or room
- Recent searches display

✅ **Progress Tracking**
- Visual progress bar
- Real-time packing statistics
- Item count tracking

✅ **Themes**
- 4 color themes (Purple, Ocean, Sunset, Forest)
- Dark mode support
- Persistent theme selection

✅ **Onboarding**
- 3-screen welcome flow
- Skip functionality
- First-run detection

## Next Steps for Development

### Immediate (v1.0)
1. Add app icon asset
2. Test on physical device
3. Screenshot designs for App Store

### Short-term (v1.1)
1. **AI Camera Integration**
   - Add Vision framework
   - Integrate Claude API or OpenAI Vision
   - Update `CameraScanView.swift`

2. **QR Code Generation**
   - Add CoreImage framework
   - Generate QR for each box
   - Display/share functionality

3. **Export Features**
   - PDF export of box contents
   - CSV export
   - Share functionality

### Long-term (v1.2+)
1. iCloud sync
2. Widgets
3. Family sharing
4. Moving checklists
5. Room mapping

## AI Integration Guide

To add AI scanning (placeholder in `CameraScanView.swift`):

```swift
import Vision

func analyzeBoxImage(_ image: UIImage) async throws -> [BoxItem] {
    // Option 1: Use Claude API (Anthropic)
    // POST to https://api.anthropic.com/v1/messages
    // with image as base64
    
    // Option 2: Use OpenAI Vision
    // POST to https://api.openai.com/v1/chat/completions
    // with GPT-4 Vision
    
    // Option 3: Use Google Vision API
    // POST to https://vision.googleapis.com/v1/images:annotate
    
    // Parse response and return BoxItem array
}
```

## Testing

Run tests:
```bash
cmd + U
```

Test on different devices:
- iPhone SE (smallest screen)
- iPhone 15 Pro (standard)
- iPhone 15 Pro Max (largest)
- iPad (if supporting)

## Deployment

### TestFlight
1. Archive app (Product → Archive)
2. Upload to App Store Connect
3. Add to TestFlight
4. Invite testers

### App Store
1. Prepare screenshots (6.7", 6.5", 5.5")
2. Write app description
3. Set pricing (free or paid)
4. Submit for review

## Support

Questions? Open an issue on GitHub or contact:
- Email: your@email.com
- Instagram: [@cat.z0ne](https://instagram.com/cat.z0ne)

## License

MIT License - see LICENSE file
