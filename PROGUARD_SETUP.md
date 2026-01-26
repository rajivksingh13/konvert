# ProGuard Obfuscation Setup

## What is ProGuard?

ProGuard is a Java bytecode obfuscator that:
- **Renames classes, methods, and fields** to meaningless names (e.g., `a`, `b`, `c`)
- **Removes debug information** (line numbers, source file names)
- **Optimizes code** (removes unused code, inlines methods)
- **Makes reverse engineering very difficult**

## How It Works

### Build Process:

1. **Maven builds Spring Boot JAR** → `konvertr-1.0.0.jar`
2. **ProGuard obfuscates JAR** → `konvertr-1.0.0-obfuscated.jar`
3. **Rename to `.dat`** → `backend.dat` (additional hiding)
4. **Package with Electron** → Hidden in `resources/backend/`

### What Gets Obfuscated:

✅ **Your application code** (`com.konvert.**`)
- Classes renamed: `KonvertApplication` → `a`
- Methods renamed: `convert()` → `b()`
- Fields renamed: `data` → `c`

❌ **Spring Boot framework** (kept readable - needed for runtime)
❌ **Dependencies** (kept readable - needed for runtime)
❌ **Main class** (kept readable - needed to start app)

### Protection Level:

**Before Obfuscation:**
```java
public class KonvertApplication {
    public void convert(String data) {
        // Your logic here
    }
}
```

**After Obfuscation:**
```java
public class a {
    public void b(String c) {
        // Your logic here (but unreadable)
    }
}
```

**Decompiled code becomes:**
- Unreadable class/method names
- No source file references
- Hard to understand logic
- **Strong IP protection** ✅

## Configuration

### ProGuard Rules (in `pom.xml`):

1. **Keep main class** - Needed to start app
2. **Keep Spring annotations** - Needed for dependency injection
3. **Keep REST controllers** - Needed for API endpoints
4. **Keep event listeners** - Needed for Spring Boot lifecycle
5. **Obfuscate everything else** - Your business logic

### Files:

- `pom.xml` - ProGuard Maven plugin configuration
- `proguard.conf` - Detailed ProGuard rules (reference)
- `target/proguard-mapping.txt` - Maps obfuscated names back (for debugging)

## Build Commands

### Local Build:
```bash
.\build-electron.bat
```

This will:
1. Build Spring Boot JAR
2. Run ProGuard obfuscation
3. Create `backend.dat` (obfuscated JAR)
4. Package with Electron

### Manual ProGuard:
```bash
mvn clean package -DskipTests
# ProGuard runs automatically during package phase
```

## Verification

### Check Obfuscation:

1. **Extract the Electron package**
2. **Navigate to:** `KonvertR-Portable-1.0.0/resources/backend/`
3. **You'll see:** `backend.dat` (not `konvertr-1.0.0.jar`)
4. **Try to decompile:** Use JD-GUI or similar tool
5. **Result:** Classes/methods have meaningless names ✅

### Expected Output:

```
resources/backend/
└── backend.dat  ← Obfuscated JAR (renamed to .dat)
```

**If you decompile `backend.dat`:**
- Class names: `a`, `b`, `c`, etc.
- Method names: `a()`, `b()`, `c()`, etc.
- **Your IP is protected!** ✅

## Troubleshooting

### ProGuard Fails:

**Error:** "Warning: can't find referenced class"
- **Solution:** Add `-dontwarn` rule for that class in `pom.xml`

**Error:** "Class not found"
- **Solution:** Check `-keep` rules for Spring Boot classes

**Error:** "Application doesn't start"
- **Solution:** Check that main class and Spring annotations are kept

### Obfuscated JAR Not Found:

**Check:**
```bash
dir target\konvertr-*-obfuscated.jar
```

**If missing:**
- ProGuard plugin may have failed
- Check Maven build logs
- Fallback: Regular JAR will be used (renamed to `.dat`)

## Security Level

### Current Protection:

✅ **Class/Method Renaming** - Makes decompiled code unreadable
✅ **File Renaming** - `.jar` → `.dat` (less obvious)
✅ **Debug Info Removal** - No source file references
✅ **Code Optimization** - Removes unused code

### Additional Protection (Optional):

1. **Encryption** - Encrypt JAR, decrypt in memory
2. **Embed in EXE** - Embed JAR as binary in Electron EXE
3. **Native Code** - Convert critical parts to native code

## Notes

- **ProGuard mapping file** (`proguard-mapping.txt`) is created for debugging
- **Keep this file private** - It maps obfuscated names back to original
- **For production:** Don't include mapping file in distribution
- **For debugging:** Use mapping file to understand obfuscated stack traces

## Result

✅ **Strong IP Protection**
✅ **Obfuscated Code** - Unreadable when decompiled
✅ **Hidden JAR** - Renamed to `.dat`
✅ **Works with Spring Boot** - All features functional
✅ **Professional Distribution** - Enterprise-ready
