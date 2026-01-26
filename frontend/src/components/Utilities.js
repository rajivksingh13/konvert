import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, Copy, Trash2, Check, Hash, Key, Shuffle, 
  FileCheck, Archive, RefreshCw, Wrench, HelpCircle, Shield,
  Upload, Clipboard
} from 'lucide-react';
import { TextArea, Select } from './UI/Input';
import api from '../services/api';

// Section Component (similar to Transform, Beautify, Encode/Decode, and File Tools tabs)
const Section = ({ title, icon: Icon, description, children, defaultExpanded = false, actions }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-modern overflow-hidden mb-4"
    >
      <div className="w-full flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-5">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-3 flex-1 min-w-0 hover:bg-[var(--bg-secondary)] transition-colors rounded-lg p-2 -m-2 text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg flex-shrink-0">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
            {description && <p className="text-xs text-[var(--text-secondary)] mt-0.5">{description}</p>}
          </div>
        </button>
        <div className="flex items-center gap-2 flex-wrap justify-end flex-shrink-0">
          {actions && (
            <div className="flex items-center gap-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
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

// Utility Item Component
const UtilityItem = ({ title, icon: Icon, children }) => (
  <div className="p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] mb-4">
    <div className="flex items-center gap-2 mb-4">
      {Icon && <Icon className="w-5 h-5 text-primary-500" />}
      <h4 className="font-semibold text-[var(--text-primary)]">{title}</h4>
    </div>
    {children}
  </div>
);

const Utilities = () => {
  const [activeSidebarItem, setActiveSidebarItem] = useState('validation-hashing');

  const sidebarItems = [
    {
      id: 'validation-hashing',
      title: 'Validation & Hashing',
      icon: FileCheck,
      description: 'Validate data formats and generate hash values'
    },
    {
      id: 'id-compression',
      title: 'ID Generation & Compression',
      icon: Key,
      description: 'Generate UUIDs and compress/decompress data'
    },
    {
      id: 'masking-redaction',
      title: 'Masking & Redaction',
      icon: Shield,
      description: 'Mask sensitive attributes with enterprise-grade rules'
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
        <div className="card-modern p-3 space-y-2 sticky top-20">
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
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 space-y-6 w-full max-w-none">
        <AnimatePresence mode="wait">
          {activeSidebarItem === 'validation-hashing' && (
            <motion.div
              key="validation-hashing"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-4">
                <ValidationSection />
                <HashSection />
              </div>
            </motion.div>
          )}

          {activeSidebarItem === 'id-compression' && (
            <motion.div
              key="id-compression"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-4">
                <UUIDSection />
                <CompressionSection />
              </div>
            </motion.div>
          )}

          {activeSidebarItem === 'masking-redaction' && (
            <motion.div
              key="masking-redaction"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-4">
                <MaskingSection />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Validation Section
const ValidationSection = () => {
  const [input, setInput] = useState('');
  const [format, setFormat] = useState('json');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showHowToUse, setShowHowToUse] = useState(false);
  
  // Sample data for visualization (format-aware)
  const sampleInputJSON = `{
  "name": "John",
  "age": 30,
  "city": "New York",
  "active": true
}`;
  const sampleOutputJSON = '✓ Valid JSON';
  
  const sampleInputYAML = `name: John
age: 30
city: New York
active: true`;
  const sampleOutputYAML = '✓ Valid YAML';
  
  const sampleInputXML = `<?xml version="1.0"?>
<root>
  <user>
    <name>John</name>
    <age>30</age>
  </user>
</root>`;
  const sampleOutputXML = '✓ Valid XML';
  
  const sampleInputCSV = `Name,Age,City
John,30,New York
Jane,25,Los Angeles`;
  const sampleOutputCSV = '✓ Valid CSV';
  
  const getSampleInput = () => {
    switch (format) {
      case 'json': return sampleInputJSON;
      case 'yaml': return sampleInputYAML;
      case 'xml': return sampleInputXML;
      case 'csv': return sampleInputCSV;
      default: return sampleInputJSON;
    }
  };

  const getSampleOutput = () => {
    return `✓ Valid ${format.toUpperCase()}`;
  };

  const handleValidate = async () => {
    const validateInput = !hasInteracted && !input ? getSampleInput() : input;
    if (!validateInput.trim()) return;
    if (!hasInteracted) {
      setHasInteracted(true);
      setInput(validateInput);
    }
    setLoading(true);
    try {
      const result = await api.validateSchema(validateInput, format);
      if (result.success) {
        setOutput('✓ Valid ' + format.toUpperCase());
      } else {
        setOutput('✗ Invalid: ' + (result.error || 'Validation failed'));
      }
    } catch (err) {
      setOutput('✗ Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInputFocus = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      setInput('');
      setOutput('');
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setHasInteracted(false);
  };

  const displayInput = !hasInteracted && !input ? getSampleInput() : input;
  const displayOutput = !hasInteracted && !output ? getSampleOutput() : output;
  const isSample = !hasInteracted && (!input || !output);

  return (
    <Section
      title="Validation"
      icon={FileCheck}
      description="Validate JSON, YAML, XML, CSV, TOML, TOON, and Properties formats"
      defaultExpanded={true}
      actions={
        <>
          <motion.button
            onClick={handleValidate}
            disabled={loading}
            className="btn-primary-modern px-4"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
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
                Validating...
              </>
            ) : (
              'Validate'
            )}
          </motion.button>
          <motion.button
            onClick={handleCopy}
            className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Copy Output"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 text-[var(--text-secondary)]" />
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
      <UtilityItem title="Schema Validation" icon={FileCheck}>
        <div className="space-y-3">
          {/* Help Buttons */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowHowToUse(!showHowToUse)}
              className="flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              {showHowToUse ? 'Hide' : 'Show'} How To Use
            </button>
            <button
              type="button"
              onClick={() => setShowHelp(!showHelp)}
              className="flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              {showHelp ? 'Hide' : 'Show'} Examples
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
                      <strong className="text-[var(--text-primary)] block mb-2 text-sm">How To Use Schema Validation:</strong>
                      <ol className="list-decimal list-inside space-y-2 ml-2">
                        <li><strong>Select Format:</strong> Choose the format you want to validate from the dropdown (JSON, YAML, XML, CSV, TOML, TOON, or Properties)</li>
                        <li><strong>Enter Data:</strong> Paste or type the data you want to validate in the input area</li>
                        <li><strong>Click Validate:</strong> Click the "Validate" button to check if your data is valid</li>
                        <li><strong>View Results:</strong> The output area will show:
                          <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                            <li>✓ Valid [FORMAT] - if the data is correctly formatted</li>
                            <li>✗ Invalid: [error message] - if there are syntax errors</li>
                          </ul>
                        </li>
                        <li><strong>Copy Results:</strong> Use the copy button to copy the validation result</li>
                        <li><strong>Clear:</strong> Click "Clear" to reset and start a new validation</li>
                      </ol>
                    </div>
                    
                    <div className="pt-2 border-t border-purple-200 dark:border-purple-700">
                      <strong className="text-[var(--text-primary)] block mb-1">Supported Formats:</strong>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li><strong>JSON:</strong> Validates JSON syntax, brackets, quotes, and structure</li>
                        <li><strong>YAML:</strong> Validates YAML indentation, syntax, and structure</li>
                        <li><strong>XML:</strong> Validates XML tags, attributes, and well-formed structure</li>
                        <li><strong>CSV:</strong> Validates CSV format, delimiters, and row consistency</li>
                        <li><strong>TOML:</strong> Validates TOML syntax and structure</li>
                        <li><strong>TOON:</strong> Validates TOON format syntax</li>
                        <li><strong>Properties:</strong> Validates Java Properties file format</li>
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-purple-200 dark:border-purple-700">
                      <strong className="text-[var(--text-primary)] block mb-1">Tips:</strong>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Make sure to select the correct format before validating</li>
                        <li>For large files, validation may take a moment</li>
                        <li>Error messages will indicate the specific issue and location when possible</li>
                        <li>Use this tool to verify data before processing or storing</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Help Tooltip */}
          <AnimatePresence>
            {showHelp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-lime-50 dark:bg-lime-900/20 rounded-lg border border-lime-200 dark:border-lime-800 mb-3">
                  <div className="space-y-3 text-xs text-[var(--text-secondary)]">
                    <div>
                      <strong className="text-[var(--text-primary)] block mb-1">How It Works:</strong>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Validates data against format-specific syntax rules</li>
                        <li>Checks for correct structure, syntax, and formatting</li>
                        <li>Returns success message for valid data or detailed error for invalid data</li>
                        <li>Supports multiple formats: JSON, YAML, XML, CSV, TOML, TOON, Properties</li>
                      </ul>
                    </div>
                    
                    <div className="pt-2 border-t border-lime-200 dark:border-lime-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 1: Valid JSON</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input (Valid JSON):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "name": "John",
  "age": 30,
  "city": "New York"
}`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto">
                            ✓ Valid JSON
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-lime-200 dark:border-lime-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 2: Invalid JSON</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input (Invalid JSON - missing quote):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "name": "John",
  age: 30
}`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto">
                            ✗ Invalid: Expected double-quoted property name in JSON
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-lime-200 dark:border-lime-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 3: Valid YAML</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input (Valid YAML):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`name: John
age: 30
city: New York
active: true`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto">
                            ✓ Valid YAML
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-lime-200 dark:border-lime-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 4: Valid XML</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input (Valid XML):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`<?xml version="1.0"?>
<root>
  <user>
    <name>John</name>
    <age>30</age>
  </user>
</root>`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto">
                            ✓ Valid XML
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 mt-3 p-2 bg-lime-100 dark:bg-lime-800/30 rounded">
                      <p className="text-[var(--text-primary)] font-semibold text-xs mb-1">💡 Tips:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Select the correct format (JSON, YAML, XML, CSV, TOML, TOON, Properties) for accurate validation</li>
                        <li>Valid data returns a success message with format type</li>
                        <li>Invalid data returns detailed error messages explaining what's wrong</li>
                        <li>Useful for testing API responses, configuration files, and data imports</li>
                        <li>Common use cases: API testing, data quality checks, configuration validation</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            options={[
              { value: 'json', label: 'JSON' },
              { value: 'yaml', label: 'YAML' },
              { value: 'xml', label: 'XML' },
              { value: 'csv', label: 'CSV' },
              { value: 'toml', label: 'TOML' },
              { value: 'toon', label: 'TOON' },
              { value: 'properties', label: 'Properties' }
            ]}
            className="input-modern w-auto"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <TextArea
              value={displayInput}
              onChange={(e) => {
                if (!hasInteracted) {
                  setHasInteracted(true);
                  setInput('');
                  setOutput('');
                }
                setInput(e.target.value);
              }}
              onFocus={handleInputFocus}
              onMouseDown={handleInputFocus}
              placeholder={`Enter ${format.toUpperCase()} data to validate...`}
              className={`min-h-[150px] ${isSample ? 'opacity-60 italic' : ''}`}
              readOnly={isSample}
              style={{ cursor: isSample ? 'pointer' : 'text' }}
            />
            <TextArea
              value={displayOutput}
              readOnly
              placeholder={`Validation result will appear here...`}
              className={`min-h-[150px] ${isSample ? 'opacity-60 italic' : ''}`}
            />
          </div>
          {isSample && (
            <p className="text-xs text-[var(--text-muted)] italic text-center">
              Click in the input area to start editing
            </p>
          )}
        </div>
      </UtilityItem>
    </Section>
  );
};

// Hash Section
const HashSection = () => {
  const [input, setInput] = useState('');
  const [algorithm, setAlgorithm] = useState('SHA-256');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showHowToUse, setShowHowToUse] = useState(false);
  
  // Sample data for visualization (algorithm-aware)
  const sampleInput = 'Hello, World!';
  const sampleOutputMD5 = '65a8e27d8879283831b664bd8b7f0ad4';
  const sampleOutputSHA1 = '0a0a9f2a6772942557ab5355d76af442f8f65e01';
  const sampleOutputSHA256 = 'dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f';
  const sampleOutputSHA512 = '374d794a95cdcfd8b35993185fef9ba368f160d8daf432d08ba9f1ed1e5abe6cc69291e0fa2fe0006a52570ef18c19def4e617c33ce52ef0a6e5fbe318cb0387';
  
  const getSampleOutput = () => {
    switch (algorithm) {
      case 'MD5': return sampleOutputMD5;
      case 'SHA-1': return sampleOutputSHA1;
      case 'SHA-256': return sampleOutputSHA256;
      case 'SHA-512': return sampleOutputSHA512;
      default: return sampleOutputSHA256;
    }
  };

  const handleGenerate = async () => {
    const generateInput = !hasInteracted && !input ? sampleInput : input;
    if (!generateInput.trim()) return;
    if (!hasInteracted) {
      setHasInteracted(true);
      setInput(generateInput);
    }
    setLoading(true);
    try {
      const result = await api.generateHash(generateInput, algorithm);
      if (result.success) {
        setOutput(result.output || result.hash || 'Hash generated successfully');
      } else {
        setOutput('Error: ' + result.error);
      }
    } catch (err) {
      setOutput('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInputFocus = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      setInput('');
      setOutput('');
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setHasInteracted(false);
  };

  const displayInput = !hasInteracted && !input ? sampleInput : input;
  const displayOutput = !hasInteracted && !output ? getSampleOutput() : output;
  const isSample = !hasInteracted && (!input || !output);

  return (
    <Section
      title="Hashing"
      icon={Hash}
      description="Generate MD5, SHA-1, SHA-256, and SHA-512 hashes"
      actions={
        <>
          <motion.button
            onClick={handleGenerate}
            disabled={loading}
            className="btn-primary-modern px-4"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
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
                Generating...
              </>
            ) : (
              'Generate Artifact'
            )}
          </motion.button>
          <motion.button
            onClick={handleCopy}
            className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Copy Output"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 text-[var(--text-secondary)]" />
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
      <UtilityItem title="Hash Generator" icon={Hash}>
        <div className="space-y-3">
          {/* Help Buttons */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowHowToUse(!showHowToUse)}
              className="flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              {showHowToUse ? 'Hide' : 'Show'} How To Use
            </button>
            <button
              type="button"
              onClick={() => setShowHelp(!showHelp)}
              className="flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              {showHelp ? 'Hide' : 'Show'} Examples
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
                      <strong className="text-[var(--text-primary)] block mb-2 text-sm">How To Use Hash Generator:</strong>
                      <ol className="list-decimal list-inside space-y-2 ml-2">
                        <li><strong>Select Algorithm:</strong> Choose the hash algorithm from the dropdown (MD5, SHA-1, SHA-256, or SHA-512)</li>
                        <li><strong>Enter Input:</strong> Type or paste the text/data you want to hash in the input area</li>
                        <li><strong>Generate Hash:</strong> Click the "Generate" button to create the hash</li>
                        <li><strong>View Hash:</strong> The generated hash will appear in the output area</li>
                        <li><strong>Copy Hash:</strong> Use the copy button to copy the hash to your clipboard</li>
                        <li><strong>Clear:</strong> Click "Clear" to reset and generate a new hash</li>
                      </ol>
                    </div>
                    
                    <div className="pt-2 border-t border-purple-200 dark:border-purple-700">
                      <strong className="text-[var(--text-primary)] block mb-1">Hash Algorithms:</strong>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li><strong>MD5:</strong> 128-bit hash, fast but less secure (not recommended for security)</li>
                        <li><strong>SHA-1:</strong> 160-bit hash, faster but deprecated for security purposes</li>
                        <li><strong>SHA-256:</strong> 256-bit hash, secure and widely used (recommended)</li>
                        <li><strong>SHA-512:</strong> 512-bit hash, most secure but longer output</li>
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-purple-200 dark:border-purple-700">
                      <strong className="text-[var(--text-primary)] block mb-1">Use Cases:</strong>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li><strong>Data Integrity:</strong> Verify files haven't been tampered with</li>
                        <li><strong>Password Storage:</strong> Hash passwords before storing (use SHA-256 or SHA-512)</li>
                        <li><strong>Digital Signatures:</strong> Create unique identifiers for data</li>
                        <li><strong>Checksums:</strong> Verify file downloads and data transfers</li>
                        <li><strong>Blockchain:</strong> Generate hashes for blockchain operations</li>
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-purple-200 dark:border-purple-700">
                      <strong className="text-[var(--text-primary)] block mb-1">Tips:</strong>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>SHA-256 is recommended for most security applications</li>
                        <li>MD5 and SHA-1 should not be used for security-sensitive applications</li>
                        <li>The same input will always produce the same hash</li>
                        <li>Even a small change in input produces a completely different hash</li>
                        <li>Hashes are one-way functions - you cannot reverse a hash to get the original data</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Help Tooltip */}
          <AnimatePresence>
            {showHelp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-zinc-50 dark:bg-zinc-900/20 rounded-lg border border-zinc-200 dark:border-zinc-800 mb-3">
                  <div className="space-y-3 text-xs text-[var(--text-secondary)]">
                    <div>
                      <strong className="text-[var(--text-primary)] block mb-1">How It Works:</strong>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Generates cryptographic hash values from input text</li>
                        <li>One-way function - cannot be reversed to original text</li>
                        <li>Same input always produces the same hash</li>
                        <li>Different algorithms produce different hash lengths and security levels</li>
                      </ul>
                    </div>
                    
                    <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 1: SHA-256 Hash</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto">
                            Hello, World!
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output (SHA-256):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto">
                            dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 2: MD5 Hash</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto">
                            password123
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output (MD5):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto">
                            482c811da5d5b4bc6d497ffa98491e38
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 3: SHA-512 Hash</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto">
                            secret key
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output (SHA-512 - 128 hex chars):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto">
                            374d794a95cdcfd8b35993185fef9ba368f160d8daf432d08ba9f1ed1e5abe6cc69291e0fa2fe0006a52570ef18c19def4e617c33ce52ef0a6e5fbe318cb0387
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 mt-3 p-2 bg-zinc-100 dark:bg-zinc-800/30 rounded">
                      <p className="text-[var(--text-primary)] font-semibold text-xs mb-1">💡 Hash Algorithms:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li><strong>MD5</strong>: 128-bit hash (32 hex chars) - Fast, but cryptographically broken, use for checksums only</li>
                        <li><strong>SHA-1</strong>: 160-bit hash (40 hex chars) - Deprecated for security, use SHA-256 instead</li>
                        <li><strong>SHA-256</strong>: 256-bit hash (64 hex chars) - Recommended for most use cases, secure</li>
                        <li><strong>SHA-512</strong>: 512-bit hash (128 hex chars) - Highest security, longer hash output</li>
                        <li>Use SHA-256 or SHA-512 for password hashing and data integrity checks</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            options={[
              { value: 'MD5', label: 'MD5' },
              { value: 'SHA-1', label: 'SHA-1' },
              { value: 'SHA-256', label: 'SHA-256' },
              { value: 'SHA-512', label: 'SHA-512' }
            ]}
            className="input-modern w-auto"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <TextArea
              value={displayInput}
              onChange={(e) => {
                if (!hasInteracted) {
                  setHasInteracted(true);
                  setInput('');
                  setOutput('');
                }
                setInput(e.target.value);
              }}
              onFocus={handleInputFocus}
              onMouseDown={handleInputFocus}
              placeholder="Enter text to hash..."
              className={`min-h-[150px] ${isSample ? 'opacity-60 italic' : ''}`}
              readOnly={isSample}
              style={{ cursor: isSample ? 'pointer' : 'text' }}
            />
            <TextArea
              value={displayOutput}
              readOnly
              placeholder={`${algorithm} hash will appear here...`}
              className={`min-h-[150px] ${isSample ? 'opacity-60 italic' : ''}`}
            />
          </div>
          {isSample && (
            <p className="text-xs text-[var(--text-muted)] italic text-center">
              Click in the input area to start editing
            </p>
          )}
        </div>
      </UtilityItem>
    </Section>
  );
};

// UUID Section
const UUIDSection = () => {
  const [version, setVersion] = useState('v4');
  const [count, setCount] = useState(1);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (count < 1 || count > 100) {
      setOutput('Error: Count must be between 1 and 100');
      return;
    }
    setLoading(true);
    try {
      const result = await api.generateUUID(version, count);
      if (result.success) {
        setOutput(Array.isArray(result.output) ? result.output.join('\n') : result.output);
      } else {
        setOutput('Error: ' + result.error);
      }
    } catch (err) {
      setOutput('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Section
      title="ID Generation"
      icon={Key}
      description="Generate UUID v4 (random), UUID v1 (time-based), and bulk UUIDs (1-100)"
      defaultExpanded={true}
      actions={
        <>
          <motion.button
            onClick={handleGenerate}
            disabled={loading}
            className="btn-primary-modern px-4"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
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
                Generating...
              </>
            ) : (
              'Generate Artifact'
            )}
          </motion.button>
          <motion.button
            onClick={handleCopy}
            className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Copy Output"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 text-[var(--text-secondary)]" />
            )}
          </motion.button>
          <motion.button
            onClick={() => setOutput('')}
            className="btn-secondary-modern px-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Clear
          </motion.button>
        </>
      }
    >
      <UtilityItem title="UUID Generator" icon={Shuffle}>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Select
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              options={[
                { value: 'v4', label: 'UUID v4 (Random)' },
                { value: 'v1', label: 'UUID v1 (Time-based)' }
              ]}
              className="input-modern flex-1"
            />
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 1)}
              min="1"
              max="100"
              className="input-modern w-24"
              placeholder="Count"
            />
          </div>
          <TextArea
            value={output}
            readOnly
            placeholder="Generated UUIDs will appear here..."
            className="min-h-[150px]"
          />
        </div>
      </UtilityItem>
    </Section>
  );
};

// Compression Section
const CompressionSection = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [operation, setOperation] = useState('compress');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Sample data for visualization (operation-aware)
  // For compress: sample input is text data, output is Base64-encoded GZIP
  const sampleInputCompress = `{
  "name": "John Doe",
  "age": 30,
  "email": "john.doe@example.com",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zipCode": "10001"
  },
  "hobbies": ["reading", "coding", "traveling"]
}`;
  // This is a valid Base64-encoded GZIP compressed version of the sample input above
  const sampleOutputCompress = 'H4sIAAAAAAAAA6tWSs5PSVWyMlBSSk7NLFGyqlZKzs8tKEotLs5Mz1OyMjIwMDA1MTYxMzI0MjJQSs5PSSzJzE8tsQQqLsjMSwcqMjGFSFVSAgDpRQooJwAAAA==';
  
  // For decompress: sample input is Base64-encoded GZIP, output is decompressed text
  const sampleInputDecompress = 'H4sIAAAAAAAAA6tWSs5PSVWyMlBSSk7NLFGyqlZKzs8tKEotLs5Mz1OyMjIwMDA1MTYxMzI0MjJQSs5PSSzJzE8tsQQqLsjMSwcqMjGFSFVSAgDpRQooJwAAAA==';
  const sampleOutputDecompress = sampleInputCompress;

  const getSampleInput = () => {
    return operation === 'compress' ? sampleInputCompress : sampleInputDecompress;
  };

  const getSampleOutput = () => {
    return operation === 'compress' ? sampleOutputCompress : sampleOutputDecompress;
  };

  const handleGzip = async () => {
    const processInput = !hasInteracted && !input ? getSampleInput() : input;
    if (!processInput.trim()) return;
    if (!hasInteracted) {
      setHasInteracted(true);
      setInput(processInput);
    }
    setLoading(true);
    try {
      if (operation === 'compress') {
        const result = await api.compressGzip(processInput);
        if (result.success) {
          // Display the base64 encoded compressed data
          const compressedOutput = result.base64Encoded || result.compressed || result.output;
          setOutput(compressedOutput);
        } else {
          setOutput('Error: ' + result.error);
        }
      } else {
        // Decompress operation
        const result = await api.decompressGzip(processInput);
        if (result.success) {
          // Display the decompressed text
          const decompressedOutput = result.output || result.decompressed;
          setOutput(decompressedOutput);
        } else {
          setOutput('Error: ' + result.error);
        }
      }
    } catch (err) {
      setOutput('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInputFocus = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      setInput('');
      setOutput('');
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setHasInteracted(false);
  };

  const handleOperationChange = (e) => {
    setOperation(e.target.value);
    // Reset interaction state when operation changes to show new samples
    setHasInteracted(false);
    setInput('');
    setOutput('');
  };

  const displayInput = !hasInteracted && !input ? getSampleInput() : input;
  const displayOutput = !hasInteracted && !output ? getSampleOutput() : output;
  const isSample = !hasInteracted && (!input || !output);

  return (
    <Section
      title="Compression"
      icon={Archive}
      description="Gzip compression and decompression"
      actions={
        <>
          <motion.button
            onClick={handleGzip}
            disabled={loading}
            className="btn-primary-modern px-4"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
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
              operation === 'compress' ? 'Compress' : 'Decompress'
            )}
          </motion.button>
          <motion.button
            onClick={handleCopy}
            className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Copy Output"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 text-[var(--text-secondary)]" />
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
      <UtilityItem title="Gzip Compression / Decompression" icon={Archive}>
        <div className="space-y-3">
          {/* Help Button */}
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => setShowHelp(!showHelp)}
              className="flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              {showHelp ? 'Hide' : 'Show'} Examples
            </button>
          </div>
          
          {/* Help Tooltip */}
          <AnimatePresence>
            {showHelp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 mb-3">
                  <div className="space-y-3 text-xs text-[var(--text-secondary)]">
                    <div>
                      <strong className="text-[var(--text-primary)] block mb-1">How It Works:</strong>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li><strong>Compress:</strong> Converts text/data into GZIP compressed format and encodes it as Base64</li>
                        <li><strong>Decompress:</strong> Takes Base64-encoded GZIP data and restores it to original text</li>
                        <li>GZIP compression reduces file size by 50-90% depending on content</li>
                        <li>Compressed data is Base64-encoded for safe text transmission</li>
                        <li>Best for: JSON files, logs, configuration files, API payloads</li>
                      </ul>
                    </div>
                    
                    <div className="pt-2 border-t border-blue-200 dark:border-blue-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 1: Compressing JSON Data</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input (JSON to compress):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "name": "John Doe",
  "age": 30,
  "email": "john.doe@example.com"
}`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output (Base64-encoded GZIP):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto break-all">
                            H4sIAAAAAAAAA6tWSs5PSVWyMlBSSk7NLFGyqlZKzs8tKEotLs5Mz1OyMjIwMDA1MTYxMzI0MjJQSs5PSSzJzE8tsQQqLsjMSwcqMjGFSFVSAgDpRQooJwAAAA==
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-blue-200 dark:border-blue-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 2: Decompressing GZIP Data</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input (Base64-encoded GZIP to decompress):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto break-all">
                            H4sIAAAAAAAAA6tWSs5PSVWyMlBSSk7NLFGyqlZKzs8tKEotLs5Mz1OyMjIwMDA1MTYxMzI0MjJQSs5PSSzJzE8tsQQqLsjMSwcqMjGFSFVSAgDpRQooJwAAAA==
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output (Decompressed JSON):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "name": "John Doe",
  "age": 30,
  "email": "john.doe@example.com"
}`}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-blue-200 dark:border-blue-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 3: Compressing Text/Log Files</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input (Log file content):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`[2024-01-15 10:30:00] INFO: Application started
[2024-01-15 10:30:05] DEBUG: Loading configuration
[2024-01-15 10:30:10] INFO: Database connection established
[2024-01-15 10:30:15] WARN: Low memory warning`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output (Compressed):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto break-all">
                            Base64-encoded GZIP compressed data appears here
                          </code>
                          <p className="text-[var(--text-muted)] mt-1 text-xs">Compression typically reduces log file size by 70-85%</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-blue-200 dark:border-blue-700">
                      <strong className="text-[var(--text-primary)] block mb-1">Use Cases:</strong>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li><strong>API Optimization:</strong> Compress large API responses to reduce bandwidth</li>
                        <li><strong>Storage Efficiency:</strong> Store compressed configuration files and logs</li>
                        <li><strong>Network Transfer:</strong> Transfer large text files faster with compression</li>
                        <li><strong>Backup & Archive:</strong> Compress data before archival to save storage space</li>
                        <li><strong>Development:</strong> Test compression/decompression workflows for applications</li>
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-blue-200 dark:border-blue-700">
                      <strong className="text-[var(--text-primary)] block mb-1">Tips:</strong>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Text data compresses better than already-compressed binary data</li>
                        <li>Repetitive patterns (like JSON structures) compress very well</li>
                        <li>Always decompress with the same format you compressed (GZIP → GZIP)</li>
                        <li>Base64 encoding increases size by ~33%, but enables text transmission</li>
                        <li>Check compression ratio to evaluate if compression is beneficial</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Select
            value={operation}
            onChange={handleOperationChange}
            options={[
              { value: 'compress', label: 'Compress' },
              { value: 'decompress', label: 'Decompress' }
            ]}
            className="input-modern w-auto"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <TextArea
              value={displayInput}
              onChange={(e) => {
                if (!hasInteracted) {
                  setHasInteracted(true);
                  setInput(e.target.value);
                } else {
                  setInput(e.target.value);
                }
              }}
              onFocus={handleInputFocus}
              onMouseDown={handleInputFocus}
              placeholder={operation === 'compress' ? "Enter data to compress..." : "Enter Base64-encoded GZIP data to decompress..."}
              className={`min-h-[150px] ${isSample ? 'opacity-60 italic' : ''}`}
              readOnly={isSample}
              style={{ cursor: isSample ? 'pointer' : 'text' }}
            />
            <TextArea
              value={displayOutput}
              readOnly
              placeholder={operation === 'compress' ? "Compressed Base64-encoded data will appear here..." : "Decompressed text will appear here..."}
              className={`min-h-[150px] ${isSample ? 'opacity-60 italic' : ''}`}
            />
          </div>
          {isSample && (
            <p className="text-xs text-[var(--text-muted)] italic text-center">
              Sample data shown for demonstration. Click in the input area to start entering your own data.
            </p>
          )}
        </div>
      </UtilityItem>
    </Section>
  );
};

const MaskingSection = () => {
  const [file, setFile] = useState(null);
  const [pastedContent, setPastedContent] = useState('');
  const [format, setFormat] = useState('');
  const [inputMode, setInputMode] = useState('upload');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([
    'email',
    'phone',
    'ssn',
    'pan',
    'aadhaar',
    'gstin',
    'vat',
    'card',
    'account',
    'case_number',
    'legal_id',
    'license_id',
    'secret',
    'address'
  ]);
  const [manualTypes, setManualTypes] = useState([
    'email',
    'phone',
    'ssn',
    'pan',
    'aadhaar',
    'gstin',
    'vat',
    'card',
    'account',
    'case_number',
    'legal_id',
    'license_id',
    'secret',
    'address'
  ]);
  const [fieldAware, setFieldAware] = useState(true);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [showExample, setShowExample] = useState(false);

  const categoryGroups = [
    {
      id: 'legal_contracts',
      label: 'Legal & Contracts',
      types: ['legal_id', 'case_number', 'address', 'email', 'phone']
    },
    {
      id: 'tax_payroll',
      label: 'Tax & Payroll',
      types: ['gstin', 'vat', 'ein', 'tin', 'ssn', 'pan', 'aadhaar', 'account']
    },
    {
      id: 'financial',
      label: 'Financial (Non-Tax)',
      types: ['account', 'card', 'invoice_id']
    },
    {
      id: 'regulatory',
      label: 'Regulatory & Government',
      types: ['license_id', 'legal_id', 'case_number', 'address', 'ssn', 'pan', 'aadhaar']
    },
    {
      id: 'identity',
      label: 'Identity & PII',
      types: ['email', 'phone', 'address', 'ssn', 'pan', 'aadhaar']
    },
    {
      id: 'secrets',
      label: 'Secrets & Credentials',
      types: ['secret']
    }
  ];

  const maskTypes = [
    { id: 'email', label: 'Email' },
    { id: 'phone', label: 'Phone' },
    { id: 'ssn', label: 'SSN' },
    { id: 'pan', label: 'PAN' },
    { id: 'aadhaar', label: 'Aadhaar' },
    { id: 'gstin', label: 'GSTIN' },
    { id: 'vat', label: 'VAT' },
    { id: 'ein', label: 'EIN' },
    { id: 'tin', label: 'TIN' },
    { id: 'card', label: 'Card' },
    { id: 'account', label: 'Account' },
    { id: 'invoice_id', label: 'Invoice ID' },
    { id: 'case_number', label: 'Case Number' },
    { id: 'legal_id', label: 'Legal/Registration ID' },
    { id: 'license_id', label: 'License ID' },
    { id: 'secret', label: 'Secrets' },
    { id: 'address', label: 'Address' }
  ];

  const buildSelectedTypes = (categories, manual) => {
    const categoryTypes = new Set();
    categories.forEach((categoryId) => {
      const group = categoryGroups.find((item) => item.id === categoryId);
      if (group) {
        group.types.forEach((type) => categoryTypes.add(type));
      }
    });
    manual.forEach((type) => categoryTypes.add(type));
    return Array.from(categoryTypes);
  };

  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) => {
      const next = prev.includes(categoryId)
        ? prev.filter((item) => item !== categoryId)
        : [...prev, categoryId];
      setSelectedTypes(buildSelectedTypes(next, manualTypes));
      return next;
    });
  };

  const toggleType = (typeId) => {
    setManualTypes((prev) => {
      const next = prev.includes(typeId)
        ? prev.filter((type) => type !== typeId)
        : [...prev, typeId];
      setSelectedTypes(buildSelectedTypes(selectedCategories, next));
      return next;
    });
  };

  const handleMask = async () => {
    const hasFile = !!file;
    const hasText = pastedContent.trim().length > 0;
    if (inputMode === 'upload' && !hasFile) {
      setError('Please upload a file to mask.');
      return;
    }
    if (inputMode === 'paste' && !hasText) {
      setError('Please paste data to mask.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      let uploadFile = file;
      if (!uploadFile && hasText) {
        const ext = format ? `.${format}` : '.txt';
        const blob = new Blob([pastedContent], { type: 'text/plain' });
        uploadFile = new File([blob], `pasted${ext}`, { type: 'text/plain' });
      }
      const response = await api.maskFile(uploadFile, format, selectedTypes, fieldAware);
      setResult(response);
    } catch (err) {
      setError(err.message || 'Masking failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setPastedContent('');
    setResult(null);
    setError('');
  };

  const handleDownload = () => {
    if (!result?.base64Content || !result?.outputFilename) return;
    const byteCharacters = atob(result.base64Content);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = result.outputFilename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Section
      title="Sensitive Data Masking"
      icon={Shield}
      description="Enterprise-grade masking for structured and unstructured data"
      defaultExpanded
      actions={
        <>
          <motion.button
            onClick={handleMask}
            disabled={loading || (inputMode === 'upload' && !file) || (inputMode === 'paste' && !pastedContent.trim())}
            className="btn-primary-modern px-4 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: loading || (inputMode === 'upload' && !file) || (inputMode === 'paste' && !pastedContent.trim()) ? 1 : 1.02 }}
            whileTap={{ scale: loading || (inputMode === 'upload' && !file) || (inputMode === 'paste' && !pastedContent.trim()) ? 1 : 0.98 }}
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
                Masking...
              </>
            ) : (
              'Mask'
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
      <UtilityItem title="Mask Sensetive Field Data Value" icon={Shield}>
        <div className="space-y-3">
          {error && (
            <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-3 py-2">
              <p className="text-xs font-semibold text-red-700 dark:text-red-200">Notice</p>
              <p className="text-xs text-red-600 dark:text-red-300">{error}</p>
            </div>
          )}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setInputMode('upload')}
                className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors flex items-center gap-2 ${
                  inputMode === 'upload'
                    ? 'border-primary-500 text-primary-600 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                }`}
              >
                <Upload className="w-4 h-4" />
                Upload Files
              </button>
              <button
                type="button"
                onClick={() => setInputMode('paste')}
                className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors flex items-center gap-2 ${
                  inputMode === 'paste'
                    ? 'border-primary-500 text-primary-600 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                }`}
              >
                <Clipboard className="w-4 h-4" />
                Paste
              </button>
            </div>
            <button
              type="button"
              onClick={() => setShowExample(!showExample)}
              className="flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              {showExample ? 'Hide' : 'Show'} Example
            </button>
          </div>

          <AnimatePresence>
            {showExample && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="space-y-4 text-xs text-[var(--text-secondary)]">
                    <div className="space-y-2">
                      <strong className="text-[var(--text-primary)] block">Example (JSON - field-aware)</strong>
                      <p className="text-[var(--text-muted)]">Input:</p>
                      <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "email": "rajiv.kumar@company.com",
  "phone": "+91 98765 43210",
  "pan": "ABCDE1234F",
  "aadhaar": "1234 5678 9012",
  "accountNumber": "021201558009",
  "secret": "my-api-token"
}`}
                      </code>
                      <p className="text-[var(--text-muted)] mt-2">Output:</p>
                      <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "email": "rXXXXr@company.com",
  "phone": "XXXXXXXX3210",
  "pan": "XXXXX1234F",
  "aadhaar": "XXXXXXXX9012",
  "accountNumber": "XXXXXXXX8009",
  "secret": "XXXX"
}`}
                      </code>
                    </div>

                    <div className="space-y-2">
                      <strong className="text-[var(--text-primary)] block">Example (YAML)</strong>
                      <p className="text-[var(--text-muted)]">Input:</p>
                      <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`email: rajiv.kumar@company.com
gstin: 27ABCDE1234F1Z5
invoiceId: INV-2024-0001
caseNumber: 2024/ABC/123`}
                      </code>
                      <p className="text-[var(--text-muted)] mt-2">Output:</p>
                      <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`email: rXXXXr@company.com
gstin: XXXXXXXXXXXXXXX
invoiceId: XXXX-2024-0001
caseNumber: XXXX/ABC/123`}
                      </code>
                    </div>

                    <div className="space-y-2">
                      <strong className="text-[var(--text-primary)] block">Example (CSV)</strong>
                      <p className="text-[var(--text-muted)]">Input:</p>
                      <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`email,phone,pan,card
rajiv.kumar@company.com,+1 415 555 2671,ABCDE1234F,4111 1111 1111 1111`}
                      </code>
                      <p className="text-[var(--text-muted)] mt-2">Output:</p>
                      <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`email,phone,pan,card
rXXXXr@company.com,XXXXXXXX2671,XXXXX1234F,XXXXXXXX1111`}
                      </code>
                    </div>

                    <div className="space-y-2">
                      <strong className="text-[var(--text-primary)] block">Example (DOCX)</strong>
                      <p className="text-[var(--text-muted)]">Input:</p>
                      <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`Invoice # INV-2024-0001
Account: 021201558009
Email: rajiv.kumar@company.com`}
                      </code>
                      <p className="text-[var(--text-muted)] mt-2">Output:</p>
                      <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`Invoice # XXXX-2024-0001
Account: XXXXXXXX8009
Email: rXXXXr@company.com`}
                      </code>
                    </div>

                    <div className="space-y-2">
                      <strong className="text-[var(--text-primary)] block">Example (XLSX)</strong>
                      <p className="text-[var(--text-muted)]">Input:</p>
                      <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`Email | PAN | GSTIN | License
rajiv.kumar@company.com | ABCDE1234F | 27ABCDE1234F1Z5 | LIC-445566`}
                      </code>
                      <p className="text-[var(--text-muted)] mt-2">Output:</p>
                      <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`Email | PAN | GSTIN | License
rXXXXr@company.com | XXXXX1234F | XXXXXXXXXXXXXXX | XXXX-445566`}
                      </code>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
            {inputMode === 'upload' && (
              <div className="md:col-span-2">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                  const dropped = e.dataTransfer.files?.[0];
                  if (dropped) {
                    setFile(dropped);
                  }
                }}
                className={`border-2 border-dashed rounded-xl p-4 transition-colors ${
                  dragActive ? 'border-primary-400 bg-primary-50/50 dark:bg-primary-900/20' : 'border-[var(--border-color)]'
                }`}
              >
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="input-modern w-full"
                  accept=".json,.yaml,.yml,.csv,.docx,.xlsx,.xls"
                />
                <p className="text-xs text-[var(--text-muted)] mt-2">
                  Drag & drop a file here, or click to select
                </p>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Supported: JSON, YAML, CSV, DOCX, XLSX
              </p>
              </div>
            )}
            <div className={`${inputMode === 'upload' ? 'w-[190px]' : 'w-full'}`}>
              <Select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                options={[
                  { value: '', label: 'Auto-detect' },
                  { value: 'json', label: 'JSON' },
                  { value: 'yaml', label: 'YAML' },
                  { value: 'yml', label: 'YML' },
                  { value: 'csv', label: 'CSV' },
                  { value: 'docx', label: 'DOCX' },
                  { value: 'xlsx', label: 'XLSX' }
                ]}
                className={`h-11 text-sm ${inputMode === 'upload' ? 'w-[190px]' : 'w-full'}`}
              />
            </div>
          </div>

          {inputMode === 'paste' && (
            <TextArea
              value={pastedContent}
              onChange={(e) => setPastedContent(e.target.value)}
              placeholder="Paste data here (JSON/YAML/CSV/text) to mask without uploading a file..."
              className="min-h-[140px]"
            />
          )}

          <div className="space-y-2">
            <p className="text-xs text-[var(--text-muted)]">
              Document type categories (auto-selects related mask types)
            </p>
            <div className="flex flex-wrap gap-2">
              {categoryGroups.map((group) => (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => toggleCategory(group.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                    selectedCategories.includes(group.id)
                      ? 'border-primary-500 text-primary-600 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                  }`}
                >
                  {group.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              You can still fine-tune specific mask types below.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {maskTypes.map((type) => (
              <label key={type.id} className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type.id)}
                  onChange={() => toggleType(type.id)}
                />
                {type.label}
              </label>
            ))}
          </div>

          <label className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
            <input
              type="checkbox"
              checked={fieldAware}
              onChange={(e) => setFieldAware(e.target.checked)}
            />
            Field-aware masking for JSON/YAML (use key names to apply rules)
          </label>

          {result && (
            <div className="p-3 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)] space-y-2">
              <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-secondary)]">
                <span>Format: {result.detectedFormat || 'unknown'}</span>
                <span>Masked: {result.maskedCount ?? 0}</span>
              </div>
              {result.warning && (
                <p className="text-xs text-[var(--text-secondary)]">{result.warning}</p>
              )}
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={handleDownload}
                  className="btn-primary-modern px-4"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Download Masked File
                </motion.button>
              </div>
              {result.content && (
                <TextArea
                  value={result.content}
                  readOnly
                  className="min-h-[160px]"
                />
              )}
            </div>
          )}
        </div>
      </UtilityItem>
    </Section>
  );
};

export default Utilities;

