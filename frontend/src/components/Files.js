import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, FileText, X, RefreshCw, Download, Trash2, File, 
  FolderOpen, ChevronDown, GitBranch, Check, Copy, Package, HelpCircle
} from 'lucide-react';
import { TextArea, Select, Label } from './UI/Input';
import { ErrorMessage, SuccessMessage } from './UI/Message';
import api from '../services/api';

const FORMAT_OPTIONS = [
  { value: '', label: 'Auto-detect' },
  { value: 'json', label: 'JSON' },
  { value: 'yaml', label: 'YAML' },
  { value: 'xml', label: 'XML' },
  { value: 'toml', label: 'TOML' },
  { value: 'properties', label: 'Properties' },
  { value: 'csv', label: 'CSV' },
  { value: 'protobuf', label: 'Protobuf' }
];

// Section Component (similar to Transform, Beautify, and Encode/Decode tabs)
const Section = ({ title, icon: Icon, description, children, defaultExpanded = false, actions }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-modern overflow-hidden mb-4"
    >
      <div className="w-full flex items-center justify-between p-5">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-3 flex-1 hover:bg-[var(--bg-secondary)] transition-colors rounded-lg p-2 -m-2 text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg flex-shrink-0">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
            {description && <p className="text-xs text-[var(--text-secondary)] mt-0.5">{description}</p>}
          </div>
        </button>
        <div className="flex items-center gap-2 flex-shrink-0">
          {actions && (
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              {actions}
            </div>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 hover:bg-[var(--bg-secondary)] transition-colors rounded-lg -m-2"
          >
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-5 h-5 text-[var(--text-secondary)]" />
            </motion.div>
          </button>
        </div>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-[var(--border-color)]"
          >
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// File Item Component
const FileItem = ({ title, icon: Icon, children }) => (
  <div className="p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] mb-4">
    <div className="flex items-center gap-2 mb-4">
      {Icon && <Icon className="w-5 h-5 text-primary-500" />}
      <h4 className="font-semibold text-[var(--text-primary)]">{title}</h4>
    </div>
    {children}
  </div>
);

const Files = () => {
  const [activeSidebarItem, setActiveSidebarItem] = useState('file-operations');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const sidebarItems = [
    {
      id: 'file-operations',
      title: 'File Operations',
      icon: File,
      description: 'Drag & drop upload, file-based format conversion, auto-detect format'
    },
    {
      id: 'batch-processing',
      title: 'Batch Processing',
      icon: Package,
      description: 'Execute bulk transformations across mixed-format datasets'
    },
    {
      id: 'compare-diff',
      title: 'Compare & Diff',
      icon: GitBranch,
      description: 'Identify structural and content-level differences across data assets'
    }
  ];

  return (
    <div className="full-width flex flex-col lg:flex-row gap-6 w-full max-w-full px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 lg:pt-5">
      {/* Left Sidebar */}
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full lg:w-72 xl:w-80 flex-shrink-0"
      >
        <div className="card-modern p-3 sticky top-20 flex flex-col h-[calc(100vh-6rem)]">
          <div className="space-y-2">
            {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSidebarItem === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveSidebarItem(item.id)}
                className={`
                  relative w-full flex items-start gap-3 p-4 rounded-xl text-left transition-all duration-200 min-h-[90px]
                  ${isActive
                    ? 'bg-gradient-to-r from-primary-500/10 to-secondary-500/10 dark:from-primary-500/20 dark:to-secondary-500/20 border border-primary-500/30 dark:border-primary-500/30 shadow-sm'
                    : 'hover:bg-[var(--bg-secondary)] border border-transparent'
                  }
                `}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`
                  w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all
                  ${isActive
                    ? 'bg-gradient-to-br from-primary-500 to-secondary-500 shadow-lg shadow-primary-500/30'
                    : 'bg-[var(--bg-tertiary)]'
                  }
                `}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[var(--text-secondary)]'}`} />
                </div>
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex flex-col gap-0.5 mb-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`text-sm font-semibold leading-tight ${isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                        {item.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] leading-relaxed line-clamp-3">{item.description}</p>
                </div>
                {isActive && (
                  <motion.div
                    layoutId="activeSidebarIndicator"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-gradient-to-b from-primary-500 to-secondary-500 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            );
            })}
          </div>
          <div className="mt-auto pt-3 border-t border-[var(--border-color)] text-[11px] text-[var(--text-muted)] leading-relaxed">
            <p>© 2026 KonvertR All rights reserved</p>
            <p className="mt-2">Created and Developed by Rajiv_Kumar_f8dd89</p>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 space-y-6 w-full max-w-none">
        <AnimatePresence mode="wait">
          {activeSidebarItem === 'file-operations' && (
            <motion.div
              key="file-operations"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-4">
                <FileOperationsSection />
              </div>
            </motion.div>
          )}

          {activeSidebarItem === 'batch-processing' && (
            <motion.div
              key="batch-processing"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-4">
                <BatchProcessingSection />
              </div>
            </motion.div>
          )}

          {activeSidebarItem === 'compare-diff' && (
            <motion.div
              key="compare-diff"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-4">
                <CompareDiffSection />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error & Success Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <ErrorMessage message={error} />
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <SuccessMessage message={success} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// File Operations Section
const FileOperationsSection = () => {
  const [fromFormat, setFromFormat] = useState('');
  const [toFormat, setToFormat] = useState('json');
  const [protobufSchema, setProtobufSchema] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [convertedContent, setConvertedContent] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showHowToUse, setShowHowToUse] = useState(false);
  const fileInputRef = useRef(null);

  const needsProtobufSchema = fromFormat === 'protobuf' || toFormat === 'protobuf';

  const handleFileSelect = (file) => {
    if (file) {
      setSelectedFile(file);
      setConvertedContent(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleConvert = async () => {
    if (!selectedFile) {
      alert('Please select a file');
      return;
    }

    if (needsProtobufSchema && !protobufSchema.trim()) {
      alert('Protobuf schema is required for Protobuf conversions');
      return;
    }

    setLoading(true);
    try {
      const result = await api.uploadFile(selectedFile, fromFormat, toFormat, protobufSchema || null);
      setConvertedContent(result.output || result.content);
    } catch (err) {
      alert(err.message || 'File conversion failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (content, filename) => {
    if (!content) return;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const extension = toFormat || 'txt';
    const downloadName = filename || (selectedFile ? selectedFile.name.split('.')[0] + '.' + extension : 'converted.txt');
    a.download = downloadName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    if (!convertedContent) return;
    await navigator.clipboard.writeText(convertedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setConvertedContent(null);
    setFromFormat('');
    setToFormat('json');
    setProtobufSchema('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Section
      title="File Operations"
      icon={File}
      description="Drag & drop upload, file-based format conversion, auto-detect format, download converted files"
      defaultExpanded={true}
      actions={
        <>
          <motion.button
            onClick={handleConvert}
            disabled={loading || !selectedFile}
            className="btn-primary-modern px-4"
            whileHover={{ scale: loading || !selectedFile ? 1 : 1.02 }}
            whileTap={{ scale: loading || !selectedFile ? 1 : 0.98 }}
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block mr-2"
                >
                  <RefreshCw className="w-4 h-4" />
                </motion.div>
                Converting...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 inline mr-2" />
                Convert
              </>
            )}
          </motion.button>
          <motion.button
            onClick={handleClear}
            className="btn-secondary-modern px-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Clear
          </motion.button>
        </>
      }
    >
      <FileItem title="File Operations" icon={File}>
        <div className="space-y-4">
          {/* How To Use Button */}
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => setShowHowToUse(!showHowToUse)}
              className="flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              {showHowToUse ? 'Hide' : 'Show'} How To Use
            </button>
          </div>
          
          {/* How To Use Tooltip */}
          <AnimatePresence>
            {showHowToUse && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 mb-3">
                  <div className="space-y-3 text-xs text-[var(--text-secondary)]">
                    <div>
                      <strong className="text-[var(--text-primary)] block mb-2 text-sm">How To Use File Operations:</strong>
                      <ol className="list-decimal list-inside space-y-2 ml-2">
                        <li><strong>Select Source Format (Optional):</strong> Choose the format of your input file from the "Source Format" dropdown, or leave it as "Auto-detect" to let the system detect it automatically</li>
                        <li><strong>Select Target Format:</strong> Choose the format you want to convert your file to from the "Target Format" dropdown (JSON, YAML, XML, TOML, Properties, CSV, or Protobuf)</li>
                        <li><strong>Upload File:</strong> You can upload a file in two ways:
                          <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                            <li><strong>Drag & Drop:</strong> Drag a file from your computer and drop it in the upload area</li>
                            <li><strong>Click to Browse:</strong> Click the upload area to open a file browser and select a file</li>
                          </ul>
                        </li>
                        <li><strong>Protobuf Schema (If Needed):</strong> If converting to/from Protobuf format, paste your .proto schema definition in the Protobuf Schema text area</li>
                        <li><strong>Convert:</strong> Click the "Convert" button to convert your file to the selected target format</li>
                        <li><strong>View Converted Content:</strong> The converted content will appear in the "Converted Content" area below</li>
                        <li><strong>Copy or Download:</strong> Use the copy button to copy the converted content, or click "Download" to save it as a file</li>
                        <li><strong>Clear:</strong> Click "Clear" to reset and start a new conversion</li>
                      </ol>
                    </div>
                    
                    <div className="pt-2 border-t border-purple-200 dark:border-purple-700">
                      <strong className="text-[var(--text-primary)] block mb-1">Supported Formats:</strong>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li><strong>JSON:</strong> JavaScript Object Notation - widely used for data exchange</li>
                        <li><strong>YAML:</strong> Human-readable data serialization format</li>
                        <li><strong>XML:</strong> Extensible Markup Language - structured data format</li>
                        <li><strong>TOML:</strong> Tom's Obvious Minimal Language - configuration file format</li>
                        <li><strong>Properties:</strong> Java Properties file format</li>
                        <li><strong>CSV:</strong> Comma-Separated Values - tabular data format</li>
                        <li><strong>Protobuf:</strong> Protocol Buffers - requires schema definition</li>
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-purple-200 dark:border-purple-700">
                      <strong className="text-[var(--text-primary)] block mb-1">Features:</strong>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li><strong>Auto-Detection:</strong> Leave source format as "Auto-detect" to automatically identify the file format</li>
                        <li><strong>Drag & Drop:</strong> Easy file upload by dragging files directly onto the upload area</li>
                        <li><strong>File Preview:</strong> See selected file name and size before conversion</li>
                        <li><strong>Download Converted Files:</strong> Download converted content with the correct file extension</li>
                        <li><strong>Copy to Clipboard:</strong> Quickly copy converted content without downloading</li>
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-purple-200 dark:border-purple-700">
                      <strong className="text-[var(--text-primary)] block mb-1">Tips:</strong>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Use "Auto-detect" for source format when you're unsure of the file format</li>
                        <li>For Protobuf conversions, make sure to provide a valid .proto schema</li>
                        <li>Large files may take longer to convert - be patient</li>
                        <li>The converted file will have the appropriate extension based on the target format</li>
                        <li>You can convert between any supported formats</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Format Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="file-from-format" className="block mb-2 text-sm font-semibold">
                Source Format
              </Label>
              <Select
                id="file-from-format"
                value={fromFormat}
                onChange={(e) => setFromFormat(e.target.value)}
                options={FORMAT_OPTIONS}
                className="input-modern"
              />
              <p className="text-xs text-[var(--text-muted)] mt-1">Auto-detected if not specified</p>
            </div>
            <div>
              <Label htmlFor="file-to-format" className="block mb-2 text-sm font-semibold">
                Target Format
              </Label>
              <Select
                id="file-to-format"
                value={toFormat}
                onChange={(e) => setToFormat(e.target.value)}
                options={FORMAT_OPTIONS.filter(opt => opt.value !== '')}
                className="input-modern"
              />
            </div>
          </div>

          {/* File Drop Zone */}
          <AnimatePresence mode="wait">
            {!selectedFile ? (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`
                  relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
                  transition-all duration-300
                  ${dragOver 
                    ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/20 scale-105' 
                    : 'border-[var(--border-color)] bg-[var(--bg-tertiary)] hover:border-primary-400 hover:bg-primary-50/30 dark:hover:bg-primary-900/10'
                  }
                `}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                <motion.div
                  animate={{ y: dragOver ? -5 : 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Upload className="w-12 h-12 mx-auto mb-4 text-primary-500" />
                  <p className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                    Drag & drop files here
                  </p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    or click to browse
                  </p>
                </motion.div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                />
              </motion.div>
            ) : (
              <motion.div
                key="selected"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center gap-4 p-4 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-color)]"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                  <File className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[var(--text-primary)] truncate">{selectedFile.name}</p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <motion.button
                  onClick={() => setSelectedFile(null)}
                  className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-error-500 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Protobuf Schema */}
          <AnimatePresence>
            {needsProtobufSchema && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-color)]"
              >
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-primary-500" />
                  <Label htmlFor="file-protobuf-schema" className="text-sm font-semibold">
                    Protobuf Schema (.proto file content)
                  </Label>
                </div>
                <TextArea
                  id="file-protobuf-schema"
                  value={protobufSchema}
                  onChange={(e) => setProtobufSchema(e.target.value)}
                  placeholder="Paste your .proto schema definition here..."
                  className="min-h-[150px]"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Converted Content */}
          <AnimatePresence>
            {convertedContent && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="p-4 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-color)]"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-[var(--text-primary)]">Converted Content</h4>
                  <div className="flex gap-2">
                    <motion.button
                      onClick={handleCopy}
                      className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Copy"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-[var(--text-secondary)]" />
                      )}
                    </motion.button>
                    <motion.button
                      onClick={() => handleDownload(convertedContent)}
                      className="btn-primary-modern flex items-center gap-2 px-4"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </motion.button>
                  </div>
                </div>
                <TextArea
                  value={convertedContent}
                  readOnly
                  className="min-h-[200px]"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </FileItem>
    </Section>
  );
};

// Batch Processing Section
const BatchProcessingSection = () => {
  const [files, setFiles] = useState([]);
  const [fromFormat, setFromFormat] = useState('');
  const [toFormat, setToFormat] = useState('json');
  const [protobufSchema, setProtobufSchema] = useState('');
  const [results, setResults] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showHowToUse, setShowHowToUse] = useState(false);
  const batchFileInputRef = useRef(null);

  const handleFileSelect = (fileList) => {
    if (fileList && fileList.length > 0) {
      const fileArray = Array.from(fileList);
      setFiles(prev => [...prev, ...fileArray]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const fileList = e.dataTransfer.files;
    if (fileList && fileList.length > 0) {
      handleFileSelect(fileList);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDownload = (content, filename) => {
    if (!content) return;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'converted.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleConvert = async () => {
    if (files.length === 0) {
      alert('Please select files for batch processing');
      return;
    }

    setLoading(true);
    setResults([]);

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      if (fromFormat) formData.append('fromFormat', fromFormat);
      if (toFormat) formData.append('toFormat', toFormat);
      if (protobufSchema) formData.append('protobufSchema', protobufSchema);

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}/files/upload-batch`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Batch conversion failed');
      }

      setResults(data.results || []);
    } catch (err) {
      alert(err.message || 'Batch conversion failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAll = () => {
    results.forEach(result => {
      if (result.success && result.content) {
        setTimeout(() => {
          handleDownload(result.content, result.outputFilename);
        }, 100);
      }
    });
  };

  const handleClear = () => {
    setFiles([]);
    setResults([]);
    setFromFormat('');
    setToFormat('json');
    setProtobufSchema('');
  };

  return (
    <Section
      title="Batch Processing"
      icon={Package}
      description="Execute bulk transformations across mixed-format datasets"
      defaultExpanded={true}
      actions={
        <>
          <motion.button
            onClick={handleConvert}
            disabled={loading || files.length === 0}
            className="btn-primary-modern px-4"
            whileHover={{ scale: loading || files.length === 0 ? 1 : 1.02 }}
            whileTap={{ scale: loading || files.length === 0 ? 1 : 0.98 }}
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block mr-2"
                >
                  <RefreshCw className="w-4 h-4" />
                </motion.div>
                Processing...
              </>
            ) : (
              <>
                <Package className="w-4 h-4 inline mr-2" />
                Convert Batch
              </>
            )}
          </motion.button>
          <motion.button
            onClick={handleClear}
            className="btn-secondary-modern px-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Clear
          </motion.button>
        </>
      }
    >
      <FileItem title="Batch Processing" icon={Package}>
        <div className="space-y-4">
          {/* How To Use Button */}
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => setShowHowToUse(!showHowToUse)}
              className="flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              {showHowToUse ? 'Hide' : 'Show'} How To Use
            </button>
          </div>
          
          {/* How To Use Tooltip */}
          <AnimatePresence>
            {showHowToUse && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 mb-3">
                  <div className="space-y-3 text-xs text-[var(--text-secondary)]">
                    <div>
                      <strong className="text-[var(--text-primary)] block mb-2 text-sm">How To Use Batch Processing:</strong>
                      <ol className="list-decimal list-inside space-y-2 ml-2">
                        <li><strong>Select Source Format (Optional):</strong> Choose the source format from the dropdown, or leave it as "Auto-detect" to automatically detect the format of each file</li>
                        <li><strong>Select Target Format:</strong> Choose the format you want to convert all files to (JSON, YAML, XML, TOML, Properties, CSV, or Protobuf)</li>
                        <li><strong>Upload Multiple Files:</strong> You can upload files in two ways:
                          <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                            <li><strong>Drag & Drop:</strong> Drag multiple files from your computer and drop them in the upload area</li>
                            <li><strong>Click to Browse:</strong> Click the upload area to open a file browser and select multiple files (hold Ctrl/Cmd to select multiple)</li>
                            <li><strong>Mixed Formats:</strong> You can upload files of different formats - each will be converted individually</li>
                          </ul>
                        </li>
                        <li><strong>Review Selected Files:</strong> The "Selected Files" section shows all uploaded files with their names and sizes. You can:
                          <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                            <li>Remove individual files by clicking the X button</li>
                            <li>Clear all files using the "Clear All" button</li>
                          </ul>
                        </li>
                        <li><strong>Protobuf Schema (If Needed):</strong> If converting to/from Protobuf format, paste your .proto schema definition in the Protobuf Schema text area</li>
                        <li><strong>Process Batch:</strong> Click the "Process Batch" button to convert all files at once</li>
                        <li><strong>View Results:</strong> After processing, the "Conversion Results" section shows:
                          <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                            <li>Success status for each file</li>
                            <li>Original format → Converted format</li>
                            <li>Download button for each successfully converted file</li>
                            <li>Error messages for failed conversions</li>
                          </ul>
                        </li>
                        <li><strong>Download Files:</strong> You can:
                          <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                            <li>Download individual files using the "Download" button next to each result</li>
                            <li>Download all converted files at once using the "Download All" button</li>
                          </ul>
                        </li>
                        <li><strong>Clear:</strong> Click "Clear" to reset everything and start a new batch conversion</li>
                      </ol>
                    </div>
                    
                    <div className="pt-2 border-t border-purple-200 dark:border-purple-700">
                      <strong className="text-[var(--text-primary)] block mb-1">Supported Formats:</strong>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li><strong>JSON:</strong> JavaScript Object Notation - widely used for data exchange</li>
                        <li><strong>YAML:</strong> Human-readable data serialization format</li>
                        <li><strong>XML:</strong> Extensible Markup Language - structured data format</li>
                        <li><strong>TOML:</strong> Tom's Obvious Minimal Language - configuration file format</li>
                        <li><strong>Properties:</strong> Java Properties file format</li>
                        <li><strong>CSV:</strong> Comma-Separated Values - tabular data format</li>
                        <li><strong>Protobuf:</strong> Protocol Buffers - requires schema definition</li>
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-purple-200 dark:border-purple-700">
                      <strong className="text-[var(--text-primary)] block mb-1">Key Features:</strong>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li><strong>Mixed Format Support:</strong> Upload files of different formats - each will be detected and converted individually</li>
                        <li><strong>Auto-Detection:</strong> Leave source format as "Auto-detect" to automatically identify each file's format</li>
                        <li><strong>Bulk Processing:</strong> Convert multiple files simultaneously in one operation</li>
                        <li><strong>Individual Control:</strong> Remove specific files before processing or download files individually</li>
                        <li><strong>Bulk Download:</strong> Download all converted files at once with a single click</li>
                        <li><strong>Error Handling:</strong> Failed conversions are clearly marked with error messages</li>
                        <li><strong>Progress Tracking:</strong> See which files succeeded and which failed during batch processing</li>
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-purple-200 dark:border-purple-700">
                      <strong className="text-[var(--text-primary)] block mb-1">Use Cases:</strong>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li><strong>Migration Projects:</strong> Convert multiple configuration files from one format to another</li>
                        <li><strong>Data Processing:</strong> Batch convert data files for analysis or import into different systems</li>
                        <li><strong>API Preparation:</strong> Convert multiple files to a standardized format for API consumption</li>
                        <li><strong>Backup Conversion:</strong> Convert backup files to a different format for compatibility</li>
                        <li><strong>Multi-Format Projects:</strong> Standardize files from various sources into a single format</li>
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-purple-200 dark:border-purple-700">
                      <strong className="text-[var(--text-primary)] block mb-1">Tips:</strong>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Use "Auto-detect" for source format when working with mixed file types</li>
                        <li>You can upload files gradually - files are added to the list, not replaced</li>
                        <li>Remove unwanted files before processing to save time</li>
                        <li>For Protobuf conversions, ensure all files use the same schema</li>
                        <li>Large batches may take longer - be patient during processing</li>
                        <li>Review the results list before downloading to ensure all conversions succeeded</li>
                        <li>Failed files are clearly marked - you can fix and retry them individually</li>
                        <li>Use "Download All" for convenience, or download files individually for better control</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Format Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="batch-from-format" className="block mb-2 text-sm font-semibold">
                Source Format (Optional)
              </Label>
              <Select
                id="batch-from-format"
                value={fromFormat}
                onChange={(e) => setFromFormat(e.target.value)}
                options={FORMAT_OPTIONS}
                className="input-modern"
              />
              <p className="text-xs text-[var(--text-muted)] mt-1">Auto-detected per file if not specified</p>
            </div>
            <div>
              <Label htmlFor="batch-to-format" className="block mb-2 text-sm font-semibold">
                Target Format
              </Label>
              <Select
                id="batch-to-format"
                value={toFormat}
                onChange={(e) => setToFormat(e.target.value)}
                options={FORMAT_OPTIONS.filter(opt => opt.value !== '')}
                className="input-modern"
              />
            </div>
          </div>

          {/* File Drop Zone */}
          <div
            className={`
              relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
              transition-all duration-300
              ${dragOver 
                ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/20 scale-105' 
                : 'border-[var(--border-color)] bg-[var(--bg-tertiary)] hover:border-primary-400 hover:bg-primary-50/30 dark:hover:bg-primary-900/10'
              }
            `}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => batchFileInputRef.current?.click()}
          >
            <Upload className="w-10 h-10 mx-auto mb-3 text-primary-500" />
            <p className="text-base font-semibold text-[var(--text-primary)] mb-1">
              Drag & drop multiple files here
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
              or click to browse (supports mixed formats)
            </p>
            <input
              ref={batchFileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files)}
            />
          </div>

          {/* Selected Files */}
          {files.length > 0 && (
            <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-color)]">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-[var(--text-primary)]">
                  Selected Files ({files.length})
                </h4>
                <motion.button
                  onClick={() => setFiles([])}
                  className="text-xs text-[var(--text-secondary)] hover:text-error-500 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Clear All
                </motion.button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-[var(--bg-secondary)] rounded-lg">
                    <File className="w-4 h-4 text-[var(--text-secondary)]" />
                    <span className="text-sm text-[var(--text-primary)] flex-1 truncate">{file.name}</span>
                    <span className="text-xs text-[var(--text-secondary)]">
                      {(file.size / 1024).toFixed(2)} KB
                    </span>
                    <motion.button
                      onClick={() => setFiles(prev => prev.filter((_, i) => i !== index))}
                      className="p-1 rounded hover:bg-[var(--bg-tertiary)] transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                    </motion.button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {results.length > 0 && (
            <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-color)]">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-[var(--text-primary)]">
                  Conversion Results ({results.length} files)
                </h4>
                <motion.button
                  onClick={handleDownloadAll}
                  className="btn-primary-modern flex items-center gap-2 px-4 text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download className="w-4 h-4" />
                  Download All
                </motion.button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      result.success
                        ? 'bg-[var(--bg-secondary)] border-success-500/30'
                        : 'bg-error-50/50 dark:bg-error-900/20 border-error-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[var(--text-primary)] truncate">
                          {result.filename || result.originalFilename}
                        </p>
                        <p className="text-xs text-[var(--text-secondary)]">
                          {result.success
                            ? `${result.detectedFormat} → ${result.convertedFormat}`
                            : `Error: ${result.error}`
                          }
                        </p>
                      </div>
                      {result.success && (
                        <motion.button
                          onClick={() => handleDownload(result.content, result.outputFilename)}
                          className="btn-secondary-modern flex items-center gap-2 px-3 text-sm"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download
                        </motion.button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </FileItem>
    </Section>
  );
};

// Helper function to format JSON/YAML/XML for display
const formatContent = (content, format) => {
  try {
    if (format === 'json') {
      const parsed = JSON.parse(content);
      return JSON.stringify(parsed, null, 2);
    }
    // For YAML and XML, return as-is for now
    return content;
  } catch (e) {
    return content;
  }
};

// Helper function to create line-by-line diff with highlights
const createDiffView = (content1, content2, differences) => {
  const lines1 = content1.split('\n');
  const lines2 = content2.split('\n');
  const diffLines1 = [];
  const diffLines2 = [];
  
  const maxLines = Math.max(lines1.length, lines2.length);
  
  // Simple line-by-line comparison - highlight lines that differ
  for (let i = 0; i < maxLines; i++) {
    const line1 = lines1[i] || '';
    const line2 = lines2[i] || '';
    const isDiff = line1.trim() !== line2.trim();
    
    diffLines1.push({ 
      line: line1, 
      isDiff, 
      lineNum: i + 1,
      isEmpty: !line1 
    });
    
    diffLines2.push({ 
      line: line2, 
      isDiff, 
      lineNum: i + 1,
      isEmpty: !line2 
    });
  }
  
  // If API provided differences, enhance the highlighting by checking if lines contain those values
  if (differences && Array.isArray(differences) && differences.length > 0) {
    differences.forEach(diff => {
      const value1Str = diff.value1 !== null && diff.value1 !== undefined ? JSON.stringify(diff.value1) : '';
      const value2Str = diff.value2 !== null && diff.value2 !== undefined ? JSON.stringify(diff.value2) : '';
      
      // Mark lines containing the difference values
      diffLines1.forEach(item => {
        if (value1Str && item.line && (
          item.line.includes(value1Str) || 
          item.line.includes(String(diff.value1)) ||
          (diff.path && item.line.includes(diff.path))
        )) {
          item.isDiff = true;
        }
      });
      
      diffLines2.forEach(item => {
        if (value2Str && item.line && (
          item.line.includes(value2Str) || 
          item.line.includes(String(diff.value2)) ||
          (diff.path && item.line.includes(diff.path))
        )) {
          item.isDiff = true;
        }
      });
    });
  }
  
  return { left: diffLines1, right: diffLines2 };
};

// Compare & Diff Section
const CompareDiffSection = () => {
  const [file1, setFile1] = useState(null);
  const [file1Content, setFile1Content] = useState('');
  const [file2, setFile2] = useState(null);
  const [file2Content, setFile2Content] = useState('');
  const [format, setFormat] = useState('json');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [diffView, setDiffView] = useState(null);
  const [showSideBySide, setShowSideBySide] = useState(false);

  const handleFile1Select = async (file) => {
    if (file) {
      setFile1(file);
      const text = await file.text();
      setFile1Content(text);
      setResult(null);
      setDiffView(null);
      setShowSideBySide(false);
    }
  };

  const handleFile2Select = async (file) => {
    if (file) {
      setFile2(file);
      const text = await file.text();
      setFile2Content(text);
      setResult(null);
      setDiffView(null);
      setShowSideBySide(false);
    }
  };

  const handleCompare = async () => {
    if (!file1Content || !file2Content) {
      alert('Please provide content for both inputs (paste or upload files) to compare');
      return;
    }

    setLoading(true);
    try {
      const comparisonResult = await api.compareFiles(file1Content, file2Content, format);
      setResult(comparisonResult);
      
      // Format content for display
      const formatted1 = formatContent(file1Content, format);
      const formatted2 = formatContent(file2Content, format);
      
      // Create side-by-side diff view
      const diff = createDiffView(
        formatted1, 
        formatted2, 
        comparisonResult.differences || []
      );
      
      setDiffView(diff);
      setShowSideBySide(true);
    } catch (err) {
      alert(err.message || 'File comparison failed');
      setShowSideBySide(false);
      setDiffView(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFile1(null);
    setFile1Content('');
    setFile2(null);
    setFile2Content('');
    setResult(null);
    setDiffView(null);
    setShowSideBySide(false);
  };

  return (
    <Section
      title="Compare & Diff"
      icon={GitBranch}
      description="Identify structural and content-level differences across data assets"
      defaultExpanded={true}
      actions={
        <>
          <motion.button
            onClick={handleCompare}
            disabled={loading || !file1Content || !file2Content}
            className="btn-primary-modern px-4"
            whileHover={{ scale: loading || !file1Content || !file2Content ? 1 : 1.02 }}
            whileTap={{ scale: loading || !file1Content || !file2Content ? 1 : 0.98 }}
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block mr-2"
                >
                  <RefreshCw className="w-4 h-4" />
                </motion.div>
                Comparing...
              </>
            ) : (
              <>
                <GitBranch className="w-4 h-4 inline mr-2" />
                Compare
              </>
            )}
          </motion.button>
          <motion.button
            onClick={handleClear}
            className="btn-secondary-modern px-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Clear
          </motion.button>
        </>
      }
    >
      <FileItem title="Compare & Diff" icon={GitBranch}>
        <div className="space-y-4">
          {/* Format Selection */}
          <div>
            <Label htmlFor="diff-format" className="block mb-2 text-sm font-semibold">
              Format
            </Label>
            <Select
              id="diff-format"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              options={[
                { value: 'json', label: 'JSON' },
                { value: 'yaml', label: 'YAML' },
                { value: 'xml', label: 'XML' }
              ]}
              className="input-modern w-auto"
            />
          </div>

          {/* File Selection / Direct Paste */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* File 1 */}
            <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-color)]">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-[var(--text-primary)]">Input 1</h4>
                <label className="flex items-center gap-2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer transition-colors px-2 py-1 rounded hover:bg-[var(--bg-secondary)]">
                  <Upload className="w-3.5 h-3.5" />
                  Upload File
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFile1Select(e.target.files[0])}
                  />
                </label>
              </div>
              <div className="space-y-2">
                {file1 && (
                  <div className="flex items-center gap-2 p-2 bg-[var(--bg-secondary)] rounded-lg">
                    <File className="w-4 h-4 text-[var(--text-secondary)]" />
                    <span className="text-sm text-[var(--text-primary)] flex-1 truncate">{file1.name}</span>
                    <motion.button
                      onClick={() => {
                        setFile1(null);
                        setFile1Content('');
                        setResult(null);
                        setDiffView(null);
                        setShowSideBySide(false);
                      }}
                      className="p-1 rounded hover:bg-[var(--bg-tertiary)] transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Remove file"
                    >
                      <X className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                    </motion.button>
                  </div>
                )}
                <TextArea
                  value={file1Content}
                  onChange={(e) => {
                    setFile1Content(e.target.value);
                    // Clear results when content changes
                    if (result || showSideBySide) {
                      setResult(null);
                      setDiffView(null);
                      setShowSideBySide(false);
                    }
                  }}
                  placeholder={file1 ? `Content from ${file1.name}` : `Paste ${format.toUpperCase()} content here or upload a file...`}
                  className="min-h-[250px] text-xs font-mono"
                />
                {!file1Content && (
                  <p className="text-xs text-[var(--text-muted)] italic text-center py-2">
                    Paste content directly or click "Upload File" to browse
                  </p>
                )}
              </div>
            </div>

            {/* File 2 */}
            <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-color)]">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-[var(--text-primary)]">Input 2</h4>
                <label className="flex items-center gap-2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer transition-colors px-2 py-1 rounded hover:bg-[var(--bg-secondary)]">
                  <Upload className="w-3.5 h-3.5" />
                  Upload File
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFile2Select(e.target.files[0])}
                  />
                </label>
              </div>
              <div className="space-y-2">
                {file2 && (
                  <div className="flex items-center gap-2 p-2 bg-[var(--bg-secondary)] rounded-lg">
                    <File className="w-4 h-4 text-[var(--text-secondary)]" />
                    <span className="text-sm text-[var(--text-primary)] flex-1 truncate">{file2.name}</span>
                    <motion.button
                      onClick={() => {
                        setFile2(null);
                        setFile2Content('');
                        setResult(null);
                        setDiffView(null);
                        setShowSideBySide(false);
                      }}
                      className="p-1 rounded hover:bg-[var(--bg-tertiary)] transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Remove file"
                    >
                      <X className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                    </motion.button>
                  </div>
                )}
                <TextArea
                  value={file2Content}
                  onChange={(e) => {
                    setFile2Content(e.target.value);
                    // Clear results when content changes
                    if (result || showSideBySide) {
                      setResult(null);
                      setDiffView(null);
                      setShowSideBySide(false);
                    }
                  }}
                  placeholder={file2 ? `Content from ${file2.name}` : `Paste ${format.toUpperCase()} content here or upload a file...`}
                  className="min-h-[250px] text-xs font-mono"
                />
                {!file2Content && (
                  <p className="text-xs text-[var(--text-muted)] italic text-center py-2">
                    Paste content directly or click "Upload File" to browse
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Side-by-Side Comparison View */}
          {showSideBySide && diffView && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-color)]"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-[var(--text-primary)]">
                  Side-by-Side Comparison
                  {result && result.identical !== undefined && (
                    <span className={`ml-3 text-xs px-2 py-1 rounded ${
                      result.identical 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    }`}>
                      {result.identical ? 'IDENTICAL' : `${result.differenceCount || 0} DIFFERENCES`}
                    </span>
                  )}
                </h4>
              </div>
              
              {/* Side-by-Side Diff Container */}
              <div className="grid grid-cols-2 gap-2 border border-[var(--border-color)] rounded-lg overflow-hidden bg-[var(--bg-primary)]">
                {/* Left Side - File 1 */}
                <div className="flex flex-col border-r border-[var(--border-color)]">
                  <div className="bg-[var(--bg-secondary)] px-4 py-2 border-b border-[var(--border-color)]">
                    <div className="flex items-center gap-2">
                      <File className="w-4 h-4 text-[var(--text-secondary)]" />
                      <span className="text-sm font-semibold text-[var(--text-primary)]">
                        {file1 ? file1.name : 'Input 1'}
                      </span>
                    </div>
                  </div>
                  <div className="overflow-auto max-h-[600px] font-mono text-xs">
                    {diffView.left.map((item, idx) => (
                      <div
                        key={idx}
                        className={`px-3 py-1 flex gap-2 items-start ${
                          item.isDiff
                            ? 'bg-red-100 dark:bg-red-900/40 border-l-4 border-red-500'
                            : 'bg-transparent hover:bg-[var(--bg-tertiary)] border-l-4 border-transparent'
                        }`}
                      >
                        <span className={`select-none w-12 text-right flex-shrink-0 font-mono text-xs ${
                          item.isDiff ? 'text-red-700 dark:text-red-400 font-bold' : 'text-[var(--text-muted)]'
                        }`}>
                          {item.lineNum}
                        </span>
                        <span className={`flex-1 whitespace-pre font-mono ${
                          item.isDiff ? 'text-red-800 dark:text-red-300 font-semibold' : 'text-[var(--text-primary)]'
                        }`}>
                          {item.line || '\u00A0'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Side - File 2 */}
                <div className="flex flex-col">
                  <div className="bg-[var(--bg-secondary)] px-4 py-2 border-b border-[var(--border-color)]">
                    <div className="flex items-center gap-2">
                      <File className="w-4 h-4 text-[var(--text-secondary)]" />
                      <span className="text-sm font-semibold text-[var(--text-primary)]">
                        {file2 ? file2.name : 'Input 2'}
                      </span>
                    </div>
                  </div>
                  <div className="overflow-auto max-h-[600px] font-mono text-xs">
                    {diffView.right.map((item, idx) => (
                      <div
                        key={idx}
                        className={`px-3 py-1 flex gap-2 items-start ${
                          item.isDiff
                            ? 'bg-red-100 dark:bg-red-900/40 border-l-4 border-red-500'
                            : 'bg-transparent hover:bg-[var(--bg-tertiary)] border-l-4 border-transparent'
                        }`}
                      >
                        <span className={`select-none w-12 text-right flex-shrink-0 font-mono text-xs ${
                          item.isDiff ? 'text-red-700 dark:text-red-400 font-bold' : 'text-[var(--text-muted)]'
                        }`}>
                          {item.lineNum}
                        </span>
                        <span className={`flex-1 whitespace-pre font-mono ${
                          item.isDiff ? 'text-red-800 dark:text-red-300 font-semibold' : 'text-[var(--text-primary)]'
                        }`}>
                          {item.line || '\u00A0'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Difference Summary */}
              {result && result.differences && result.differences.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-xs font-semibold text-[var(--text-primary)] mb-2">
                    Differences Found ({result.differences.length}):
                  </p>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {result.differences.slice(0, 10).map((diff, idx) => (
                      <div key={idx} className="text-xs text-[var(--text-secondary)]">
                        <span className="font-semibold">{diff.path || 'Root'}:</span> {diff.description || diff.type}
                      </div>
                    ))}
                    {result.differences.length > 10 && (
                      <p className="text-xs text-[var(--text-muted)] italic">
                        ... and {result.differences.length - 10} more differences
                      </p>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}

        </div>
      </FileItem>
    </Section>
  );
};

export default Files;
