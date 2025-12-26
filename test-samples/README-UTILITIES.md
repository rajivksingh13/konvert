# Utilities Test Files

This directory contains test files for all the utilities implemented in Konvert.

## Test Files Overview

### 1. URL Encoding/Decoding
- **url-encode-test.txt** - Sample URLs for encoding
- **url-encoded-test.txt** - Already encoded URLs for decoding

**Usage:**
- Copy a URL from `url-encode-test.txt` → Paste in URL input → Select "Encode" → Click "Process"
- Copy an encoded URL from `url-encoded-test.txt` → Paste in URL input → Select "Decode" → Click "Process"

### 2. HTML Entity Encoding/Decoding
- **html-encode-test.txt** - Sample HTML content for encoding
- **html-encoded-test.txt** - Already encoded HTML for decoding

**Usage:**
- Copy HTML from `html-encode-test.txt` → Paste in HTML input → Select "Encode" → Click "Process"
- Copy encoded HTML from `html-encoded-test.txt` → Paste in HTML input → Select "Decode" → Click "Process"

### 3. Hex Encoding/Decoding
- **hex-encode-test.txt** - Sample text for hex encoding
- **hex-encoded-test.txt** - Already hex-encoded strings for decoding

**Usage:**
- Copy text from `hex-encode-test.txt` → Paste in Hex input → Select "Encode" → Click "Process"
- Copy hex string from `hex-encoded-test.txt` → Paste in Hex input → Select "Decode" → Click "Process"

### 4. JWT Decoder
- **jwt-tokens.txt** - Sample JWT tokens for decoding

**Usage:**
- Copy a JWT token from `jwt-tokens.txt` → Paste in JWT input → Click "Decode"
- The decoded header, payload, and signature will be displayed

**Note:** These are example tokens. The signatures may not be valid, but the decoder will show the header and payload structure.

### 5. UUID Generator
**Usage:**
- Select UUID version (v4 or v1)
- Enter count (1-100)
- Click "Generate"
- Generated UUIDs will appear in the output

**No test file needed** - This is a generator, not an encoder/decoder.

### 6. Hash Generator
- **hash-test-inputs.txt** - Sample inputs for hash generation

**Usage:**
- Copy text from `hash-test-inputs.txt` → Paste in Hash input
- Select algorithm (MD5, SHA-1, SHA-256, SHA-512)
- Click "Generate"
- Hash will appear in the output

## Testing Workflow

1. **Open Konvert Application**
2. **Navigate to "Utilities" tab**
3. **Expand the section you want to test**
4. **Copy appropriate test data from the files**
5. **Paste into the input field**
6. **Select operation/algorithm**
7. **Click "Process" or "Generate"**
8. **Verify the output**

## Expected Results

### URL Encoding
- Spaces become `%20`
- Special characters are percent-encoded
- Unicode characters are properly encoded

### HTML Encoding
- `<` becomes `&lt;`
- `>` becomes `&gt;`
- `&` becomes `&amp;`
- Quotes are encoded

### Hex Encoding
- Each character becomes 2 hex digits
- Output is lowercase hex string
- Spaces and separators are handled

### JWT Decoding
- Header shows algorithm and token type
- Payload shows claims (user info, expiration, etc.)
- Signature is displayed (not verified)

### Hash Generation
- MD5: 32-character hex string
- SHA-1: 40-character hex string
- SHA-256: 64-character hex string
- SHA-512: 128-character hex string

## Notes

- All test files use UTF-8 encoding
- Some JWT tokens may have invalid signatures (for testing purposes only)
- Hex strings can include spaces, colons, or dashes - the decoder handles them
- URL encoding preserves the structure while encoding special characters
- HTML encoding is useful for displaying HTML in text without rendering it

## Tips

1. **Test both directions**: Always test encode → decode to verify round-trip
2. **Test edge cases**: Empty strings, special characters, unicode
3. **Test with different algorithms**: Try all hash algorithms with the same input
4. **Verify JWT structure**: Check that decoded JWTs show proper JSON structure
5. **Test multiple UUIDs**: Generate multiple UUIDs to ensure uniqueness

