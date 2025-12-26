const API_BASE_URL = 'http://localhost:8080/api';

// Tab switching
function switchTab(tabName) {
    // Update nav items
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeNavItem = document.querySelector(`.nav-item[data-tab="${tabName}"]`);
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }

    // Update panels
    document.querySelectorAll('.panel').forEach(panel => {
        panel.classList.remove('active');
        panel.style.display = 'none';
    });
    const activePanel = document.getElementById(`${tabName}-panel`);
    if (activePanel) {
        activePanel.classList.add('active');
        activePanel.style.display = 'block';
    }
}

// Conversion type mapping
const conversionMap = {
    'json-yaml': { from: 'json', to: 'yaml' },
    'yaml-json': { from: 'yaml', to: 'json' },
    'properties-yaml': { from: 'properties', to: 'yaml' },
    'json-toml': { from: 'json', to: 'toml' },
    'toml-json': { from: 'toml', to: 'json' },
    'xml-json': { from: 'xml', to: 'json' },
    'json-xml': { from: 'json', to: 'xml' },
    'json-protobuf': { from: 'json', to: 'protobuf' },
    'protobuf-json': { from: 'protobuf', to: 'json' },
    'csv-json': { from: 'csv', to: 'json' },
    'json-csv': { from: 'json', to: 'csv' },
    'csv-yaml': { from: 'csv', to: 'yaml' },
    'yaml-csv': { from: 'yaml', to: 'csv' },
    'csv-xml': { from: 'csv', to: 'xml' },
    'xml-csv': { from: 'xml', to: 'csv' }
};

// Show/hide Protobuf schema section
document.getElementById('conversion-type').addEventListener('change', function() {
    const selected = this.value;
    const schemaSection = document.getElementById('protobuf-schema-section');
    const needsSchema = selected === 'json-protobuf' || selected === 'protobuf-json';
    schemaSection.style.display = needsSchema ? 'block' : 'none';
});

// Perform conversion
async function performConversion() {
    const inputArea = document.getElementById('input-area');
    const outputArea = document.getElementById('output-area');
    const errorMessage = document.getElementById('error-message');
    const convertBtn = document.querySelector('#converter-panel .btn-primary');
    
    const input = inputArea.value.trim();
    if (!input) {
        showError('Please enter input data', 'converter');
        return;
    }

    const conversionType = document.getElementById('conversion-type').value;
    const { from, to } = conversionMap[conversionType];
    const protobufSchema = document.getElementById('protobuf-schema').value.trim();

    // Check for Protobuf schema requirement
    if ((from === 'protobuf' || to === 'protobuf') && !protobufSchema) {
        showError('Protobuf schema is required for Protobuf conversions', 'converter');
        return;
    }

    // Hide error, show loading
    errorMessage.style.display = 'none';
    convertBtn.disabled = true;
    convertBtn.classList.add('loading');
    outputArea.value = '';

    try {
        const response = await fetch(`${API_BASE_URL}/convert`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                input,
                fromFormat: from,
                toFormat: to,
                protobufSchema: protobufSchema || null
            })
        });

        const data = await response.json();

        if (data.success) {
            outputArea.value = data.output;
            errorMessage.style.display = 'none';
        } else {
            showError(data.error || 'Conversion failed', 'converter');
        }
    } catch (error) {
        showError('Failed to convert: ' + error.message, 'converter');
    } finally {
        convertBtn.disabled = false;
        convertBtn.classList.remove('loading');
    }
}

// Format data
async function performFormatting() {
    const inputArea = document.getElementById('format-input-area');
    const outputArea = document.getElementById('format-output-area');
    const errorMessage = document.getElementById('format-error-message');
    const formatBtn = document.querySelector('#formatter-panel .btn-primary');

    const input = inputArea.value.trim();
    if (!input) {
        showError('Please enter input data', 'formatter');
        return;
    }

    const formatType = document.getElementById('format-type').value;
    const alignColumns = document.getElementById('csv-align-columns')?.checked || false;

    errorMessage.style.display = 'none';
    formatBtn.disabled = true;
    formatBtn.classList.add('loading');
    outputArea.value = '';

    try {
        const response = await fetch(`${API_BASE_URL}/format`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                input,
                formatType,
                alignColumns
            })
        });

        const data = await response.json();

        if (data.success) {
            outputArea.value = data.output;
            errorMessage.style.display = 'none';
        } else {
            showError(data.error || 'Formatting failed', 'formatter');
        }
    } catch (error) {
        showError('Failed to format: ' + error.message, 'formatter');
    } finally {
        formatBtn.disabled = false;
        formatBtn.classList.remove('loading');
    }
}

function toggleCsvFormatOptions() {
    const formatType = document.getElementById('format-type').value;
    const csvOptions = document.getElementById('csv-format-options');
    csvOptions.style.display = formatType === 'CSV' ? 'block' : 'none';
}

// Base64 operations
async function performBase64Operation() {
    const inputArea = document.getElementById('base64-input-area');
    const outputArea = document.getElementById('base64-output-area');
    const errorMessage = document.getElementById('base64-error-message');
    const operation = document.getElementById('base64-operation').value;
    const btn = document.querySelector('#base64-panel .btn-primary');
    
    const input = inputArea.value.trim();
    if (!input) {
        showError('Please enter input data', 'base64');
        return;
    }

    errorMessage.style.display = 'none';
    btn.disabled = true;
    btn.classList.add('loading');
    outputArea.value = '';

    try {
        const endpoint = operation === 'encode' ? '/base64/encode' : '/base64/decode';
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ input })
        });

        const data = await response.json();

        if (data.success) {
            outputArea.value = data.output;
            errorMessage.style.display = 'none';
        } else {
            showError(data.error || 'Operation failed', 'base64');
        }
    } catch (error) {
        showError('Failed to process: ' + error.message, 'base64');
    } finally {
        btn.disabled = false;
        btn.classList.remove('loading');
    }
}

// Update Base64 button text
document.getElementById('base64-operation').addEventListener('change', function() {
            const btnIcon = document.getElementById('base64-btn-icon');
            const btnText = document.getElementById('base64-btn-text');
            if (this.value === 'encode') {
                btnIcon.textContent = '🔐';
                btnText.textContent = 'Encode';
            } else {
                btnIcon.textContent = '🔓';
                btnText.textContent = 'Decode';
            }
        });

// File upload
let selectedFile = null;
let convertedFileContent = null;

function initializeFileUpload() {
    const dropZone = document.getElementById('file-drop-zone');
    const fileInput = document.getElementById('file-input');
    
    dropZone.addEventListener('click', () => fileInput.click());
    
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });
    
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect({ target: { files: files } });
        }
    });
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        selectedFile = file;
        document.getElementById('selected-file-name').textContent = file.name;
        document.getElementById('file-selected-info').style.display = 'flex';
        document.getElementById('file-drop-zone').style.display = 'none';
        
        // Show/hide Protobuf schema
        const fromFormat = document.getElementById('file-from-format').value;
        const toFormat = document.getElementById('file-to-format').value;
        const schemaSection = document.getElementById('file-protobuf-schema-section');
        schemaSection.style.display = (fromFormat === 'protobuf' || toFormat === 'protobuf') ? 'block' : 'none';
    }
}

function removeSelectedFile() {
    selectedFile = null;
    document.getElementById('file-input').value = '';
    document.getElementById('file-selected-info').style.display = 'none';
    document.getElementById('file-drop-zone').style.display = 'block';
    document.getElementById('file-error-message').style.display = 'none';
    document.getElementById('file-success-message').style.display = 'none';
    document.getElementById('download-btn').style.display = 'none';
    convertedFileContent = null;
}

async function uploadAndConvertFile() {
    if (!selectedFile) {
        showError('Please select a file', 'file');
        return;
    }
    
    const fromFormat = document.getElementById('file-from-format').value;
    const toFormat = document.getElementById('file-to-format').value;
    const protobufSchema = document.getElementById('file-protobuf-schema').value.trim();
    const errorMsg = document.getElementById('file-error-message');
    const successMsg = document.getElementById('file-success-message');
    const btn = document.querySelector('#files-panel .btn-primary');

    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';
    btn.disabled = true;
    btn.classList.add('loading');

    try {
        const formData = new FormData();
        formData.append('file', selectedFile);
        if (fromFormat) formData.append('fromFormat', fromFormat);
        if (toFormat) formData.append('toFormat', toFormat);
        if (protobufSchema) formData.append('protobufSchema', protobufSchema);

        const response = await fetch(`${API_BASE_URL}/files/upload`, {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            convertedFileContent = data.output;
            successMsg.textContent = 'File converted successfully!';
            successMsg.style.display = 'block';
            document.getElementById('download-btn').style.display = 'inline-block';
        } else {
            showError(data.error || 'File conversion failed', 'file');
        }
    } catch (error) {
        showError('Failed to convert file: ' + error.message, 'file');
    } finally {
        btn.disabled = false;
        btn.classList.remove('loading');
    }
}

function downloadConvertedFile() {
    if (!convertedFileContent) return;
    
    const blob = new Blob([convertedFileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
    a.download = selectedFile ? selectedFile.name.split('.')[0] + '.' + document.getElementById('file-to-format').value : 'converted.txt';
            a.click();
    URL.revokeObjectURL(url);
}

function clearFileUpload() {
    removeSelectedFile();
    document.getElementById('file-from-format').value = '';
    document.getElementById('file-to-format').value = 'json';
    document.getElementById('file-protobuf-schema').value = '';
}

// Utility functions
function toggleUtilitySection(sectionId) {
    const content = document.getElementById(`${sectionId}-content`);
    const toggle = document.getElementById(`${sectionId}-toggle`);
    
    if (content.style.display === 'none') {
        content.style.display = 'block';
        toggle.textContent = '▼';
    } else {
        content.style.display = 'none';
        toggle.textContent = '▶';
    }
}

// URL Encoding/Decoding
async function performUrlOperation() {
    const input = document.getElementById('url-input').value.trim();
    const operation = document.getElementById('url-operation').value;
    const output = document.getElementById('url-output');
    
    if (!input) {
        alert('Please enter input');
        return;
    }
    
    try {
        const endpoint = operation === 'encode' ? '/utilities/url/encode' : '/utilities/url/decode';
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input })
        });
        const data = await response.json();
        output.value = data.success ? data.output : 'Error: ' + data.error;
    } catch (error) {
        output.value = 'Error: ' + error.message;
    }
}

// HTML Encoding/Decoding
async function performHtmlOperation() {
    const input = document.getElementById('html-input').value.trim();
    const operation = document.getElementById('html-operation').value;
    const output = document.getElementById('html-output');
    
    if (!input) {
        alert('Please enter input');
        return;
    }
    
    try {
        const endpoint = operation === 'encode' ? '/utilities/html/encode' : '/utilities/html/decode';
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input })
        });
        const data = await response.json();
        output.value = data.success ? data.output : 'Error: ' + data.error;
    } catch (error) {
        output.value = 'Error: ' + error.message;
    }
}

// Hex Encoding/Decoding
async function performHexOperation() {
    const input = document.getElementById('hex-input').value.trim();
    const operation = document.getElementById('hex-operation').value;
    const output = document.getElementById('hex-output');
    
    if (!input) {
        alert('Please enter input');
        return;
    }
    
    try {
        const endpoint = operation === 'encode' ? '/utilities/hex/encode' : '/utilities/hex/decode';
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input })
        });
        const data = await response.json();
        output.value = data.success ? data.output : 'Error: ' + data.error;
    } catch (error) {
        output.value = 'Error: ' + error.message;
    }
}

// JWT Decoder
async function performJWTDecode() {
    const input = document.getElementById('jwt-input').value.trim();
    const output = document.getElementById('jwt-output');
    
    if (!input) {
        alert('Please enter JWT token');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/utilities/jwt/decode`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: input })
        });
        const data = await response.json();
        if (data.success) {
            output.value = JSON.stringify(data.decoded, null, 2);
        } else {
            output.value = 'Error: ' + data.error;
        }
    } catch (error) {
        output.value = 'Error: ' + error.message;
    }
}

// UUID Generator
async function generateUUIDs() {
    const version = document.getElementById('uuid-version').value;
    const count = parseInt(document.getElementById('uuid-count').value) || 1;
    const output = document.getElementById('uuid-output');
    
    try {
        const response = await fetch(`${API_BASE_URL}/utilities/uuid/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ version, count })
        });
        const data = await response.json();
        if (data.success) {
            output.value = Array.isArray(data.output) ? data.output.join('\n') : data.output;
        } else {
            output.value = 'Error: ' + data.error;
        }
    } catch (error) {
        output.value = 'Error: ' + error.message;
    }
}

// Hash Generator
async function generateHash() {
    const input = document.getElementById('hash-input').value.trim();
    const algorithm = document.getElementById('hash-algorithm').value;
    const output = document.getElementById('hash-output');
    
    if (!input) {
        alert('Please enter input');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/utilities/hash/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input, algorithm })
        });
        const data = await response.json();
        output.value = data.success ? data.hash : 'Error: ' + data.error;
    } catch (error) {
        output.value = 'Error: ' + error.message;
    }
}

// Schema Validation
async function validateSchema() {
    const input = document.getElementById('validation-input').value.trim();
    const format = document.getElementById('validation-format').value;
    const output = document.getElementById('validation-output');
    
    if (!input) {
        alert('Please enter input');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/validate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input, format })
        });
        const data = await response.json();
        if (data.success) {
            output.value = '✓ Valid ' + format.toUpperCase();
        } else {
            output.value = 'Error: ' + data.error;
        }
    } catch (error) {
        output.value = 'Error: ' + error.message;
    }
}

// Diff & Compare
let originalText1 = '';
let originalText2 = '';

async function compareFiles() {
    const editor1 = document.getElementById('diff-editor-1');
    const editor2 = document.getElementById('diff-editor-2');
    const hiddenInput1 = document.getElementById('diff-hidden-input-1');
    const hiddenInput2 = document.getElementById('diff-hidden-input-2');
    const format = document.getElementById('diff-format').value;
    const errorMsg = document.getElementById('diff-error-message');
    const reportContainer = document.getElementById('diff-report-container');
    
    // Get text from hidden inputs or editors
    const text1 = hiddenInput1.value.trim() || editor1.textContent.trim();
    const text2 = hiddenInput2.value.trim() || editor2.textContent.trim();
    
    if (!text1 || !text2) {
        errorMsg.textContent = 'Please enter both files';
        errorMsg.style.display = 'block';
        return;
    }
    
    originalText1 = text1;
    originalText2 = text2;

    errorMsg.style.display = 'none';
    const btn = document.querySelector('#diff-content .btn-primary');
    btn.disabled = true;
    btn.classList.add('loading');

    try {
        const response = await fetch(`${API_BASE_URL}/diff/compare`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ file1: text1, file2: text2, format })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        
        const data = await response.json();

        if (data.success) {
            renderEnhancedDiff(text1, text2, data.differences || []);
            
            // Generate and show report
            const reportResponse = await fetch(`${API_BASE_URL}/diff/report`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ file1: text1, file2: text2, format })
            });
            const reportData = await reportResponse.json();
            if (reportData.success) {
                document.getElementById('diff-report-content').textContent = reportData.report;
                reportContainer.style.display = 'block';
            }
        } else {
            errorMsg.textContent = data.error || 'Comparison failed';
            errorMsg.style.display = 'block';
        }
    } catch (error) {
        errorMsg.textContent = 'Failed to compare: ' + error.message;
        errorMsg.style.display = 'block';
    } finally {
        btn.disabled = false;
        btn.classList.remove('loading');
    }
}

function formatJsonString(jsonString, format) {
    if (format === 'json' && jsonString) {
        try {
            if (jsonString.includes('\n') && jsonString.match(/^\s+/m)) {
                return jsonString;
            }
            const parsed = JSON.parse(jsonString);
            return JSON.stringify(parsed, null, 2);
        } catch (e) {
            return jsonString;
        }
    }
    return jsonString;
}

function renderEnhancedDiff(text1, text2, differences) {
    const editor1 = document.getElementById('diff-editor-1');
    const editor2 = document.getElementById('diff-editor-2');
    const hiddenInput1 = document.getElementById('diff-hidden-input-1');
    const hiddenInput2 = document.getElementById('diff-hidden-input-2');
    const format = document.getElementById('diff-format').value;
    
    // Format JSON if needed
    const formattedText1 = formatJsonString(text1, format);
    const formattedText2 = formatJsonString(text2, format);
    
    const lines1 = formattedText1.split('\n');
    const lines2 = formattedText2.split('\n');
    
    // Store original text in hidden inputs
    hiddenInput1.value = formattedText1;
    hiddenInput2.value = formattedText2;
    
    // Render lines
    function renderLines(lines, editor) {
        editor.innerHTML = '';
        lines.forEach((line, index) => {
            const lineDiv = document.createElement('div');
            lineDiv.className = 'diff-line unchanged';
            lineDiv.textContent = line;
            editor.appendChild(lineDiv);
        });
    }
    
    renderLines(lines1, editor1);
    renderLines(lines2, editor2);
    
    // Hide line numbers
    document.getElementById('diff-line-numbers-1').style.setProperty('display', 'none', 'important');
    document.getElementById('diff-line-numbers-2').style.setProperty('display', 'none', 'important');
    
    // Ensure editors are visible and editable
    editor1.contentEditable = 'true';
    editor2.contentEditable = 'true';
    editor1.style.setProperty('display', 'block', 'important');
    editor2.style.setProperty('display', 'block', 'important');
    
    const wrapper1 = editor1.closest('.diff-editor-wrapper');
    const wrapper2 = editor2.closest('.diff-editor-wrapper');
    if (wrapper1) wrapper1.style.setProperty('display', 'flex', 'important');
    if (wrapper2) wrapper2.style.setProperty('display', 'flex', 'important');
    
    const side1 = editor1.closest('.diff-side');
    const side2 = editor2.closest('.diff-side');
    if (side1) side1.style.setProperty('display', 'block', 'important');
    if (side2) side2.style.setProperty('display', 'block', 'important');
    
    const container = document.querySelector('.diff-container');
    if (container) {
        container.classList.add('force-two-columns');
        container.style.setProperty('display', 'grid', 'important');
        container.style.setProperty('grid-template-columns', '1fr 1fr', 'important');
    }
}

function clearDiffEditors() {
    const editor1 = document.getElementById('diff-editor-1');
    const editor2 = document.getElementById('diff-editor-2');
    const hiddenInput1 = document.getElementById('diff-hidden-input-1');
    const hiddenInput2 = document.getElementById('diff-hidden-input-2');
    const reportContainer = document.getElementById('diff-report-container');
    const errorMsg = document.getElementById('diff-error-message');
    
    editor1.innerHTML = '';
    editor2.innerHTML = '';
    hiddenInput1.value = '';
    hiddenInput2.value = '';
    reportContainer.style.display = 'none';
    errorMsg.style.display = 'none';
    
    editor1.contentEditable = 'true';
    editor2.contentEditable = 'true';
    
    originalText1 = '';
    originalText2 = '';
}

// Minify
async function minifyData() {
    const input = document.getElementById('minify-input').value.trim();
    const format = document.getElementById('minify-format').value;
    const output = document.getElementById('minify-output');
    
    if (!input) {
        alert('Please enter input');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/minify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input, format })
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = `Server error (${response.status})`;
            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.error || errorMessage;
            } catch (e) {
                errorMessage = errorText || errorMessage;
            }
            output.value = 'Error: ' + errorMessage;
            return;
        }
        
        const data = await response.json();
        output.value = data.success ? data.output : 'Error: ' + data.error;
    } catch (error) {
        output.value = 'Error: ' + error.message;
    }
}

// CSS Beautify
async function beautifyCss() {
    const input = document.getElementById('css-beautify-input').value.trim();
    const output = document.getElementById('css-beautify-output');
    
    if (!input) {
        output.value = '';
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/beautify/css`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = `Server error (${response.status})`;
            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.error || errorMessage;
            } catch (e) {
                errorMessage = errorText || errorMessage;
            }
            output.value = 'Error: ' + errorMessage;
            return;
        }
        
        const data = await response.json();
        if (data.success) {
            output.value = data.output;
        } else {
            output.value = 'Error: ' + (data.error || 'Unknown error');
        }
    } catch (error) {
        output.value = 'Error: ' + (error.message || 'Failed to process request');
    }
}

// Gzip Compress
async function compressGzip() {
    const input = document.getElementById('gzip-input').value.trim();
    const output = document.getElementById('gzip-output');
    
    if (!input) {
        alert('Please enter input');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/compress/gzip`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input })
        });
        const data = await response.json();
        if (data.success) {
            output.value = data.compressed || data.output;
        } else {
            output.value = 'Error: ' + data.error;
        }
    } catch (error) {
        output.value = 'Error: ' + error.message;
    }
}

// Remove Comments
async function removeComments() {
    const input = document.getElementById('remove-comments-input').value.trim();
    const format = document.getElementById('remove-comments-format').value;
    const output = document.getElementById('remove-comments-output');
    
    if (!input) {
        alert('Please enter input');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/remove-comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input, format })
        });
        const data = await response.json();
        output.value = data.success ? data.output : 'Error: ' + data.error;
    } catch (error) {
        output.value = 'Error: ' + error.message;
    }
}

// Data Transformation - Merge JSON
async function mergeJsonObjects() {
    const input = document.getElementById('merge-input').value.trim();
    const output = document.getElementById('merge-output');
    
    if (!input) {
        alert('Please enter JSON objects');
        return;
    }
    
    try {
        const lines = input.split('\n').filter(line => line.trim());
        const objects = lines.map(line => {
            try {
                return JSON.parse(line.trim());
            } catch {
                return null;
            }
        }).filter(obj => obj !== null);
        
        if (objects.length === 0) {
            output.value = 'Error: No valid JSON objects found';
            return;
        }
        
        const response = await fetch(`${API_BASE_URL}/utilities/transform/merge`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ objects })
        });
        const data = await response.json();
        output.value = data.success ? data.output : 'Error: ' + data.error;
    } catch (error) {
        output.value = 'Error: ' + error.message;
    }
}

// Flatten Data
async function flattenData() {
    const input = document.getElementById('flatten-input').value.trim();
    const format = document.getElementById('flatten-format').value;
    const separator = document.getElementById('flatten-separator').value || '.';
    const output = document.getElementById('flatten-output');
    
    if (!input) {
        alert('Please enter input');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/utilities/transform/flatten`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input, format, separator })
        });
        const data = await response.json();
        output.value = data.success ? data.output : 'Error: ' + data.error;
    } catch (error) {
        output.value = 'Error: ' + error.message;
    }
}

// Unflatten Data
async function unflattenData() {
    const input = document.getElementById('unflatten-input').value.trim();
    const format = document.getElementById('unflatten-format').value;
    const separator = document.getElementById('unflatten-separator').value || '.';
    const output = document.getElementById('unflatten-output');
    
    if (!input) {
        alert('Please enter input');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/utilities/transform/unflatten`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input, format, separator })
        });
        const data = await response.json();
        output.value = data.success ? data.output : 'Error: ' + data.error;
    } catch (error) {
        output.value = 'Error: ' + error.message;
    }
}

// Rename Keys
async function renameKeys() {
    const input = document.getElementById('rename-keys-input').value.trim();
    const renameMap = document.getElementById('rename-keys-map').value.trim();
    const output = document.getElementById('rename-keys-output');
    
    if (!input || !renameMap) {
        alert('Please enter JSON and rename map');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/utilities/transform/rename-keys`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input, renameMap })
        });
        const data = await response.json();
        output.value = data.success ? data.output : 'Error: ' + data.error;
    } catch (error) {
        output.value = 'Error: ' + error.message;
    }
}

// Transform Values
async function transformValues() {
    const input = document.getElementById('transform-values-input').value.trim();
    const transformation = document.getElementById('transform-values-type').value;
    const output = document.getElementById('transform-values-output');
    
    if (!input) {
        alert('Please enter JSON');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/utilities/transform/transform-values`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input, transformation })
        });
        const data = await response.json();
        output.value = data.success ? data.output : 'Error: ' + data.error;
    } catch (error) {
        output.value = 'Error: ' + error.message;
    }
}

// Filter Fields
async function filterFields() {
    const input = document.getElementById('filter-fields-input').value.trim();
    const fieldsToRemove = document.getElementById('filter-fields-list').value.trim();
    const output = document.getElementById('filter-fields-output');
    
    if (!input || !fieldsToRemove) {
        alert('Please enter JSON and fields to remove');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/utilities/transform/filter-fields`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input, fieldsToRemove })
        });
        const data = await response.json();
        output.value = data.success ? data.output : 'Error: ' + data.error;
    } catch (error) {
        output.value = 'Error: ' + error.message;
    }
}

// Convert Types
async function convertTypes() {
    const input = document.getElementById('convert-types-input').value.trim();
    const typeMap = document.getElementById('convert-types-map').value.trim();
    const output = document.getElementById('convert-types-output');
    
    if (!input || !typeMap) {
        alert('Please enter JSON and type map');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/utilities/transform/convert-types`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input, typeMap })
        });
        const data = await response.json();
        output.value = data.success ? data.output : 'Error: ' + data.error;
    } catch (error) {
        output.value = 'Error: ' + error.message;
    }
}

// Clear utility functions
function clearUtility(inputId, outputId) {
    if (inputId) document.getElementById(inputId).value = '';
    if (outputId) document.getElementById(outputId).value = '';
}

function clearUtilityMultiple(elementIds) {
    elementIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.value = '';
    });
}

// Helper functions
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    if (element && element.value) {
        navigator.clipboard.writeText(element.value);
        // Show temporary feedback
        const btn = event.target.closest('.icon-btn');
        if (btn) {
            const original = btn.innerHTML;
            btn.innerHTML = '<span>✓</span>';
            setTimeout(() => { btn.innerHTML = original; }, 1000);
        }
    }
}

function clearTextArea(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.value = '';
    }
}

function clearAll() {
    document.getElementById('input-area').value = '';
    document.getElementById('output-area').value = '';
    document.getElementById('protobuf-schema').value = '';
    document.getElementById('error-message').style.display = 'none';
}

function clearFormatAll() {
    document.getElementById('format-input-area').value = '';
    document.getElementById('format-output-area').value = '';
    document.getElementById('format-error-message').style.display = 'none';
}

function clearBase64All() {
    document.getElementById('base64-input-area').value = '';
    document.getElementById('base64-output-area').value = '';
    document.getElementById('base64-error-message').style.display = 'none';
}

function showError(message, panel) {
    const errorId = panel === 'converter' ? 'error-message' : 
                    panel === 'formatter' ? 'format-error-message' :
                    panel === 'base64' ? 'base64-error-message' :
                    panel === 'file' ? 'file-error-message' : 'error-message';
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

// Theme toggle
function initTheme() {
    const savedTheme = localStorage.getItem('konvert-theme') || 'light';
    setTheme(savedTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('konvert-theme', theme);
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
        themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    switchTab('converter');
    
    const converterPanel = document.getElementById('converter-panel');
    if (converterPanel) {
        converterPanel.style.display = 'block';
    }
    
    const utilitySections = document.querySelectorAll('.utility-section');
    utilitySections.forEach(section => {
        section.classList.remove('collapsed');
    });
    
    initializeFileUpload();
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            const activePanel = document.querySelector('.panel.active');
            if (activePanel.id === 'converter-panel') {
                performConversion();
            } else if (activePanel.id === 'formatter-panel') {
                performFormatting();
            } else if (activePanel.id === 'base64-panel') {
                performBase64Operation();
            }
        }
    });
});

