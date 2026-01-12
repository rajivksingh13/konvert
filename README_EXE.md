# Creating Single EXE File - Complete Guide

## Goal
Create a **single .exe file** that:
- ✅ User just clicks and runs
- ✅ Everything bundled (JAR, JRE, frontend)
- ✅ No JAR files visible to users
- ✅ No source code visible
- ✅ Works on Windows

## Solution Options

### Option 1: Self-Extracting EXE (Recommended - Easiest)

**Requires:** 7-Zip (free, download from https://7-zip.org/)

**Build:**
```batch
create-single-exe.bat
```

**Result:**
- `KonvertR-Standalone-{version}.exe` - Single file
- User double-clicks → Extracts to temp → Runs → Cleans up
- No installation needed
- Portable (can copy to USB)

**How it works:**
1. jpackage creates application package
2. 7-Zip creates self-extracting archive
3. EXE extracts to temp folder when run
4. Runs KonvertR.exe automatically
5. Cleans up on exit

### Option 2: Installer EXE (Professional)

**Requires:** WiX Toolset (free, download from https://wixtoolset.org/releases/)

**Build:**
```batch
create-exe-installer.bat
```

**Result:**
- `KonvertR-{version}.exe` - Installer
- User runs installer → Installs to Program Files
- Creates Start Menu shortcut
- Professional Windows application

**How it works:**
1. jpackage creates Windows installer
2. User installs like any Windows app
3. Application installed to Program Files
4. Start Menu integration

### Option 3: Portable Package (No Tools Needed)

**Build:**
```batch
create-single-exe.bat
```

**Result:**
- `KonvertR-Portable-{version}.zip`
- User extracts → Runs `KonvertR\KonvertR.exe`
- Everything bundled (no JAR visible)

## Quick Start

### For Self-Extracting EXE:

1. **Install 7-Zip** (if not installed):
   - Download: https://7-zip.org/
   - Install normally

2. **Build:**
   ```batch
   create-single-exe.bat
   ```

3. **Result:**
   - `KonvertR-Standalone-1.0.0.exe` - Single file
   - Share this file with users
   - Users just double-click to run

### For Installer EXE:

1. **Install WiX Toolset:**
   - Download: https://wixtoolset.org/releases/
   - Install WiX Toolset v3.11+
   - Add to PATH: `C:\Program Files (x86)\WiX Toolset v3.11\bin`

2. **Build:**
   ```batch
   create-exe-installer.bat
   ```

3. **Result:**
   - `KonvertR-1.0.0.exe` - Installer
   - Share with users
   - Users install like any Windows app

## What Gets Bundled

Both approaches bundle:
- ✅ Spring Boot application (JAR)
- ✅ React frontend (built)
- ✅ Java Runtime (JRE)
- ✅ All dependencies
- ✅ Everything in one file

**User sees:**
- Just the EXE file
- No JAR files
- No source code
- No folders (with SFX) or clean install (with installer)

## File Sizes

- **JAR only:** ~28 MB (requires Java)
- **Self-extracting EXE:** ~150-200 MB (includes JRE)
- **Installer EXE:** ~150-200 MB (includes JRE)

The larger size is because the JRE (~120-150 MB) is bundled.

## Testing

After creating the EXE:

1. **Test self-extracting EXE:**
   - Double-click `KonvertR-Standalone-{version}.exe`
   - Should extract and run automatically
   - Browser opens to http://localhost:8080

2. **Test installer EXE:**
   - Run `KonvertR-{version}.exe`
   - Follow installation wizard
   - Launch from Start Menu
   - Should work normally

## Troubleshooting

### "7-Zip not found"
- Install 7-Zip from https://7-zip.org/
- Restart command prompt
- Run script again

### "WiX Toolset not found"
- Install WiX from https://wixtoolset.org/releases/
- Add to PATH
- Restart command prompt

### EXE doesn't run
- Check Windows Defender/antivirus (may block SFX)
- Try running as administrator
- Check if temp folder has write permissions

## Recommendation

**For most users:** Use **Option 1 (Self-Extracting EXE)**
- Easiest to create (just need 7-Zip)
- Easiest for users (just double-click)
- Portable (no installation)
- Single file

**For professional distribution:** Use **Option 2 (Installer EXE)**
- Professional installer
- Windows integration
- Better for enterprise

## Summary

✅ **Single EXE file** - User just clicks and runs  
✅ **Everything bundled** - JAR, JRE, frontend all included  
✅ **No JAR visible** - Everything packaged in EXE  
✅ **No source code** - Only executable files  
✅ **Works on Windows** - Native Windows application

The self-extracting EXE approach is the **easiest and most user-friendly**!
