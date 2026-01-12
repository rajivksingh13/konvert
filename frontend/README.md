# KonvertR Frontend

Modern React-based frontend for the KonvertR Universal Format Converter.

## Features

- 🎨 Modern, professional UI/UX
- 🌓 Dark/Light theme support
- 📱 Responsive design
- ⚡ Fast and performant
- 🔄 Real-time format conversion
- 🛠️ Comprehensive utility tools

## Getting Started

### Prerequisites

- Node.js 14+ and npm
- Backend API running on `http://localhost:8080`

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm start
```

This will start the development server on `http://localhost:3000` with hot-reload enabled.

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

### Integration with Spring Boot

After building, copy the contents of the `build` folder to `src/main/resources/static/`:

**Windows:**
```batch
xcopy /E /I /Y build\* ..\src\main\resources\static\
```

**Linux/Mac:**
```bash
cp -r build/* ../src/main/resources/static/
```

Or use the provided build script:
```bash
npm run build:deploy
```

## Project Structure

```
frontend/
├── public/          # Static files
├── src/
│   ├── components/  # React components
│   │   ├── UI/      # Reusable UI components
│   │   ├── Converter.js
│   │   ├── Formatter.js
│   │   ├── Base64.js
│   │   ├── Files.js
│   │   └── Utilities.js
│   ├── contexts/    # React contexts (Theme)
│   ├── services/    # API service layer
│   ├── App.js       # Main app component
│   └── index.js     # Entry point
└── package.json
```

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Environment Variables

Create a `.env` file in the frontend directory:

```
REACT_APP_API_URL=http://localhost:8080/api
```

## Features Implemented

- ✅ Format Conversion (JSON, YAML, XML, TOML, CSV, Protobuf, Properties)
- ✅ Formatting (JSON, YAML, CSV)
- ✅ Base64 Encoding/Decoding
- ✅ File Upload & Conversion
- ✅ Encoding/Decoding Utilities (URL, HTML, Hex)
- ✅ JWT Decoder
- ✅ UUID Generator
- ✅ Hash Generator
- ✅ Schema Validation
- ✅ Diff & Compare
- ✅ Minify & Compress
- ✅ Data Transformation

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Same as the main project.

