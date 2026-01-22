# Momento - A Beautiful Memory Journaling App

Momento is a stunning React-based memory journaling application with daily photo capture streaks, multiple beautiful themes, and a minimalist design philosophy.

## Features

- 📸 **Daily Capture Streaks** - Track your daily memory captures
- 🎨 **Multiple Themes** - Sepia, Modern, Dark, and Cyberpunk themes
- 📅 **Timeline View** - Browse memories organized by year and date
- 🏷️ **Memory Notes** - Add notes to each memory
- 🎯 **Calendar Navigation** - Quick jump to specific dates
- 💾 **Local Storage** - Memories saved in browser storage
- 📱 **Responsive Design** - Works on desktop and mobile

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Lucide React** - Icon library
- **CSS-in-JS** - Inline styles for dynamic theming

## Installation

### Prerequisites
- Node.js 14+ 
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/momento-app.git
   cd momento-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   The app will open at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Project Structure

```
momento-app/
├── index.html              # HTML entry point
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── src/
│   ├── index.jsx          # React root render
│   └── components/
│       └── MomentoApp.jsx  # Main app component
└── dist/                   # Build output (generated)
```

## Usage

### Capturing Memories
- Click the camera icon or use the capture button
- The app tracks daily captures and maintains streaks

### Theme Selection
- Open settings (⚙️ icon)
- Choose from Sepia, Modern, Dark, or Cyberpunk themes
- Theme preference is saved

### Browsing Memories
- Scroll through the timeline
- Click memories to view full screen
- Use the year sidebar to jump to specific dates

### Adding Notes
- Click a memory to open the viewer
- Add or edit notes associated with the memory

## Customization

### Adding Your Own Fonts
Edit the Google Fonts import in `MomentoApp.jsx` to add or change serif/sans-serif fonts.

### Modifying Colors
Theme colors are defined in the `themes` object in `MomentoApp.jsx`. Each theme includes:
- `background` - Gradient background
- `cardBg` - Card background color
- `text` - Primary text color
- `textSecondary` - Secondary text color
- `accent` - Accent color for highlights

### Local Storage
Memories are stored in `localStorage` with key `momento_memories`. Clear it to reset the app.

## Performance Tips

- Compress images before adding them
- Clear old demo data if the app feels slow
- Use the "Dev Mode" setting to toggle demo data

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Author

Created by Ivan

## Roadmap

- [ ] Cloud sync with Firebase
- [ ] Image upload from device
- [ ] Sharing capabilities
- [ ] Calendar heatmap view
- [ ] Memory search and filtering
- [ ] Export memories as PDF
- [ ] Dark mode automatic based on system preference

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## Support

For issues or questions, please open an issue on GitHub.
