# GitHub Actions Workflow Guide

## Current Situation

You have **3 workflow files**:

1. **`build-electron.yml`** ✅ **USE THIS ONE**
   - Builds **Windows** Electron package
   - Builds **macOS** Electron package
   - Single workflow for both platforms
   - Uses Electron (matches your local build)

2. **`build-windows-exe.yml`** ⚠️ **LEGACY** (Windows-only)
   - Only builds Windows
   - Uses Electron
   - Can be kept as backup or deleted

3. **`build-macos-app.yml`** ❌ **OUTDATED** (macOS-only)
   - Uses `jpackage` (NOT Electron!)
   - Doesn't match your Electron approach
   - Should be deleted or updated

## Recommendation: Use ONE Workflow

### ✅ **Use: `build-electron.yml`**

**This single workflow:**
- ✅ Builds Windows Electron package
- ✅ Builds macOS Electron package  
- ✅ Runs both in parallel (faster)
- ✅ Creates GitHub Release with both packages
- ✅ Matches your local `build-electron.bat` process
- ✅ Only includes `backend.dat` (no JAR files)

## What You Need

**Only 1 workflow file:** `build-electron.yml`

This workflow contains:
- `build-windows` job (runs on `windows-latest`)
- `build-macos` job (runs on `macos-latest`)
- `create-release` job (combines both packages)

## Action Items

### ✅ Keep:
- **`.github/workflows/build-electron.yml`** ← Use this!

### ⚠️ Optional (keep as backup):
- `.github/workflows/build-windows-exe.yml` (can delete if you want)

### ❌ Delete or disable:
- `.github/workflows/build-macos-app.yml` (uses jpackage, not Electron)

## How It Works

When you push a tag (e.g., `v1.0.0`):

1. **Windows job** runs → Creates `KonvertR-Portable-1.0.0.zip` (Windows)
2. **macOS job** runs → Creates `KonvertR-Portable-1.0.0.zip` (macOS)
3. **Release job** runs → Downloads both and creates GitHub Release

## Summary

**Answer: Use 1 workflow file, not 2!**

**File:** `.github/workflows/build-electron.yml`

This single workflow builds both Windows and macOS Electron packages automatically.
