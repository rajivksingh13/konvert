const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  }

  // Trial
  async getTrialStatus() {
    return this.request('/trial/status', {
      method: 'GET'
    });
  }

  // Converter
  async convert(input, fromFormat, toFormat, protobufSchema = null) {
    return this.request('/convert', {
      method: 'POST',
      body: JSON.stringify({
        input,
        fromFormat,
        toFormat,
        protobufSchema: protobufSchema || null
      })
    });
  }

  // Formatter
  async format(input, formatType, delimiterOrAlignColumns = false) {
    const body = {
      input,
      formatType
    };
    
    if (formatType === 'TOON' && delimiterOrAlignColumns) {
      body.delimiter = delimiterOrAlignColumns;
    } else if (formatType === 'CSV') {
      body.alignColumns = delimiterOrAlignColumns;
    }
    
    return this.request('/format', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  // Base64
  async base64Encode(input) {
    return this.request('/base64/encode', {
      method: 'POST',
      body: JSON.stringify({ input })
    });
  }

  async base64Decode(input) {
    return this.request('/base64/decode', {
      method: 'POST',
      body: JSON.stringify({ input })
    });
  }

  // File Upload
  async uploadFile(file, fromFormat, toFormat, protobufSchema = null) {
    const formData = new FormData();
    formData.append('file', file);
    if (fromFormat) formData.append('fromFormat', fromFormat);
    if (toFormat) formData.append('toFormat', toFormat);
    if (protobufSchema) formData.append('protobufSchema', protobufSchema);

    const response = await fetch(`${API_BASE_URL}/files/upload`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }
    return data;
  }

  async maskFile(file, format = '', types = [], fieldAware = false) {
    const formData = new FormData();
    formData.append('file', file);
    if (format) formData.append('format', format);
    if (types && types.length) formData.append('types', types.join(','));
    formData.append('fieldAware', fieldAware ? 'true' : 'false');

    const response = await fetch(`${API_BASE_URL}/mask/file`, {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }
    return data;
  }

  // Encoding/Decoding
  async urlEncode(input) {
    return this.request('/utilities/url/encode', {
      method: 'POST',
      body: JSON.stringify({ input })
    });
  }

  async urlDecode(input) {
    return this.request('/utilities/url/decode', {
      method: 'POST',
      body: JSON.stringify({ input })
    });
  }

  async htmlEncode(input) {
    return this.request('/utilities/html/encode', {
      method: 'POST',
      body: JSON.stringify({ input })
    });
  }

  async htmlDecode(input) {
    return this.request('/utilities/html/decode', {
      method: 'POST',
      body: JSON.stringify({ input })
    });
  }

  async hexEncode(input) {
    return this.request('/utilities/hex/encode', {
      method: 'POST',
      body: JSON.stringify({ input })
    });
  }

  async hexDecode(input) {
    return this.request('/utilities/hex/decode', {
      method: 'POST',
      body: JSON.stringify({ input })
    });
  }

  // JWT
  async jwtDecode(token) {
    return this.request('/utilities/jwt/decode', {
      method: 'POST',
      body: JSON.stringify({ input: token })
    });
  }

  // UUID
  async generateUUID(version, count) {
    return this.request('/utilities/uuid/generate', {
      method: 'POST',
      body: JSON.stringify({ version, count })
    });
  }

  // Hash
  async generateHash(input, algorithm) {
    return this.request('/utilities/hash/generate', {
      method: 'POST',
      body: JSON.stringify({ input, algorithm })
    });
  }

  // Validation
  async validateSchema(input, format) {
    return this.request('/validate', {
      method: 'POST',
      body: JSON.stringify({ input, format })
    });
  }

  // Diff
  async compareFiles(file1, file2, format) {
    return this.request('/diff/compare', {
      method: 'POST',
      body: JSON.stringify({ input1: file1, input2: file2, format })
    });
  }

  async getDiffReport(comparisonResult) {
    return this.request('/diff/report', {
      method: 'POST',
      body: JSON.stringify({ comparisonResult })
    });
  }

  // Minify
  async minify(input, format) {
    return this.request('/minify', {
      method: 'POST',
      body: JSON.stringify({ input, format })
    });
  }

  // Beautify CSS
  async beautifyCss(input) {
    return this.request('/beautify/css', {
      method: 'POST',
      body: JSON.stringify({ input })
    });
  }

  // Gzip
  async compressGzip(input) {
    return this.request('/compress/gzip', {
      method: 'POST',
      body: JSON.stringify({ input })
    });
  }

  async decompressGzip(input) {
    return this.request('/decompress/gzip', {
      method: 'POST',
      body: JSON.stringify({ input })
    });
  }

  // Remove Comments
  async removeComments(input, format) {
    return this.request('/remove-comments', {
      method: 'POST',
      body: JSON.stringify({ input, format })
    });
  }

  // Transformations
  async mergeJson(inputs) {
    return this.request('/utilities/transform/merge', {
      method: 'POST',
      body: JSON.stringify({ inputs })
    });
  }

  async flatten(input, inputFormat, outputFormat, separator) {
    return this.request('/utilities/transform/flatten', {
      method: 'POST',
      body: JSON.stringify({ input, inputFormat, outputFormat, separator })
    });
  }

  async unflatten(input, inputFormat, outputFormat, separator) {
    return this.request('/utilities/transform/unflatten', {
      method: 'POST',
      body: JSON.stringify({ input, inputFormat, outputFormat, separator })
    });
  }

  async renameKeys(input, renameMap) {
    return this.request('/utilities/transform/rename-keys', {
      method: 'POST',
      body: JSON.stringify({ input, renameMap })
    });
  }

  async transformValues(input, transformation) {
    return this.request('/utilities/transform/transform-values', {
      method: 'POST',
      body: JSON.stringify({ input, transformation })
    });
  }

  async filterFields(input, inputFormat, outputFormat, fieldsToRemove) {
    return this.request('/utilities/transform/filter-fields', {
      method: 'POST',
      body: JSON.stringify({ input, inputFormat, outputFormat, fieldsToRemove })
    });
  }

  async convertTypes(input, inputFormat, outputFormat, typeMap) {
    return this.request('/utilities/transform/convert-types', {
      method: 'POST',
      body: JSON.stringify({ input, inputFormat, outputFormat, typeMap })
    });
  }

  // TOON Statistics
  async toonStatistics(input, originalFormat) {
    return this.request('/toon/statistics', {
      method: 'POST',
      body: JSON.stringify({ input, originalFormat })
    });
  }
}

const apiService = new ApiService();
export default apiService;

