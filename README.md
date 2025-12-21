# 3D Model Viewer - Car Display

A production-ready React application for displaying and interacting with 3D models using Three.js. Features a futuristic combat jet with dynamic textures, animations, and interactive controls.

## Features

- **3D Model Rendering**: FBX model loading with full material and texture support
- **Interactive Controls**: Mouse-based rotation, panning, and zooming
- **Dynamic Textures**: Real-time texture switching with 4 available options
- **Animations**: Support for embedded FBX animations with playback controls
- **Auto-Rotation**: Toggle automatic model rotation
- **Responsive Design**: Adapts to different screen sizes
- **Production-Ready**: Optimized code with custom hooks and component architecture

## Tech Stack

- **React 19** - UI framework
- **Three.js** - 3D graphics library
- **React Hooks** - State management and lifecycle
- **PropTypes** - Runtime type checking
- **Create React App** - Build tooling

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Controls.jsx    # Animation and rotation controls
│   ├── TextureSelector.jsx
│   ├── ZoomControls.jsx
│   └── LoadingOverlay.jsx
├── hooks/              # Custom React hooks
│   ├── useThreeScene.js    # Three.js scene setup
│   └── useFBXLoader.js     # FBX model loading
├── constants.js        # Configuration constants
├── App.js             # Main application component
└── App.css            # Styles
```

## Getting Started

### Prerequisites

- Node.js (v20 or higher recommended)
- npm (v10 or higher)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd car3Ddisplay
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Usage

### Mouse Controls

- **Left-click + drag**: Rotate the model
- **Right-click + drag**: Pan the camera
- **Scroll wheel**: Zoom in/out
- **Two-finger drag** (trackpad): Pan

### UI Controls

- **Texture Selector** (top-left): Switch between different aircraft textures
- **Auto Rotate** (top-right): Toggle automatic rotation
- **Animation Controls** (top-right): Play embedded FBX animations
- **Zoom Buttons** (bottom-right): Precise zoom control

## Configuration

Edit `src/constants.js` to customize:

- Camera settings (FOV, position, zoom limits)
- Lighting configuration (ambient, directional, point lights)
- Scene settings (background color, model path, textures)
- Control settings (damping, sensitivity)

## Building for Production

```bash
npm run build
```

Creates an optimized production build in the `build` folder.

## Key Features Implementation

### Custom Hooks

- **useThreeScene**: Manages Three.js scene, camera, renderer, and lighting
- **useFBXLoader**: Handles FBX model loading with error handling and material setup

### Performance Optimizations

- React.memo for component optimization
- useCallback for event handler memoization
- Proper cleanup of Three.js resources
- Prevention of duplicate renders (React StrictMode compatible)

### Accessibility

- ARIA labels on all interactive elements
- Keyboard-friendly controls
- Loading and error states with proper announcements

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Model not visible
- Ensure FBX file is in `public/assets/futuristic_combat_jet/`
- Check browser console for loading errors
- Verify model scale and position in constants.js

### Textures not loading
- Confirm texture files are in `public/assets/futuristic_combat_jet/textures/`
- Check file names match exactly (case-sensitive)

### Performance issues
- Reduce model complexity or texture resolution
- Disable shadows in constants.js
- Lower renderer pixel ratio

## License

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Author

Shashwath Uchil
