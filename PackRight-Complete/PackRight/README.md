# PackRight - AI-Powered Moving Assistant

PackRight is a modern iOS app that helps you organize your move using AI-powered box cataloging. Scan boxes, track items, and never lose anything during your move.

## Features

- 📦 **Smart Box Management** - Track all your moving boxes in one place
- 📸 **AI Camera Scan** - Take photos of boxes and let AI identify items (Coming Soon)
- 🔍 **Instant Search** - Find any item across all boxes instantly
- 📊 **Moving Progress** - Visual tracking of packing progress
- 🎨 **Beautiful Themes** - Multiple color themes including Purple, Ocean, Sunset, and Forest
- 🌙 **Dark Mode** - Full dark mode support
- 💾 **Local Storage** - All data stored securely on device

## Requirements

- iOS 17.0+
- Xcode 15.0+
- Swift 5.9+

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/PackRight.git
cd PackRight
```

2. Open the project in Xcode:
```bash
open PackRight.xcodeproj
```

3. Build and run on your device or simulator

### Project Structure

```
PackRight/
├── PackRight/
│   ├── PackRightApp.swift          # Main app entry point
│   ├── Models/
│   │   └── Box.swift                # Data models
│   ├── ViewModels/
│   │   └── BoxViewModel.swift       # Business logic
│   └── Views/
│       ├── MainTabView.swift        # Tab navigation
│       ├── HomeView.swift           # Home screen with progress
│       ├── BoxDetailView.swift      # Box details & items
│       ├── SearchView.swift         # Search functionality
│       ├── CameraScanView.swift     # Camera scan (placeholder)
│       ├── OnboardingView.swift     # First-time onboarding
│       └── SettingsView.swift       # App settings
```

## Design System

### Colors

The app uses a gradient-based color system:
- **Primary Color**: `#667eea` (Purple)
- **Secondary Color**: `#764ba2` (Purple)
- **Accent Color**: `#4facfe` (Blue)

Additional themes available:
- Ocean Blue
- Sunset Orange
- Forest Green

### Typography

- **Display**: SF Pro Display (Bold, 28-32pt)
- **Body**: SF Pro Text (Regular, 15-17pt)
- **Caption**: SF Pro Text (Regular, 11-13pt)
- **Monospace**: SF Mono (Box numbers)

## Features Roadmap

### v1.0 (Current)
- ✅ Box management
- ✅ Item tracking
- ✅ Search functionality
- ✅ Moving progress tracker
- ✅ Onboarding
- ✅ Multiple themes
- ✅ Dark mode

### v1.1 (Planned)
- 🔄 AI camera scanning with Vision API
- 🔄 QR code generation for boxes
- 🔄 Export to PDF
- 🔄 iCloud sync
- 🔄 Widget support

### v1.2 (Future)
- 📱 Share boxes with family
- 📊 Advanced analytics
- 🗺️ Room mapping
- 📦 Moving checklist

## Development

### Adding AI Scanning

To implement AI scanning, you'll need to:

1. Add Vision framework
2. Integrate with an AI API (OpenAI Vision, Google Vision, or Anthropic Claude)
3. Update `CameraScanView.swift` with camera capture
4. Process images and extract item names

Example API integration point in `CameraScanView.swift`:
```swift
func scanBoxImage(_ image: UIImage) async {
    // TODO: Send image to AI API
    // Parse response and create BoxItems
    // Add to current box
}
```

### Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Ivan - [@cat.z0ne](https://instagram.com/cat.z0ne)

Project Link: [https://github.com/yourusername/PackRight](https://github.com/yourusername/PackRight)

## Acknowledgments

- Design inspired by modern iOS design principles
- Color gradients from [UI Gradients](https://uigradients.com)
- Icons from SF Symbols

---

**Built with ❤️ in SwiftUI**
