# Frontend Setup Guide

This guide explains how to set up and use the new React frontend for KonvertR.

## Quick Start

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Deploy to Spring Boot static folder:**
   ```bash
   npm run build:deploy
   ```

## Development Workflow

### Option 1: Separate Development (Recommended)

Run the React dev server separately from Spring Boot:

1. Start Spring Boot backend:
   ```bash
   ./mvnw spring-boot:run
   ```

2. In another terminal, start React frontend:
   ```bash
   cd frontend
   npm start
   ```

The React app will run on `http://localhost:3000` and proxy API requests to `http://localhost:8080`.

### Option 2: Integrated Development

Build and deploy the React app to the static folder:

1. Build React app:
   ```bash
   cd frontend
   npm run build:deploy
   ```

2. Start Spring Boot:
   ```bash
   ./mvnw spring-boot:run
   ```

The app will be served from Spring Boot at `http://localhost:8080`.

## Project Structure

```
konvert/
├── frontend/                    # React frontend
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── UI/              # Reusable UI components
│   │   │   ├── Converter.js    # Format converter
│   │   │   ├── Formatter.js    # Formatter
│   │   │   ├── Base64.js        # Base64 encoder/decoder
│   │   │   ├── Files.js         # File upload
│   │   │   └── Utilities.js    # Utility tools
│   │   ├── contexts/            # React contexts
│   │   ├── services/           # API service
│   │   └── App.js              # Main app
│   ├── package.json
│   └── deploy.js               # Deployment script
└── src/main/resources/static/  # Spring Boot static files (after build)
```

## Features

### Modern UI/UX
- Clean, professional design
- Smooth animations and transitions
- Responsive layout
- Dark/Light theme support

### Components
- **Converter**: Format conversion between JSON, YAML, XML, TOML, CSV, Protobuf, Properties
- **Formatter**: Beautify JSON, YAML, CSV
- **Base64**: Encode/Decode Base64
- **Files**: Upload and convert files
- **Utilities**: Comprehensive utility tools including:
  - Encoding/Decoding (URL, HTML, Hex)
  - JWT Decoder
  - UUID Generator
  - Hash Generator
  - Schema Validation
  - Diff & Compare
  - Minify & Compress
  - Data Transformation

## Configuration

### API URL

The frontend is configured to use `http://localhost:8080/api` by default. To change this:

1. Create `.env` file in `frontend/` directory:
   ```
   REACT_APP_API_URL=http://your-api-url/api
   ```

2. Restart the development server.

## Building for Production

1. **Build the React app:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Spring Boot:**
   ```bash
   npm run build:deploy
   ```

   Or manually copy:
   ```bash
   # Windows
   xcopy /E /I /Y build\* ..\src\main\resources\static\

   # Linux/Mac
   cp -r build/* ../src/main/resources/static/
   ```

3. **Build Spring Boot:**
   ```bash
   ./mvnw clean package
   ```

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:
```bash
PORT=3001 npm start
```

### API Connection Issues

1. Ensure Spring Boot backend is running on port 8080
2. Check CORS configuration in backend controllers
3. Verify API_BASE_URL in `.env` file

### Build Issues

1. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Clear React build cache:
   ```bash
   rm -rf build
   npm run build
   ```

## Notes

- The old static files (index.html, app.js, styles.css) are still in `src/main/resources/static/`
- After deploying the React build, these will be replaced
- Keep a backup if you need the old files
- The React app uses modern CSS variables for theming
- All functionality from the original app is preserved

