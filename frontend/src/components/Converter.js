import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Trash2, RefreshCw, FileText, Check, ArrowRightLeft, Brain, Workflow, ChevronDown, Sparkles, BarChart3, TrendingDown, DollarSign, Info, HelpCircle } from 'lucide-react';
import { TextArea, Select, Label } from './UI/Input';
import { ErrorMessage } from './UI/Message';
import api from '../services/api';

const CONVERSION_OPTIONS = [
  { value: 'json-yaml', label: 'JSON ↔ YAML' },
  { value: 'yaml-json', label: 'YAML ↔ JSON' },
  { value: 'json-toml', label: 'JSON ↔ TOML' },
  { value: 'toml-json', label: 'TOML ↔ JSON' },
  { value: 'json-toon', label: 'JSON ↔ TOON' },
  { value: 'toon-json', label: 'TOON ↔ JSON' },
  { value: 'yaml-toon', label: 'YAML ↔ TOON' },
  { value: 'toon-yaml', label: 'TOON ↔ YAML' },
  { value: 'toml-toon', label: 'TOML ↔ TOON' },
  { value: 'toon-toml', label: 'TOON ↔ TOML' },
  { value: 'xml-json', label: 'XML ↔ JSON' },
  { value: 'json-xml', label: 'JSON ↔ XML' },
  { value: 'xml-toon', label: 'XML ↔ TOON' },
  { value: 'toon-xml', label: 'TOON ↔ XML' },
  { value: 'json-protobuf', label: 'JSON ↔ Protobuf' },
  { value: 'protobuf-json', label: 'Protobuf ↔ JSON' },
  { value: 'csv-json', label: 'CSV ↔ JSON' },
  { value: 'json-csv', label: 'JSON ↔ CSV' },
  { value: 'csv-yaml', label: 'CSV ↔ YAML' },
  { value: 'yaml-csv', label: 'YAML ↔ CSV' },
  { value: 'csv-xml', label: 'CSV ↔ XML' },
  { value: 'xml-csv', label: 'XML ↔ CSV' },
  { value: 'csv-toon', label: 'CSV ↔ TOON' },
  { value: 'toon-csv', label: 'TOON ↔ CSV' },
  { value: 'properties-yaml', label: 'Properties → YAML' },
  { value: 'properties-toon', label: 'Properties → TOON' }
];

const CONVERSION_MAP = {
  'json-yaml': { from: 'json', to: 'yaml' },
  'yaml-json': { from: 'yaml', to: 'json' },
  'properties-yaml': { from: 'properties', to: 'yaml' },
  'properties-toon': { from: 'properties', to: 'toon' },
  'json-toml': { from: 'json', to: 'toml' },
  'toml-json': { from: 'toml', to: 'json' },
  'json-toon': { from: 'json', to: 'toon' },
  'toon-json': { from: 'toon', to: 'json' },
  'yaml-toon': { from: 'yaml', to: 'toon' },
  'toon-yaml': { from: 'toon', to: 'yaml' },
  'toml-toon': { from: 'toml', to: 'toon' },
  'toon-toml': { from: 'toon', to: 'toml' },
  'xml-json': { from: 'xml', to: 'json' },
  'json-xml': { from: 'json', to: 'xml' },
  'xml-toon': { from: 'xml', to: 'toon' },
  'toon-xml': { from: 'toon', to: 'xml' },
  'json-protobuf': { from: 'json', to: 'protobuf' },
  'protobuf-json': { from: 'protobuf', to: 'json' },
  'csv-json': { from: 'csv', to: 'json' },
  'json-csv': { from: 'json', to: 'csv' },
  'csv-yaml': { from: 'csv', to: 'yaml' },
  'yaml-csv': { from: 'yaml', to: 'csv' },
  'csv-xml': { from: 'csv', to: 'xml' },
  'xml-csv': { from: 'xml', to: 'csv' },
  'csv-toon': { from: 'csv', to: 'toon' },
  'toon-csv': { from: 'toon', to: 'csv' }
};

// Section Component (similar to UtilitySection from ToolKit)
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
          className="flex items-center gap-3 flex-1 hover:bg-[var(--bg-secondary)] transition-colors rounded-lg p-2 -m-2"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg flex-shrink-0">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
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

// Transformation Item Component (similar to UtilityItem)
const TransformItem = ({ title, icon: Icon, children }) => (
  <div className="p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] mb-4">
    <div className="flex items-center gap-2 mb-4">
      {Icon && <Icon className="w-5 h-5 text-primary-500" />}
      <h4 className="font-semibold text-[var(--text-primary)]">{title}</h4>
    </div>
    {children}
  </div>
);

const Converter = () => {
  const [activeSidebarItem, setActiveSidebarItem] = useState('format-conversion');
  const [conversionType, setConversionType] = useState('json-yaml');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [protobufSchema, setProtobufSchema] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState({ 
    input: false, 
    output: false
  });

  const needsProtobufSchema = conversionType === 'json-protobuf' || conversionType === 'protobuf-json';

  // Format Conversion Handler
  const handleConvert = async () => {
    if (!input.trim()) {
      setError('Please enter input data');
      return;
    }

    const { from, to } = CONVERSION_MAP[conversionType];
    
    if ((from === 'protobuf' || to === 'protobuf') && !protobufSchema.trim()) {
      setError('Protobuf schema is required for Protobuf conversions');
      return;
    }

    setError('');
    setLoading(true);
    setOutput('');

    try {
      const result = await api.convert(input, from, to, protobufSchema || null);
      setOutput(result.output);
    } catch (err) {
      setError(err.message || 'Conversion failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text, type) => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(prev => ({ ...prev, [type]: true }));
    setTimeout(() => setCopied(prev => ({ ...prev, [type]: false })), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setProtobufSchema('');
    setError('');
  };

  const sidebarItems = [
    {
      id: 'format-conversion',
      title: 'Format Conversion',
      icon: ArrowRightLeft,
      description: 'Normalize data assets across approved enterprise formats'
    },
    {
      id: 'data-transformation',
      title: 'Data Transformation',
      subtitle: '(Structural)',
      icon: Workflow,
      description: 'Apply controlled structural transformations to align data with enterprise standards'
    }
  ];

  return (
    <div className="full-width flex flex-col lg:flex-row gap-6 w-full max-w-full px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 lg:pt-5">
      {/* Left Sidebar - Positioned at far left, just below nav */}
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
                        {item.subtitle && (
                          <span className="text-[10px] text-[var(--text-muted)] whitespace-nowrap">{item.subtitle}</span>
                        )}
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
            {activeSidebarItem === 'format-conversion' && (
              <motion.div
                key="format-conversion"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-none"
              >
                <div className="card-modern p-6 w-full max-w-none">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border-color)]">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg">
                      <ArrowRightLeft className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-[var(--text-primary)]">Normalize Between Formats</h2>
                      <p className="text-sm text-[var(--text-secondary)]">Normalize data assets across JSON, YAML, TOML, TOON, XML, CSV, Protobuf, and Properties formats</p>
                    </div>
                  </div>

                  <div className="space-y-6 w-full max-w-none">
                    {/* Conversion Type Selector */}
                    <div className="w-full max-w-none">
                      <div className="flex items-end justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <Label htmlFor="conversion-type" className="block mb-3 text-sm font-semibold text-[var(--text-primary)]">
                            Select Conversion Type
                          </Label>
                          <Select
                            id="conversion-type"
                            value={conversionType}
                            onChange={(e) => setConversionType(e.target.value)}
                            options={CONVERSION_OPTIONS}
                            className="input-modern w-auto max-w-md"
                          />
                        </div>
                        {/* Action Buttons - Right Aligned */}
                        <div className="flex items-center gap-3">
                          <motion.button
                            onClick={handleConvert}
                            disabled={loading}
                            className="btn-primary-modern flex items-center gap-2"
                            whileHover={{ scale: loading ? 1 : 1.02 }}
                            whileTap={{ scale: loading ? 1 : 0.98 }}
                          >
                            {loading ? (
                              <>
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                >
                                  <RefreshCw className="w-4 h-4" />
                                </motion.div>
                                Converting...
                              </>
                            ) : (
                              <>
                                <ArrowRightLeft className="w-4 h-4" />
                                Apply
                              </>
                            )}
                          </motion.button>
                          <motion.button
                            onClick={handleClear}
                            className="btn-secondary-modern flex items-center gap-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Trash2 className="w-4 h-4" />
                            Clear All
                          </motion.button>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-[var(--text-muted)]">
                        <span className="px-2 py-1 bg-[var(--bg-tertiary)] rounded-md">All bidirectional</span>
                        <span className="px-2 py-1 bg-[var(--bg-tertiary)] rounded-md">Auto-detect format</span>
                        <span className="px-2 py-1 bg-[var(--bg-tertiary)] rounded-md">Preserve data types</span>
                      </div>
                    </div>

                    {/* Input/Output Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                      {/* Input Section */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col w-full"
                      >
                        <div className="flex items-center justify-between mb-3 px-4 py-2.5 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl w-full">
                          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Input</h3>
                          <div className="flex items-center gap-2">
                            <motion.button
                              onClick={() => handleCopy(input, 'input')}
                              className="p-1.5 rounded-lg hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Copy"
                            >
                              {copied.input ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4 text-[var(--text-secondary)]" />
                              )}
                            </motion.button>
                            <motion.button
                              onClick={() => setInput('')}
                              className="p-1.5 rounded-lg hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Clear"
                            >
                              <Trash2 className="w-4 h-4 text-[var(--text-secondary)]" />
                            </motion.button>
                          </div>
                        </div>
                        <TextArea
                          id="input-area"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder="Enter input data here..."
                          className="textarea-modern flex-1 min-h-[550px] w-full"
                        />
                      </motion.div>

                      {/* Output Section */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col w-full"
                      >
                        <div className="flex items-center justify-between mb-3 px-4 py-2.5 bg-gradient-to-r from-secondary-50 to-primary-50 dark:from-secondary-900/20 dark:to-primary-900/20 rounded-xl w-full">
                          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Output</h3>
                          <div className="flex items-center gap-2">
                            <motion.button
                              onClick={() => handleCopy(output, 'output')}
                              className="p-1.5 rounded-lg hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Copy"
                            >
                              {copied.output ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4 text-[var(--text-secondary)]" />
                              )}
                            </motion.button>
                            <motion.button
                              onClick={() => setOutput('')}
                              className="p-1.5 rounded-lg hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Clear"
                            >
                              <Trash2 className="w-4 h-4 text-[var(--text-secondary)]" />
                            </motion.button>
                          </div>
                        </div>
                        <TextArea
                          id="output-area"
                          value={output}
                          readOnly
                          placeholder="Converted output will appear here..."
                          className="textarea-modern flex-1 min-h-[550px] bg-[var(--bg-secondary)] w-full"
                        />
                      </motion.div>
                    </div>

                    {/* Protobuf Schema Section */}
                    <AnimatePresence>
                      {needsProtobufSchema && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)]"
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <FileText className="w-5 h-5 text-primary-500" />
                            <Label htmlFor="protobuf-schema" className="text-sm font-semibold text-[var(--text-primary)]">
                              Protobuf Schema (.proto file content)
                            </Label>
                          </div>
                          <TextArea
                            id="protobuf-schema"
                            value={protobufSchema}
                            onChange={(e) => setProtobufSchema(e.target.value)}
                            placeholder="Paste your .proto schema definition here..."
                            className="textarea-modern min-h-[150px]"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Error Message */}
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
                    </AnimatePresence>

                    {/* TOON Statistics Section */}
                    <ToonStatisticsSection />
                  </div>
                </div>
              </motion.div>
            )}

            {activeSidebarItem === 'data-transformation' && (
              <motion.div
                key="data-transformation"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="space-y-4">
                  <MergeSection />
                  <FlattenSection />
                  <UnflattenSection />
                  <RenameKeysSection />
                  <TransformValuesSection />
                  <FilterFieldsSection />
                  <ConvertTypesSection />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
  );
};

// Merge Section Component (following ToolKit pattern)
const MergeSection = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  // Sample data for visualization
  const sampleInput = '{"name": "John", "age": 30}\n{"city": "New York", "country": "USA"}\n{"email": "john@example.com", "active": true}';
  const sampleOutput = `{
  "name": "John",
  "age": 30,
  "city": "New York",
  "country": "USA",
  "email": "john@example.com",
  "active": true
}`;

  const handleMerge = async () => {
    if (!input.trim()) return;
    try {
      // Parse complete JSON objects from input (handles both single-line and multi-line JSON)
      const inputs = parseJsonObjects(input);
      
      if (inputs.length === 0) {
        setOutput('Error: No valid JSON objects found. Please ensure each JSON object is complete and valid.');
        return;
      }
      
      const result = await api.mergeJson(inputs);
      setOutput(result.success ? result.output : 'Error: ' + result.error);
    } catch (err) {
      setOutput('Error: ' + err.message);
    }
  };

  // Helper function to parse multiple JSON objects from input text
  // Handles both single-line and multi-line JSON objects
  const parseJsonObjects = (text) => {
    const objects = [];
    let current = '';
    let braceDepth = 0;
    let bracketDepth = 0;
    let inString = false;
    let escapeNext = false;
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      
      // Handle escape sequences in strings
      if (escapeNext) {
        current += char;
        escapeNext = false;
        continue;
      }
      
      if (char === '\\' && inString) {
        escapeNext = true;
        current += char;
        continue;
      }
      
      // Track string boundaries (ignore braces/brackets inside strings)
      if (char === '"' && !escapeNext) {
        inString = !inString;
        current += char;
        continue;
      }
      
      // Only process braces/brackets when not inside a string
      if (!inString) {
        if (char === '{') {
          if (braceDepth === 0 && bracketDepth === 0) {
            // Start of a new object
            // Save previous complete object if any
            const prev = current.trim();
            if (prev) {
              try {
                JSON.parse(prev);
                objects.push(prev);
              } catch (e) {
                // Previous wasn't valid, ignore it
              }
            }
            current = char;
          } else {
            current += char;
          }
          braceDepth++;
        } else if (char === '}') {
          current += char;
          braceDepth--;
          
          // Check if we have a complete object
          if (braceDepth === 0 && bracketDepth === 0 && current.trim()) {
            const trimmed = current.trim();
            try {
              JSON.parse(trimmed);
              objects.push(trimmed);
              current = '';
            } catch (e) {
              // Invalid JSON, reset
              current = '';
            }
          }
        } else if (char === '[') {
          if (braceDepth === 0 && bracketDepth === 0) {
            // Start of a new array
            // Save previous complete object if any
            const prev = current.trim();
            if (prev) {
              try {
                JSON.parse(prev);
                objects.push(prev);
              } catch (e) {
                // Previous wasn't valid, ignore it
              }
            }
            current = char;
          } else {
            current += char;
          }
          bracketDepth++;
        } else if (char === ']') {
          current += char;
          bracketDepth--;
          
          // Check if we have a complete array
          if (braceDepth === 0 && bracketDepth === 0 && current.trim()) {
            const trimmed = current.trim();
            try {
              JSON.parse(trimmed);
              objects.push(trimmed);
              current = '';
            } catch (e) {
              // Invalid JSON, reset
              current = '';
            }
          }
        } else {
          // Regular character - add to current if we're inside an object/array or building up whitespace
          if (braceDepth > 0 || bracketDepth > 0) {
            current += char;
          } else if (char.match(/\s/)) {
            // Whitespace between objects - don't add to current
            // (already handled when we encounter the next { or [)
          } else {
            // Unexpected character when depth is 0 - might be malformed, but try to continue
            current += char;
          }
        }
      } else {
        // Inside a string, just add character
        current += char;
      }
    }
    
    // Handle any remaining object at the end
    if (current.trim() && braceDepth === 0 && bracketDepth === 0) {
      const trimmed = current.trim();
      try {
        JSON.parse(trimmed);
        objects.push(trimmed);
      } catch (e) {
        // Invalid, ignore
      }
    }
    
    return objects;
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
  const displayOutput = !hasInteracted && !output ? sampleOutput : output;
  const isSample = !hasInteracted && (!input || !output);

  return (
    <Section
      title="Merge Multiple JSON Objects"
      icon={Workflow}
      description="Consolidate multiple JSON assets into a governed structure"
      defaultExpanded={true}
      actions={
        <>
          <motion.button
            onClick={handleMerge}
            className="btn-primary-modern px-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Consolidate
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
      <TransformItem title="Merge JSON Objects" icon={Workflow}>
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
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 mb-3">
                  <div className="space-y-3 text-xs text-[var(--text-secondary)]">
                    <div>
                      <strong className="text-[var(--text-primary)] block mb-1">How It Works:</strong>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Combines multiple JSON objects into a single object</li>
                        <li>If keys conflict, the last object's value wins</li>
                        <li>Nested objects are merged recursively</li>
                        <li>Arrays from different objects are wrapped in an "items" array</li>
                      </ul>
                    </div>
                    
                    <div className="pt-2 border-t border-purple-200 dark:border-purple-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 1: Simple Merge</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input (multiple JSON objects):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{"name": "John", "age": 30}
{"city": "New York", "country": "USA"}`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output (merged):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "name": "John",
  "age": 30,
  "city": "New York",
  "country": "USA"
}`}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-purple-200 dark:border-purple-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 2: Conflicting Keys</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{"name": "John", "status": "active"}
{"name": "Jane", "status": "inactive"}`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output (last object wins):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "name": "Jane",
  "status": "inactive"
}`}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-purple-200 dark:border-purple-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 3: Nested Objects</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{"user": {"name": "John"}, "settings": {"theme": "dark"}}
{"user": {"email": "john@example.com"}, "settings": {"language": "en"}}`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output (nested objects merged):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "user": {
    "name": "John",
    "email": "john@example.com"
  },
  "settings": {
    "theme": "dark",
    "language": "en"
  }
}`}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 mt-3 p-2 bg-purple-100 dark:bg-purple-800/30 rounded">
                      <p className="text-[var(--text-primary)] font-semibold text-xs mb-1">💡 Tips:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Place each JSON object on a separate line or separate them with whitespace</li>
                        <li>Multi-line JSON objects are supported</li>
                        <li>The merge preserves the structure of nested objects</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
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
              placeholder="Enter multiple JSON objects, one per line..."
              className={`min-h-[150px] ${isSample ? 'opacity-60 italic' : ''}`}
              readOnly={isSample}
              style={{ cursor: isSample ? 'pointer' : 'text' }}
            />
            <TextArea
              value={displayOutput}
              readOnly
              placeholder="Merged JSON will appear here..."
              className={`min-h-[150px] ${isSample ? 'opacity-60 italic' : ''}`}
            />
          </div>
          {isSample && (
            <p className="text-xs text-[var(--text-muted)] italic text-center">
              Click in the input area to start editing
            </p>
          )}
        </div>
      </TransformItem>
    </Section>
  );
};

// Flatten Section Component
const FlattenSection = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [format, setFormat] = useState('json');
  const [separator, setSeparator] = useState('.');
  const [copied, setCopied] = useState(false);
  const [showSeparatorHelp, setShowSeparatorHelp] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  // Sample data for visualization
  const sampleInputJSON = `{
  "user": {
    "name": "John",
    "contact": {
      "email": "john@example.com",
      "phone": "123-456-7890"
    }
  },
  "settings": {
    "theme": "dark"
  }
}`;
  const sampleOutputJSON = `{
  "user.name": "John",
  "user.contact.email": "john@example.com",
  "user.contact.phone": "123-456-7890",
  "settings.theme": "dark"
}`;
  
  const sampleInputYAML = `user:
  name: John
  contact:
    email: john@example.com
    phone: "123-456-7890"
settings:
  theme: dark`;
  
  const sampleOutputYAML = `user.name: John
user.contact.email: john@example.com
user.contact.phone: "123-456-7890"
settings.theme: dark`;
  
  const sampleInput = format === 'yaml' ? sampleInputYAML : sampleInputJSON;
  const sampleOutput = format === 'yaml' ? sampleOutputYAML : sampleOutputJSON;

  const handleFlatten = async () => {
    if (!input.trim()) return;
    try {
      const result = await api.flatten(input, format, format, separator);
      setOutput(result.success ? result.output : 'Error: ' + result.error);
    } catch (err) {
      setOutput('Error: ' + err.message);
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

  const getSampleInput = () => {
    return format === 'yaml' ? sampleInputYAML : sampleInputJSON;
  };

  const getSampleOutput = () => {
    return format === 'yaml' ? sampleOutputYAML : sampleOutputJSON;
  };

  const displayInput = !hasInteracted && !input ? getSampleInput() : input;
  const displayOutput = !hasInteracted && !output ? getSampleOutput() : output;
  const isSample = !hasInteracted && (!input || !output);

  return (
    <Section
      title="Flatten Nested Structures"
      icon={Workflow}
      description="Flatten nested data for compatibility and downstream processing"
      actions={
        <>
          <motion.button
            onClick={handleFlatten}
            className="btn-primary-modern px-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Flatten
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
      <TransformItem title="Flatten Data" icon={Workflow}>
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
                        <li>Converts nested JSON/YAML structures to flat key-value pairs</li>
                        <li>Uses a separator (default: ".") to join nested keys</li>
                        <li>Preserves arrays with indexed keys (e.g., items[0].name)</li>
                        <li>Works recursively through all nesting levels</li>
                      </ul>
                    </div>
                    
                    <div className="pt-2 border-t border-blue-200 dark:border-blue-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 1: Basic Flattening</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input (Nested JSON):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "user": {
    "name": "John",
    "email": "john@example.com"
  }
}`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output (Flattened with "." separator):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "user.name": "John",
  "user.email": "john@example.com"
}`}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-blue-200 dark:border-blue-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 2: Deep Nesting</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "company": {
    "department": {
      "employee": {
        "name": "Alice",
        "id": 123
      }
    }
  }
}`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "company.department.employee.name": "Alice",
  "company.department.employee.id": 123
}`}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-blue-200 dark:border-blue-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 3: Arrays</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "users": [
    {"name": "John", "age": 30},
    {"name": "Jane", "age": 25}
  ]
}`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "users[0].name": "John",
  "users[0].age": 30,
  "users[1].name": "Jane",
  "users[1].age": 25
}`}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 mt-3 p-2 bg-blue-100 dark:bg-blue-800/30 rounded">
                      <p className="text-[var(--text-primary)] font-semibold text-xs mb-1">💡 Tips:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Use "." for readable paths, "_" for variable names, "/" for URL-like paths</li>
                        <li>Remember the separator you use - you'll need it for unflattening!</li>
                        <li>Works with both JSON and YAML formats</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="flex gap-2 items-center">
            <Select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              options={[
                { value: 'json', label: 'JSON' },
                { value: 'yaml', label: 'YAML' }
              ]}
              className="input-modern w-auto"
            />
            <div className="relative flex-1 max-w-xs">
              <input
                type="text"
                value={separator}
                onChange={(e) => setSeparator(e.target.value)}
                className="input-modern w-full pr-8"
                placeholder="Separator (default: .)"
                title="Character used to join nested keys in flattened output"
              />
              <button
                type="button"
                onClick={() => setShowSeparatorHelp(!showSeparatorHelp)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-[var(--bg-tertiary)] rounded transition-colors"
                title="Show separator examples"
              >
                <Info className="w-4 h-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)]" />
              </button>
            </div>
          </div>
          
          {/* Separator Help Tooltip */}
          <AnimatePresence>
            {showSeparatorHelp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-2 mb-3">
                    <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">
                        Separator Options & Examples
                      </h4>
                      <div className="space-y-2 text-xs text-[var(--text-secondary)]">
                        <div>
                          <strong className="text-[var(--text-primary)]">Default: <code className="px-1 py-0.5 bg-[var(--bg-secondary)] rounded">.</code> (dot)</strong>
                          <p className="mt-1">Most common. Results: <code className="text-blue-600 dark:text-blue-400">user.name</code>, <code className="text-blue-600 dark:text-blue-400">settings.theme</code></p>
                          <p className="text-[var(--text-muted)] mt-1">✅ Best for: General use, JSON-like keys, readable paths</p>
                        </div>
                        
                        <div className="pt-2 border-t border-blue-200 dark:border-blue-700">
                          <strong className="text-[var(--text-primary)]"><code className="px-1 py-0.5 bg-[var(--bg-secondary)] rounded">_</code> (underscore)</strong>
                          <p className="mt-1">Results: <code className="text-blue-600 dark:text-blue-400">user_name</code>, <code className="text-blue-600 dark:text-blue-400">settings_theme</code></p>
                          <p className="text-[var(--text-muted)] mt-1">✅ Best for: Variable names, database column names, snake_case convention</p>
                        </div>
                        
                        <div className="pt-2 border-t border-blue-200 dark:border-blue-700">
                          <strong className="text-[var(--text-primary)]"><code className="px-1 py-0.5 bg-[var(--bg-secondary)] rounded">/</code> (slash)</strong>
                          <p className="mt-1">Results: <code className="text-blue-600 dark:text-blue-400">user/name</code>, <code className="text-blue-600 dark:text-blue-400">settings/theme</code></p>
                          <p className="text-[var(--text-muted)] mt-1">✅ Best for: URL-like paths, hierarchical identifiers, file paths</p>
                        </div>
                        
                        <div className="pt-2 border-t border-blue-200 dark:border-blue-700">
                          <strong className="text-[var(--text-primary)]"><code className="px-1 py-0.5 bg-[var(--bg-secondary)] rounded">-</code> (hyphen/dash)</strong>
                          <p className="mt-1">Results: <code className="text-blue-600 dark:text-blue-400">user-name</code>, <code className="text-blue-600 dark:text-blue-400">settings-theme</code></p>
                          <p className="text-[var(--text-muted)] mt-1">✅ Best for: CSS-like keys, kebab-case convention, hyphenated identifiers</p>
                        </div>
                        
                        <div className="pt-2 border-t border-blue-200 dark:border-blue-700">
                          <strong className="text-[var(--text-primary)]"><code className="px-1 py-0.5 bg-[var(--bg-secondary)] rounded">|</code> (pipe) or custom</strong>
                          <p className="mt-1">You can use any single character as separator</p>
                          <p className="text-[var(--text-muted)] mt-1">⚠️ <strong>Important:</strong> Use the same separator when unflattening!</p>
                        </div>
                        
                        <div className="pt-2 mt-3 p-2 bg-blue-100 dark:bg-blue-800/30 rounded">
                          <p className="text-[var(--text-primary)] font-semibold text-xs mb-1">💡 Tip:</p>
                          <p className="text-xs text-[var(--text-secondary)]">
                            Arrays are automatically indexed: <code className="text-blue-600 dark:text-blue-400">items[0].name</code>, <code className="text-blue-600 dark:text-blue-400">items[1].name</code>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
              placeholder={`Enter nested ${format.toUpperCase()}...`}
              className={`min-h-[150px] ${isSample ? 'opacity-60 italic' : ''}`}
              readOnly={isSample}
              style={{ cursor: isSample ? 'pointer' : 'text' }}
            />
            <TextArea
              value={displayOutput}
              readOnly
              placeholder={`Flattened ${format.toUpperCase()} will appear here...`}
              className={`min-h-[150px] ${isSample ? 'opacity-60 italic' : ''}`}
            />
          </div>
          {isSample && (
            <p className="text-xs text-[var(--text-muted)] italic text-center">
              Click in the input area to start editing
            </p>
          )}
        </div>
      </TransformItem>
    </Section>
  );
};

// Unflatten Section Component
const UnflattenSection = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [format, setFormat] = useState('json');
  const [separator, setSeparator] = useState('.');
  const [copied, setCopied] = useState(false);
  const [showSeparatorHelp, setShowSeparatorHelp] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  // Sample data for visualization
  const sampleInputJSON = `{
  "user.name": "John",
  "user.contact.email": "john@example.com",
  "user.contact.phone": "123-456-7890",
  "settings.theme": "dark"
}`;
  const sampleOutputJSON = `{
  "user": {
    "name": "John",
    "contact": {
      "email": "john@example.com",
      "phone": "123-456-7890"
    }
  },
  "settings": {
    "theme": "dark"
  }
}`;
  
  const sampleInputYAML = `user.name: John
user.contact.email: john@example.com
user.contact.phone: "123-456-7890"
settings.theme: dark`;
  
  const sampleOutputYAML = `user:
  name: John
  contact:
    email: john@example.com
    phone: "123-456-7890"
settings:
  theme: dark`;
  
  const getSampleInput = () => {
    return format === 'yaml' ? sampleInputYAML : sampleInputJSON;
  };

  const getSampleOutput = () => {
    return format === 'yaml' ? sampleOutputYAML : sampleOutputJSON;
  };

  const handleUnflatten = async () => {
    if (!input.trim()) return;
    try {
      const result = await api.unflatten(input, format, format, separator);
      setOutput(result.success ? result.output : 'Error: ' + result.error);
    } catch (err) {
      setOutput('Error: ' + err.message);
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
      title="Unflatten Data"
      icon={Workflow}
      description="Restore hierarchical structure from flattened representations"
      actions={
        <>
          <motion.button
            onClick={handleUnflatten}
            className="btn-primary-modern px-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Unflatten
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
      <TransformItem title="Unflatten Data" icon={Workflow}>
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
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800 mb-3">
                  <div className="space-y-3 text-xs text-[var(--text-secondary)]">
                    <div>
                      <strong className="text-[var(--text-primary)] block mb-1">How It Works:</strong>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Converts flat key-value pairs back to nested JSON/YAML structures</li>
                        <li>Uses a separator (default: ".") to reconstruct nested paths</li>
                        <li>Separator must match the one used when flattening</li>
                        <li>Preserves arrays with indexed keys (e.g., items[0].name)</li>
                      </ul>
                    </div>
                    
                    <div className="pt-2 border-t border-amber-200 dark:border-amber-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 1: Basic Unflattening</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input (Flattened JSON):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "user.name": "John",
  "user.email": "john@example.com"
}`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output (Nested JSON with "." separator):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "user": {
    "name": "John",
    "email": "john@example.com"
  }
}`}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-amber-200 dark:border-amber-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 2: Deep Nesting</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "company.department.employee.name": "Alice",
  "company.department.employee.id": 123
}`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "company": {
    "department": {
      "employee": {
        "name": "Alice",
        "id": 123
      }
    }
  }
}`}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-amber-200 dark:border-amber-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 3: Arrays</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "users[0].name": "John",
  "users[0].age": 30,
  "users[1].name": "Jane",
  "users[1].age": 25
}`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "users": [
    {"name": "John", "age": 30},
    {"name": "Jane", "age": 25}
  ]
}`}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 mt-3 p-2 bg-amber-100 dark:bg-amber-800/30 rounded">
                      <p className="text-[var(--text-primary)] font-semibold text-xs mb-1">⚠️ Critical:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>You must use the SAME separator that was used when flattening!</li>
                        <li>If data was flattened with ".", use "." separator for unflattening</li>
                        <li>If data was flattened with "_", use "_" separator for unflattening</li>
                        <li>Works with both JSON and YAML formats</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="flex gap-2 items-center">
            <Select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              options={[
                { value: 'json', label: 'JSON' },
                { value: 'yaml', label: 'YAML' }
              ]}
              className="input-modern w-auto"
            />
            <div className="relative flex-1 max-w-xs">
              <input
                type="text"
                value={separator}
                onChange={(e) => setSeparator(e.target.value)}
                className="input-modern w-full pr-8"
                placeholder="Separator (default: .)"
                title="Character used to split nested keys (must match the separator used when flattening)"
              />
              <button
                type="button"
                onClick={() => setShowSeparatorHelp(!showSeparatorHelp)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-[var(--bg-tertiary)] rounded transition-colors"
                title="Show separator examples"
              >
                <Info className="w-4 h-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)]" />
              </button>
            </div>
          </div>
          
          {/* Separator Help Tooltip */}
          <AnimatePresence>
            {showSeparatorHelp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <div className="flex items-start gap-2 mb-3">
                    <HelpCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">
                        Separator Options for Unflattening
                      </h4>
                      <div className="space-y-2 text-xs text-[var(--text-secondary)]">
                        <div className="p-2 bg-amber-100 dark:bg-amber-800/30 rounded mb-2">
                          <p className="text-[var(--text-primary)] font-semibold text-xs mb-1">⚠️ Critical:</p>
                          <p className="text-xs text-[var(--text-secondary)]">
                            <strong>You must use the SAME separator that was used when flattening!</strong>
                            Otherwise, the unflattening will fail or produce incorrect results.
                          </p>
                        </div>
                        
                        <div>
                          <strong className="text-[var(--text-primary)]">Default: <code className="px-1 py-0.5 bg-[var(--bg-secondary)] rounded">.</code> (dot)</strong>
                          <p className="mt-1">If flattened with dot: <code className="text-amber-600 dark:text-amber-400">user.name</code>, <code className="text-amber-600 dark:text-amber-400">settings.theme</code></p>
                          <p className="text-[var(--text-muted)] mt-1">✅ Use this if data was flattened with "." separator</p>
                        </div>
                        
                        <div className="pt-2 border-t border-amber-200 dark:border-amber-700">
                          <strong className="text-[var(--text-primary)]"><code className="px-1 py-0.5 bg-[var(--bg-secondary)] rounded">_</code> (underscore)</strong>
                          <p className="mt-1">If flattened with underscore: <code className="text-amber-600 dark:text-amber-400">user_name</code>, <code className="text-amber-600 dark:text-amber-400">settings_theme</code></p>
                          <p className="text-[var(--text-muted)] mt-1">✅ Use this if data was flattened with "_" separator</p>
                        </div>
                        
                        <div className="pt-2 border-t border-amber-200 dark:border-amber-700">
                          <strong className="text-[var(--text-primary)]"><code className="px-1 py-0.5 bg-[var(--bg-secondary)] rounded">/</code> (slash)</strong>
                          <p className="mt-1">If flattened with slash: <code className="text-amber-600 dark:text-amber-400">user/name</code>, <code className="text-amber-600 dark:text-amber-400">settings/theme</code></p>
                          <p className="text-[var(--text-muted)] mt-1">✅ Use this if data was flattened with "/" separator</p>
                        </div>
                        
                        <div className="pt-2 border-t border-amber-200 dark:border-amber-700">
                          <strong className="text-[var(--text-primary)]"><code className="px-1 py-0.5 bg-[var(--bg-secondary)] rounded">-</code> (hyphen)</strong>
                          <p className="mt-1">If flattened with hyphen: <code className="text-amber-600 dark:text-amber-400">user-name</code>, <code className="text-amber-600 dark:text-amber-400">settings-theme</code></p>
                          <p className="text-[var(--text-muted)] mt-1">✅ Use this if data was flattened with "-" separator</p>
                        </div>
                        
                        <div className="pt-2 mt-3 p-2 bg-amber-100 dark:bg-amber-800/30 rounded">
                          <p className="text-[var(--text-primary)] font-semibold text-xs mb-1">💡 How to Find the Right Separator:</p>
                          <ol className="list-decimal list-inside text-xs text-[var(--text-secondary)] space-y-1">
                            <li>Look at your flattened keys (e.g., <code className="text-amber-600 dark:text-amber-400">user.name</code>)</li>
                            <li>Identify the character between nested levels</li>
                            <li>Use that exact character as the separator</li>
                            <li>Array indices like <code>[0]</code> are automatically handled</li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
              placeholder={`Enter flattened ${format.toUpperCase()}...`}
              className={`min-h-[150px] ${isSample ? 'opacity-60 italic' : ''}`}
              readOnly={isSample}
              style={{ cursor: isSample ? 'pointer' : 'text' }}
            />
            <TextArea
              value={displayOutput}
              readOnly
              placeholder={`Unflattened ${format.toUpperCase()} will appear here...`}
              className={`min-h-[150px] ${isSample ? 'opacity-60 italic' : ''}`}
            />
          </div>
          {isSample && (
            <p className="text-xs text-[var(--text-muted)] italic text-center">
              Click in the input area to start editing
            </p>
          )}
        </div>
      </TransformItem>
    </Section>
  );
};

// Rename Keys Section Component
const RenameKeysSection = () => {
  const [input, setInput] = useState('');
  const [map, setMap] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  // Sample data for visualization
  const sampleInput = `{
  "firstName": "John",
  "lastName": "Doe",
  "emailAddress": "john@example.com",
  "phoneNumber": "123-456-7890",
  "age": 30
}`;
  const sampleMap = `{
  "firstName": "first_name",
  "lastName": "last_name",
  "emailAddress": "email",
  "phoneNumber": "phone"
}`;
  const sampleOutput = `{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "123-456-7890",
  "age": 30
}`;

  const handleRename = async () => {
    if (!input.trim() || !map.trim()) return;
    try {
      const result = await api.renameKeys(input, map);
      setOutput(result.success ? result.output : 'Error: ' + result.error);
    } catch (err) {
      setOutput('Error: ' + err.message);
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
      setMap('');
      setOutput('');
    }
  };

  const handleClear = () => {
    setInput('');
    setMap('');
    setOutput('');
    setHasInteracted(false);
  };

  const displayInput = !hasInteracted && !input ? sampleInput : input;
  const displayMap = !hasInteracted && !map ? sampleMap : map;
  const displayOutput = !hasInteracted && !output ? sampleOutput : output;
  const isSample = !hasInteracted && (!input || !map || !output);

  return (
    <Section
      title="Rename Keys"
      icon={Workflow}
      description="Apply standardized naming through controlled key mapping"
      actions={
        <>
          <motion.button
            onClick={handleRename}
            className="btn-primary-modern px-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Rename
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
      <TransformItem>
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
          
          {/* Sample interaction hint */}
          {isSample && (
            <p className="text-xs text-[var(--text-muted)] italic text-center mb-2">
              Sample data shown - Click in the input area to start editing
            </p>
          )}

          {/* Help Tooltip */}
          <AnimatePresence>
            {showHelp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="space-y-3 text-xs text-[var(--text-secondary)]">
                    <div>
                      <strong className="text-[var(--text-primary)] block mb-1">How It Works:</strong>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Renames keys recursively throughout nested structures</li>
                        <li>Works with nested objects and arrays</li>
                        <li>Keys not in the map remain unchanged</li>
                        <li>All occurrences of matching keys are renamed</li>
                      </ul>
                    </div>
                    
                    <div className="pt-2 border-t border-green-200 dark:border-green-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 1: Basic Renaming</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input JSON:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto">
                            {`{"firstName": "John", "lastName": "Doe", "age": 30}`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Rename Map:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto">
                            {`{"firstName": "first_name", "lastName": "last_name"}`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto">
                            {`{"first_name": "John", "last_name": "Doe", "age": 30}`}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-green-200 dark:border-green-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 2: Nested Objects</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input JSON:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "user": {
    "firstName": "John",
    "email": "john@example.com"
  },
  "settings": {
    "theme": "dark"
  }
}`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Rename Map:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto">
                            {`{"firstName": "first_name", "theme": "ui_theme"}`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output (renames at all levels):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "user": {
    "first_name": "John",
    "email": "john@example.com"
  },
  "settings": {
    "ui_theme": "dark"
  }
}`}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-green-200 dark:border-green-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 3: Arrays</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input JSON:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "users": [
    {"id": 1, "userName": "john"},
    {"id": 2, "userName": "jane"}
  ]
}`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Rename Map:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto">
                            {`{"userName": "username"}`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output (renames in array items):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "users": [
    {"id": 1, "username": "john"},
    {"id": 2, "username": "jane"}
  ]
}`}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 mt-3 p-2 bg-green-100 dark:bg-green-800/30 rounded">
                      <p className="text-[var(--text-primary)] font-semibold text-xs mb-1">💡 Tips:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Rename map format: <code className="px-1 py-0.5 bg-[var(--bg-secondary)] rounded">{`{"oldKey": "newKey"}`}</code></li>
                        <li>Use multiple mappings: <code className="px-1 py-0.5 bg-[var(--bg-secondary)] rounded">{`{"key1": "new1", "key2": "new2"}`}</code></li>
                        <li>Keys not in the map keep their original names</li>
                        <li>Works recursively on all nested levels</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <div>
                <Label className="text-xs text-[var(--text-muted)] mb-1 block">Input JSON</Label>
                <TextArea
                  value={displayInput}
                  onChange={(e) => {
                    if (!hasInteracted) {
                      setHasInteracted(true);
                      setInput('');
                      setMap('');
                      setOutput('');
                    }
                    setInput(e.target.value);
                  }}
                  onFocus={handleInputFocus}
                  onMouseDown={handleInputFocus}
                  placeholder="Enter JSON to rename keys..."
                  className={`min-h-[120px] ${isSample ? 'opacity-60 italic' : ''}`}
                  readOnly={isSample}
                  style={{ cursor: isSample ? 'pointer' : 'text' }}
                />
              </div>
              <div>
                <Label className="text-xs text-[var(--text-muted)] mb-1 block">Rename Map (JSON)</Label>
                <TextArea
                  value={displayMap}
                  onChange={(e) => {
                    if (!hasInteracted) {
                      setHasInteracted(true);
                      setInput('');
                      setMap('');
                      setOutput('');
                    }
                    setMap(e.target.value);
                  }}
                  onFocus={handleInputFocus}
                  onMouseDown={handleInputFocus}
                  placeholder='{"oldKey": "newKey", "anotherOld": "anotherNew"}'
                  className={`min-h-[80px] ${isSample ? 'opacity-60 italic' : ''}`}
                  title="JSON object mapping old keys to new keys"
                  readOnly={isSample}
                  style={{ cursor: isSample ? 'pointer' : 'text' }}
                />
              </div>
            </div>
            <div>
              <Label className="text-xs text-[var(--text-muted)] mb-1 block">Output JSON</Label>
              <TextArea
                value={displayOutput}
                readOnly
                placeholder="Renamed JSON will appear here..."
                className={`min-h-[200px] ${isSample ? 'opacity-60 italic' : ''}`}
              />
            </div>
          </div>
        </div>
      </TransformItem>
    </Section>
  );
};

// Transform Values Section Component
const TransformValuesSection = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [type, setType] = useState('uppercase');
  const [copied, setCopied] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  // Sample data for visualization
  const sampleInput = `{
  "name": "john doe",
  "email": "JOHN@EXAMPLE.COM",
  "description": "  hello world  ",
  "status": "active"
}`;
  const sampleOutput = `{
  "name": "JOHN DOE",
  "email": "JOHN@EXAMPLE.COM",
  "description": "  hello world  ",
  "status": "ACTIVE"
}`;

  const handleTransform = async () => {
    if (!input.trim()) return;
    try {
      const result = await api.transformValues(input, type);
      setOutput(result.success ? result.output : 'Error: ' + result.error);
    } catch (err) {
      setOutput('Error: ' + err.message);
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
  const displayOutput = !hasInteracted && !output ? sampleOutput : output;
  const isSample = !hasInteracted && (!input || !output);

  return (
    <Section
      title="Transform Values"
      icon={Workflow}
      description="Enforce value-level transformations for consistency: uppercase, lowercase, trim, or reverse"
      actions={
        <>
          <motion.button
            onClick={handleTransform}
            className="btn-primary-modern px-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Transform
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
      <TransformItem title="Transform Values" icon={Workflow}>
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
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800 mb-3">
                  <div className="space-y-3 text-xs text-[var(--text-secondary)]">
                    <div>
                      <strong className="text-[var(--text-primary)] block mb-1">How It Works:</strong>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Transforms all string values in the JSON object</li>
                        <li>Only affects string values (numbers, booleans, null are unchanged)</li>
                        <li>Works recursively through nested objects and arrays</li>
                        <li>Available transformations: Uppercase, Lowercase, Trim, Reverse</li>
                      </ul>
                    </div>
                    
                    <div className="pt-2 border-t border-indigo-200 dark:border-indigo-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 1: Uppercase</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "name": "john doe",
  "status": "active",
  "email": "user@example.com"
}`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output (Uppercase):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "name": "JOHN DOE",
  "status": "ACTIVE",
  "email": "USER@EXAMPLE.COM"
}`}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-indigo-200 dark:border-indigo-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 2: Trim</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "name": "  John Doe  ",
  "description": "  Hello World  ",
  "tag": "  important  "
}`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output (Trim):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "name": "John Doe",
  "description": "Hello World",
  "tag": "important"
}`}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-indigo-200 dark:border-indigo-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 3: Reverse</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "word": "hello",
  "code": "ABC123",
  "message": "Hello World"
}`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output (Reverse):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "word": "olleh",
  "code": "321CBA",
  "message": "dlroW olleH"
}`}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-indigo-200 dark:border-indigo-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 4: Nested Objects</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "user": {
    "name": "john",
    "role": "admin"
  },
  "status": "active"
}`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output (Lowercase):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "user": {
    "name": "john",
    "role": "admin"
  },
  "status": "active"
}`}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 mt-3 p-2 bg-indigo-100 dark:bg-indigo-800/30 rounded">
                      <p className="text-[var(--text-primary)] font-semibold text-xs mb-1">💡 Tips:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Uppercase: Converts all strings to uppercase (e.g., "hello" → "HELLO")</li>
                        <li>Lowercase: Converts all strings to lowercase (e.g., "HELLO" → "hello")</li>
                        <li>Trim: Removes leading and trailing whitespace (e.g., "  hello  " → "hello")</li>
                        <li>Reverse: Reverses the character order (e.g., "hello" → "olleh")</li>
                        <li>Non-string values (numbers, booleans, null, objects, arrays) are preserved as-is</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Select
            value={type}
            onChange={(e) => setType(e.target.value)}
            options={[
              { value: 'uppercase', label: 'Uppercase' },
              { value: 'lowercase', label: 'Lowercase' },
              { value: 'trim', label: 'Trim' },
              { value: 'reverse', label: 'Reverse' }
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
              placeholder="Enter JSON..."
              className={`min-h-[150px] ${isSample ? 'opacity-60 italic' : ''}`}
              readOnly={isSample}
              style={{ cursor: isSample ? 'pointer' : 'text' }}
            />
            <TextArea
              value={displayOutput}
              readOnly
              placeholder="Transformed JSON will appear here..."
              className={`min-h-[150px] ${isSample ? 'opacity-60 italic' : ''}`}
            />
          </div>
          {isSample && (
            <p className="text-xs text-[var(--text-muted)] italic text-center">
              Click in the input area to start editing
            </p>
          )}
        </div>
      </TransformItem>
    </Section>
  );
};

// Filter Fields Section Component
const FilterFieldsSection = () => {
  const [input, setInput] = useState('');
  const [fieldsList, setFieldsList] = useState('');
  const [output, setOutput] = useState('');
  const [format, setFormat] = useState('json');
  const [copied, setCopied] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  // Sample data for visualization
  const sampleInputJSON = `{
  "id": 1,
  "name": "John",
  "email": "john@example.com",
  "password": "secret123",
  "internalId": 999,
  "age": 30,
  "active": true
}`;
  const sampleFieldsList = 'password, email, internalId';
  const sampleOutputJSON = `{
  "id": 1,
  "name": "John",
  "age": 30,
  "active": true
}`;
  
  const sampleInputYAML = `id: 1
name: John
email: john@example.com
password: secret123
internalId: 999
age: 30
active: true`;
  
  const sampleOutputYAML = `id: 1
name: John
age: 30
active: true`;
  
  const getSampleInput = () => {
    return format === 'yaml' ? sampleInputYAML : sampleInputJSON;
  };

  const getSampleOutput = () => {
    return format === 'yaml' ? sampleOutputYAML : sampleOutputJSON;
  };

  const handleFilter = async () => {
    if (!input.trim() || !fieldsList.trim()) return;
    try {
      const result = await api.filterFields(input, format, format, fieldsList);
      setOutput(result.success ? result.output : 'Error: ' + result.error);
    } catch (err) {
      setOutput('Error: ' + err.message);
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
      setFieldsList('');
      setOutput('');
    }
  };

  const handleClear = () => {
    setInput('');
    setFieldsList('');
    setOutput('');
    setHasInteracted(false);
  };

  const displayInput = !hasInteracted && !input ? getSampleInput() : input;
  const displayFieldsList = !hasInteracted && !fieldsList ? sampleFieldsList : fieldsList;
  const displayOutput = !hasInteracted && !output ? getSampleOutput() : output;
  const isSample = !hasInteracted && (!input || !fieldsList || !output);

  return (
    <Section
      title="Filter / Remove Fields"
      icon={Workflow}
      description="Exclude non-compliant or sensitive field from JSON or YAML objects"
      actions={
        <>
          <motion.button
            onClick={handleFilter}
            className="btn-primary-modern px-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Enforce Field Policy
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
      <TransformItem title="Filter Fields" icon={Workflow}>
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
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 mb-3">
                  <div className="space-y-3 text-xs text-[var(--text-secondary)]">
                    <div>
                      <strong className="text-[var(--text-primary)] block mb-1">How It Works:</strong>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Removes specified fields from JSON/YAML objects</li>
                        <li>Works recursively through nested objects and arrays</li>
                        <li>Fields can be specified as comma-separated list or JSON array</li>
                        <li>All occurrences of the field are removed at any nesting level</li>
                      </ul>
                    </div>
                    
                    <div className="pt-2 border-t border-red-200 dark:border-red-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 1: Remove Sensitive Fields</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input JSON:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "id": 1,
  "name": "John",
  "email": "john@example.com",
  "password": "secret123",
  "age": 30
}`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Fields to Remove:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto">
                            password, email
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "id": 1,
  "name": "John",
  "age": 30
}`}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-red-200 dark:border-red-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 2: Nested Objects</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input JSON:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "user": {
    "name": "John",
    "internalId": 999,
    "email": "john@example.com"
  },
  "settings": {
    "theme": "dark",
    "internalConfig": "hidden"
  }
}`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Fields to Remove:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto">
                            internalId, internalConfig
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output (removed at all levels):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "user": {
    "name": "John",
    "email": "john@example.com"
  },
  "settings": {
    "theme": "dark"
  }
}`}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-red-200 dark:border-red-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 3: Arrays</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input JSON:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "users": [
    {"id": 1, "name": "John", "password": "pwd1"},
    {"id": 2, "name": "Jane", "password": "pwd2"}
  ]
}`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Fields to Remove:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto">
                            password
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output (removed from array items):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "users": [
    {"id": 1, "name": "John"},
    {"id": 2, "name": "Jane"}
  ]
}`}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 mt-3 p-2 bg-red-100 dark:bg-red-800/30 rounded">
                      <p className="text-[var(--text-primary)] font-semibold text-xs mb-1">💡 Tips:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Use comma-separated list: <code className="px-1 py-0.5 bg-[var(--bg-secondary)] rounded">password, email, id</code></li>
                        <li>Or use JSON array format: <code className="px-1 py-0.5 bg-[var(--bg-secondary)] rounded">["password", "email", "id"]</code></li>
                        <li>Great for removing sensitive data before sharing JSON/YAML</li>
                        <li>Works with both JSON and YAML formats</li>
                        <li>Fields are removed recursively from all nesting levels</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="flex gap-2">
            <Select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              options={[
                { value: 'json', label: 'JSON' },
                { value: 'yaml', label: 'YAML' }
              ]}
              className="input-modern w-auto"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <TextArea
                value={displayInput}
                onChange={(e) => {
                  if (!hasInteracted) {
                    setHasInteracted(true);
                    setInput('');
                    setFieldsList('');
                    setOutput('');
                  }
                  setInput(e.target.value);
                }}
                onFocus={handleInputFocus}
                onMouseDown={handleInputFocus}
                placeholder={`Enter ${format.toUpperCase()}...`}
                className={`min-h-[120px] ${isSample ? 'opacity-60 italic' : ''}`}
                readOnly={isSample}
                style={{ cursor: isSample ? 'pointer' : 'text' }}
              />
              <TextArea
                value={displayFieldsList}
                onChange={(e) => {
                  if (!hasInteracted) {
                    setHasInteracted(true);
                    setInput('');
                    setFieldsList('');
                    setOutput('');
                  }
                  setFieldsList(e.target.value);
                }}
                onFocus={handleInputFocus}
                onMouseDown={handleInputFocus}
                placeholder="Fields to remove (comma-separated): field1, field2"
                className={`min-h-[80px] ${isSample ? 'opacity-60 italic' : ''}`}
                readOnly={isSample}
                style={{ cursor: isSample ? 'pointer' : 'text' }}
              />
            </div>
            <TextArea
              value={displayOutput}
              readOnly
              placeholder={`Filtered ${format.toUpperCase()} will appear here...`}
              className={`min-h-[200px] ${isSample ? 'opacity-60 italic' : ''}`}
            />
          </div>
          {isSample && (
            <p className="text-xs text-[var(--text-muted)] italic text-center">
              Click in the input area to start editing
            </p>
          )}
        </div>
      </TransformItem>
    </Section>
  );
};

// Convert Types Section Component
const ConvertTypesSection = () => {
  const [input, setInput] = useState('');
  const [map, setMap] = useState('');
  const [output, setOutput] = useState('');
  const [format, setFormat] = useState('json');
  const [copied, setCopied] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  // Sample data for visualization
  const sampleInputJSON = `{
  "id": "123",
  "name": "John",
  "age": "30",
  "price": "99.99",
  "isActive": "true"
}`;
  const sampleMap = `{
  "id": "integer",
  "age": "integer",
  "price": "float",
  "isActive": "boolean"
}`;
  const sampleOutputJSON = `{
  "id": 123,
  "name": "John",
  "age": 30,
  "price": 99.99,
  "isActive": true
}`;
  
  const sampleInputYAML = `id: "123"
name: John
age: "30"
price: "99.99"
isActive: "true"`;
  
  const sampleOutputYAML = `id: 123
name: John
age: 30
price: 99.99
isActive: true`;
  
  const getSampleInput = () => {
    return format === 'yaml' ? sampleInputYAML : sampleInputJSON;
  };

  const getSampleOutput = () => {
    return format === 'yaml' ? sampleOutputYAML : sampleOutputJSON;
  };

  const handleConvert = async () => {
    if (!input.trim() || !map.trim()) return;
    try {
      const result = await api.convertTypes(input, format, format, map);
      setOutput(result.success ? result.output : 'Error: ' + result.error);
    } catch (err) {
      setOutput('Error: ' + err.message);
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
      setMap('');
      setOutput('');
    }
  };

  const handleClear = () => {
    setInput('');
    setMap('');
    setOutput('');
    setHasInteracted(false);
  };

  const displayInput = !hasInteracted && !input ? getSampleInput() : input;
  const displayMap = !hasInteracted && !map ? sampleMap : map;
  const displayOutput = !hasInteracted && !output ? getSampleOutput() : output;
  const isSample = !hasInteracted && (!input || !map || !output);

  return (
    <Section
      title="Convert Types"
      icon={Workflow}
      description="Enforce explicit type normalization using type mapping (string → integer, etc.) - Supports JSON and YAML"
      actions={
        <>
          <motion.button
            onClick={handleConvert}
            className="btn-primary-modern px-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Convert
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
      <TransformItem title="Convert Types" icon={Workflow}>
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
                <div className="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border border-cyan-200 dark:border-cyan-800 mb-3">
                  <div className="space-y-3 text-xs text-[var(--text-secondary)]">
                    <div>
                      <strong className="text-[var(--text-primary)] block mb-1">How It Works:</strong>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Converts data types in JSON/YAML objects based on a type map</li>
                        <li>Type map maps field names to target types (integer, float, boolean, null)</li>
                        <li>Works recursively through nested objects and arrays</li>
                        <li>Only fields specified in the type map are converted</li>
                      </ul>
                    </div>
                    
                    <div className="pt-2 border-t border-cyan-200 dark:border-cyan-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 1: Basic Type Conversion</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input JSON:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "id": "123",
  "name": "John",
  "age": "30",
  "price": "99.99",
  "isActive": "true"
}`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Type Map:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "id": "integer",
  "age": "integer",
  "price": "float",
  "isActive": "boolean"
}`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "id": 123,
  "name": "John",
  "age": 30,
  "price": 99.99,
  "isActive": true
}`}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-cyan-200 dark:border-cyan-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 2: Nested Objects</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input JSON:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "user": {
    "id": "456",
    "age": "25",
    "score": "87.5"
  },
  "settings": {
    "enabled": "false"
  }
}`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Type Map:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "id": "integer",
  "age": "integer",
  "score": "float",
  "enabled": "boolean"
}`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output (converts at all levels):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "user": {
    "id": 456,
    "age": 25,
    "score": 87.5
  },
  "settings": {
    "enabled": false
  }
}`}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-cyan-200 dark:border-cyan-700">
                      <strong className="text-[var(--text-primary)] block mb-2">Example 3: Arrays</strong>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Input JSON:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "items": [
    {"id": "1", "quantity": "10", "price": "19.99"},
    {"id": "2", "quantity": "5", "price": "9.99"}
  ]
}`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Type Map:</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "id": "integer",
  "quantity": "integer",
  "price": "float"
}`}
                          </code>
                        </div>
                        <div>
                          <p className="text-[var(--text-muted)] mb-1">Output (converts in array items):</p>
                          <code className="block p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto whitespace-pre">
{`{
  "items": [
    {"id": 1, "quantity": 10, "price": 19.99},
    {"id": 2, "quantity": 5, "price": 9.99}
  ]
}`}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 mt-3 p-2 bg-cyan-100 dark:bg-cyan-800/30 rounded">
                      <p className="text-[var(--text-primary)] font-semibold text-xs mb-1">💡 Supported Types:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li><strong>integer</strong>: Converts string to integer (e.g., "123" → 123)</li>
                        <li><strong>float</strong>: Converts string to floating-point number (e.g., "99.99" → 99.99)</li>
                        <li><strong>boolean</strong>: Converts string to boolean (e.g., "true" → true, "false" → false)</li>
                        <li><strong>null</strong>: Converts string "null" to null value</li>
                        <li>Type map must be a JSON object mapping field names to target types</li>
                        <li>Works with both JSON and YAML formats</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="flex gap-2">
            <Select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              options={[
                { value: 'json', label: 'JSON' },
                { value: 'yaml', label: 'YAML' }
              ]}
              className="input-modern w-auto"
            />
          </div>
          {isSample && (
            <p className="text-xs text-[var(--text-muted)] italic text-center">
              Sample data shown - Click in the input area to start editing
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <TextArea
                value={displayInput}
                onChange={(e) => {
                  if (!hasInteracted) {
                    setHasInteracted(true);
                    setInput('');
                    setMap('');
                    setOutput('');
                  }
                  setInput(e.target.value);
                }}
                onFocus={handleInputFocus}
                onMouseDown={handleInputFocus}
                placeholder={`Enter ${format.toUpperCase()}...`}
                className={`min-h-[120px] ${isSample ? 'opacity-60 italic' : ''}`}
                readOnly={isSample}
                style={{ cursor: isSample ? 'pointer' : 'text' }}
              />
              <TextArea
                value={displayMap}
                onChange={(e) => {
                  if (!hasInteracted) {
                    setHasInteracted(true);
                    setInput('');
                    setMap('');
                    setOutput('');
                  }
                  setMap(e.target.value);
                }}
                onFocus={handleInputFocus}
                onMouseDown={handleInputFocus}
                placeholder='Type map (JSON): {"field": "integer", "price": "float"}'
                className={`min-h-[80px] ${isSample ? 'opacity-60 italic' : ''}`}
                title="Type map must be JSON object mapping field names to target types"
                readOnly={isSample}
                style={{ cursor: isSample ? 'pointer' : 'text' }}
              />
            </div>
            <TextArea
              value={displayOutput}
              readOnly
              placeholder={`Converted ${format.toUpperCase()} will appear here...`}
              className={`min-h-[200px] ${isSample ? 'opacity-60 italic' : ''}`}
            />
          </div>
        </div>
      </TransformItem>
    </Section>
  );
};

// TOON Statistics Section Component
const ToonStatisticsSection = () => {
  const [input, setInput] = useState('');
  const [format, setFormat] = useState('json');
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatOptions = [
    { value: 'json', label: 'JSON' },
    { value: 'yaml', label: 'YAML' },
    { value: 'xml', label: 'XML' },
    { value: 'toml', label: 'TOML' },
    { value: 'csv', label: 'CSV' },
    { value: 'properties', label: 'Properties' }
  ];

  const handleAnalyze = async () => {
    if (!input.trim()) {
      setError('Please enter input data');
      return;
    }

    setLoading(true);
    setError('');
    setStatistics(null);

    try {
      const result = await api.toonStatistics(input, format);
      if (result.success) {
        setStatistics(result);
      } else {
        setError(result.error || 'Failed to calculate statistics');
      }
    } catch (err) {
      setError(err.message || 'Failed to analyze TOON efficiency');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInput('');
    setStatistics(null);
    setError('');
  };

  return (
    <Section
      title="TOON Statistics & Token Analysis"
      icon={BarChart3}
      description="Analyze token efficiency and size impact for optimized transport format"
      defaultExpanded={false}
      actions={
        <>
          <motion.button
            onClick={handleAnalyze}
            disabled={loading || !input.trim()}
            className="btn-primary-modern px-4 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: loading || !input.trim() ? 1 : 1.02 }}
            whileTap={{ scale: loading || !input.trim() ? 1 : 0.98 }}
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw className="w-4 h-4" />
                </motion.div>
                Analyzing...
              </>
            ) : (
              <>
                <BarChart3 className="w-4 h-4" />
                Analyze
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
      <div className="space-y-4">
        {/* Input Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Label htmlFor="statistics-format" className="block mb-2 text-sm font-semibold text-[var(--text-primary)]">
                Original Format
              </Label>
              <Select
                id="statistics-format"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                options={formatOptions}
                className="input-modern w-auto"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="statistics-input" className="block mb-2 text-sm font-semibold text-[var(--text-primary)]">
              Input Data
            </Label>
            <TextArea
              id="statistics-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your data in the selected format to analyze TOON efficiency..."
              className="textarea-modern min-h-[200px]"
            />
          </div>
        </div>

        {/* Error Message */}
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
        </AnimatePresence>

        {/* Statistics Display */}
        <AnimatePresence>
          {statistics && statistics.success && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="p-4 bg-gradient-to-br from-primary-50/50 to-secondary-50/50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl border border-[var(--border-color)]">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingDown className="w-5 h-5 text-primary-500" />
                  <h4 className="text-lg font-semibold text-[var(--text-primary)]">Efficiency Analysis</h4>
                </div>

                {/* Comparison Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Original Format Stats */}
                  <div className="p-4 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-color)]">
                    <div className="text-xs text-[var(--text-muted)] mb-2 uppercase tracking-wide">
                      Original ({statistics.originalFormat?.toUpperCase() || 'N/A'})
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-[var(--text-secondary)]">Tokens:</span>
                        <span className="text-lg font-semibold text-[var(--text-primary)]">
                          {statistics.originalStats?.tokens?.toLocaleString() || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-[var(--text-secondary)]">Size:</span>
                        <span className="text-lg font-semibold text-[var(--text-primary)]">
                          {statistics.originalStats?.size?.toLocaleString() || 0} chars
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-[var(--text-secondary)]">Lines:</span>
                        <span className="text-lg font-semibold text-[var(--text-primary)]">
                          {statistics.originalStats?.lines?.toLocaleString() || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* TOON Format Stats */}
                  <div className="p-4 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-color)]">
                    <div className="text-xs text-[var(--text-muted)] mb-2 uppercase tracking-wide">
                      TOON Format
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-[var(--text-secondary)]">Tokens:</span>
                        <span className="text-lg font-semibold text-[var(--text-primary)]">
                          {statistics.toonStats?.tokens?.toLocaleString() || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-[var(--text-secondary)]">Size:</span>
                        <span className="text-lg font-semibold text-[var(--text-primary)]">
                          {statistics.toonStats?.size?.toLocaleString() || 0} chars
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-[var(--text-secondary)]">Lines:</span>
                        <span className="text-lg font-semibold text-[var(--text-primary)]">
                          {statistics.toonStats?.lines?.toLocaleString() || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reduction Metrics */}
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingDown className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <h5 className="text-base font-semibold text-[var(--text-primary)]">Savings</h5>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {statistics.reduction?.tokensPercent?.toFixed(1) || 0}%
                      </div>
                      <div className="text-xs text-[var(--text-muted)] mt-1">
                        Token Reduction
                      </div>
                      <div className="text-xs text-[var(--text-secondary)] mt-0.5">
                        {statistics.reduction?.tokens > 0 ? '-' : '+'}{Math.abs(statistics.reduction?.tokens || 0).toLocaleString()} tokens
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {statistics.reduction?.sizePercent?.toFixed(1) || 0}%
                      </div>
                      <div className="text-xs text-[var(--text-muted)] mt-1">
                        Size Reduction
                      </div>
                      <div className="text-xs text-[var(--text-secondary)] mt-0.5">
                        {statistics.reduction?.size > 0 ? '-' : '+'}{Math.abs(statistics.reduction?.size || 0).toLocaleString()} chars
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {statistics.reduction?.linesPercent?.toFixed(1) || 0}%
                      </div>
                      <div className="text-xs text-[var(--text-muted)] mt-1">
                        Line Reduction
                      </div>
                      <div className="text-xs text-[var(--text-secondary)] mt-0.5">
                        {statistics.reduction?.lines > 0 ? '-' : '+'}{Math.abs(statistics.reduction?.lines || 0).toLocaleString()} lines
                      </div>
                    </div>
                  </div>
                </div>

                {/* Efficiency Metrics */}
                {statistics.efficiency && (
                  <div className="mt-4 p-3 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)]">
                    <div className="text-xs text-[var(--text-muted)] mb-2">Efficiency Metrics</div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--text-secondary)]">Compression Ratio:</span>
                      <span className="text-sm font-semibold text-[var(--text-primary)]">
                        {statistics.efficiency.compressionRatio?.toFixed(3) || 'N/A'}
                      </span>
                    </div>
                  </div>
                )}

                {/* LLM API Cost Projections */}
                {statistics.costProjections && (
                  <div className="mt-4 p-4 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-2 mb-3">
                      <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      <h5 className="text-base font-semibold text-[var(--text-primary)]">LLM API Cost Savings</h5>
                    </div>
                    
                    <div className="mb-3 p-2 bg-purple-100/50 dark:bg-purple-800/30 rounded text-xs text-purple-800 dark:text-purple-200">
                      <strong>How Token Reduction Helps:</strong> LLM APIs charge based on tokens used. 
                      Reducing tokens by {statistics.reduction?.tokensPercent?.toFixed(1) || 0}% means 
                      {statistics.reduction?.tokens > 0 ? ' saving ' + statistics.reduction.tokens.toLocaleString() + ' tokens per request.' : ' significant cost savings.'}
                      {' '}This directly translates to lower API costs, faster responses, and better rate limits.
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-2">
                        Estimated Cost Savings (per 1,000 requests)
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {statistics.costProjections.gpt4 && (
                          <div className="p-2 bg-[var(--bg-primary)] rounded border border-[var(--border-color)]">
                            <div className="text-xs font-semibold text-[var(--text-primary)] mb-1">
                              {statistics.costProjections.gpt4.providerName}
                            </div>
                            <div className="text-lg font-bold text-green-600 dark:text-green-400">
                              ${statistics.costProjections.gpt4.savingsPer1000Requests?.toFixed(2) || '0.00'}
                            </div>
                            <div className="text-xs text-[var(--text-muted)]">
                              Monthly: ${statistics.costProjections.gpt4.monthlySavings?.toFixed(2) || '0.00'}
                            </div>
                          </div>
                        )}
                        
                        {statistics.costProjections.gpt35 && (
                          <div className="p-2 bg-[var(--bg-primary)] rounded border border-[var(--border-color)]">
                            <div className="text-xs font-semibold text-[var(--text-primary)] mb-1">
                              {statistics.costProjections.gpt35.providerName}
                            </div>
                            <div className="text-lg font-bold text-green-600 dark:text-green-400">
                              ${statistics.costProjections.gpt35.savingsPer1000Requests?.toFixed(2) || '0.00'}
                            </div>
                            <div className="text-xs text-[var(--text-muted)]">
                              Monthly: ${statistics.costProjections.gpt35.monthlySavings?.toFixed(2) || '0.00'}
                            </div>
                          </div>
                        )}
                        
                        {statistics.costProjections.claudeHaiku && (
                          <div className="p-2 bg-[var(--bg-primary)] rounded border border-[var(--border-color)]">
                            <div className="text-xs font-semibold text-[var(--text-primary)] mb-1">
                              {statistics.costProjections.claudeHaiku.providerName}
                            </div>
                            <div className="text-lg font-bold text-green-600 dark:text-green-400">
                              ${statistics.costProjections.claudeHaiku.savingsPer1000Requests?.toFixed(2) || '0.00'}
                            </div>
                            <div className="text-xs text-[var(--text-muted)]">
                              Monthly: ${statistics.costProjections.claudeHaiku.monthlySavings?.toFixed(2) || '0.00'}
                            </div>
                          </div>
                        )}
                        
                        {statistics.costProjections.claudeSonnet && (
                          <div className="p-2 bg-[var(--bg-primary)] rounded border border-[var(--border-color)]">
                            <div className="text-xs font-semibold text-[var(--text-primary)] mb-1">
                              {statistics.costProjections.claudeSonnet.providerName}
                            </div>
                            <div className="text-lg font-bold text-green-600 dark:text-green-400">
                              ${statistics.costProjections.claudeSonnet.savingsPer1000Requests?.toFixed(2) || '0.00'}
                            </div>
                            <div className="text-xs text-[var(--text-muted)]">
                              Monthly: ${statistics.costProjections.claudeSonnet.monthlySavings?.toFixed(2) || '0.00'}
                            </div>
                          </div>
                        )}
                        
                        {statistics.costProjections.claudeOpus && (
                          <div className="p-2 bg-[var(--bg-primary)] rounded border border-[var(--border-color)]">
                            <div className="text-xs font-semibold text-[var(--text-primary)] mb-1">
                              {statistics.costProjections.claudeOpus.providerName}
                            </div>
                            <div className="text-lg font-bold text-green-600 dark:text-green-400">
                              ${statistics.costProjections.claudeOpus.savingsPer1000Requests?.toFixed(2) || '0.00'}
                            </div>
                            <div className="text-xs text-[var(--text-muted)]">
                              Monthly: ${statistics.costProjections.claudeOpus.monthlySavings?.toFixed(2) || '0.00'}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
                      <div className="text-xs text-yellow-800 dark:text-yellow-200">
                        <strong>Key Benefits:</strong>
                        <ul className="list-disc list-inside mt-1 space-y-0.5">
                          <li>Lower API costs: Fewer tokens = lower charges per request</li>
                          <li>Faster processing: Less data to process = quicker responses</li>
                          <li>Better rate limits: More requests possible within token limits</li>
                          <li>Scalability: Significant savings at high volume (thousands of requests)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Note */}
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    <strong>Note:</strong> Token counts are estimated using a conservative ratio of ~4 characters per token, 
                    which works well for most LLM models (GPT, Claude, etc.). Actual token counts may vary by model. 
                    Cost projections are estimates based on average pricing (as of 2024) and assume input/output token costs are similar.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
};

export default Converter;
