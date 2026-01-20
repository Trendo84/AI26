# PackRight Color Assets

Add these colors to your `Assets.xcassets/Colors` folder in Xcode:

## Colors to Create:

### 1. PrimaryColor
- Light Mode: `#667eea` (RGB: 102, 126, 234)
- Dark Mode: `#667eea` (RGB: 102, 126, 234)

### 2. SecondaryColor
- Light Mode: `#764ba2` (RGB: 118, 75, 162)
- Dark Mode: `#764ba2` (RGB: 118, 75, 162)

### 3. AccentColor
- Light Mode: `#4facfe` (RGB: 79, 172, 254)
- Dark Mode: `#4facfe` (RGB: 79, 172, 254)

### 4. LaunchScreenBackground
- Light Mode: `#f8f9fa` (RGB: 248, 249, 250)
- Dark Mode: `#0f0f1e` (RGB: 15, 15, 30)

## How to Add Colors in Xcode:

1. Open `Assets.xcassets` in Xcode
2. Right-click → New Color Set
3. Name it (e.g., "PrimaryColor")
4. Select the color in Attributes Inspector
5. Set the hex value for Light and Dark appearances
6. Repeat for all colors

## Using Colors in Code:

```swift
Color("PrimaryColor")
Color("SecondaryColor")
Color("AccentColor")
```

## Gradients:

```swift
LinearGradient(
    colors: [Color("PrimaryColor"), Color("SecondaryColor")],
    startPoint: .leading,
    endPoint: .trailing
)
```
