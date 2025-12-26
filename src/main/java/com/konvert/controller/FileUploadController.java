package com.konvert.controller;

import com.konvert.FormatConverter;
import com.konvert.util.FileFormatDetector;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.util.*;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "*")
public class FileUploadController {
    
    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "fromFormat", required = false) String fromFormat,
            @RequestParam(value = "toFormat", required = false) String toFormat,
            @RequestParam(value = "protobufSchema", required = false) String protobufSchema) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (file == null || file.isEmpty()) {
                response.put("success", false);
                response.put("error", "No file uploaded");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Read file content
            String content = new String(file.getBytes(), StandardCharsets.UTF_8);
            String originalFilename = file.getOriginalFilename();
            
            // Auto-detect format if not provided
            if (fromFormat == null || fromFormat.trim().isEmpty()) {
                fromFormat = FileFormatDetector.detectFromFilename(originalFilename);
                if ("unknown".equals(fromFormat)) {
                    fromFormat = FileFormatDetector.detectFromContent(content);
                }
            }
            
            if ("unknown".equals(fromFormat)) {
                response.put("success", false);
                response.put("error", "Could not detect file format. Please specify the source format.");
                return ResponseEntity.badRequest().body(response);
            }
            
            // If toFormat not provided, try to infer from common conversions
            if (toFormat == null || toFormat.trim().isEmpty()) {
                // Default conversions based on source format
                switch (fromFormat.toLowerCase()) {
                    case "json":
                        toFormat = "yaml";
                        break;
                    case "yaml":
                    case "yml":
                        toFormat = "json";
                        break;
                    case "xml":
                        toFormat = "json";
                        break;
                    case "csv":
                        toFormat = "json";
                        break;
                    default:
                        toFormat = "json";
                }
            }
            
            // Check for Protobuf schema requirement
            if (("protobuf".equals(fromFormat) || "protobuf".equals(toFormat)) 
                && (protobufSchema == null || protobufSchema.trim().isEmpty())) {
                response.put("success", false);
                response.put("error", "Protobuf schema is required for Protobuf conversions");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Perform conversion
            String convertedContent = FormatConverter.convert(content, fromFormat, toFormat, protobufSchema);
            
            // Generate output filename
            String outputFilename = FileFormatDetector.changeExtension(
                originalFilename, 
                FileFormatDetector.getExtensionForFormat(toFormat)
            );
            
            // Encode content as base64 for transmission
            String base64Content = Base64.getEncoder().encodeToString(
                convertedContent.getBytes(StandardCharsets.UTF_8)
            );
            
            response.put("success", true);
            response.put("originalFilename", originalFilename);
            response.put("outputFilename", outputFilename);
            response.put("detectedFormat", fromFormat);
            response.put("convertedFormat", toFormat);
            response.put("content", convertedContent);
            response.put("base64Content", base64Content);
            response.put("size", convertedContent.length());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @PostMapping("/upload-batch")
    public ResponseEntity<Map<String, Object>> uploadBatch(
            @RequestParam("files") MultipartFile[] files,
            @RequestParam(value = "fromFormat", required = false) String fromFormat,
            @RequestParam(value = "toFormat", required = false) String toFormat,
            @RequestParam(value = "protobufSchema", required = false) String protobufSchema) {
        
        Map<String, Object> response = new HashMap<>();
        List<Map<String, Object>> results = new ArrayList<>();
        
        try {
            if (files == null || files.length == 0) {
                response.put("success", false);
                response.put("error", "No files uploaded");
                return ResponseEntity.badRequest().body(response);
            }
            
            int successCount = 0;
            int errorCount = 0;
            
            for (MultipartFile file : files) {
                Map<String, Object> fileResult = new HashMap<>();
                
                try {
                    if (file.isEmpty()) {
                        fileResult.put("success", false);
                        fileResult.put("error", "Empty file");
                        fileResult.put("filename", file.getOriginalFilename());
                        results.add(fileResult);
                        errorCount++;
                        continue;
                    }
                    
                    String content = new String(file.getBytes(), StandardCharsets.UTF_8);
                    String originalFilename = file.getOriginalFilename();
                    
                    // Auto-detect format for each file if not provided
                    String detectedFromFormat = fromFormat;
                    if (detectedFromFormat == null || detectedFromFormat.trim().isEmpty()) {
                        detectedFromFormat = FileFormatDetector.detectFromFilename(originalFilename);
                        if ("unknown".equals(detectedFromFormat)) {
                            detectedFromFormat = FileFormatDetector.detectFromContent(content);
                        }
                    }
                    
                    String detectedToFormat = toFormat;
                    if (detectedToFormat == null || detectedToFormat.trim().isEmpty()) {
                        switch (detectedFromFormat.toLowerCase()) {
                            case "json":
                                detectedToFormat = "yaml";
                                break;
                            case "yaml":
                            case "yml":
                                detectedToFormat = "json";
                                break;
                            default:
                                detectedToFormat = "json";
                        }
                    }
                    
                    if ("unknown".equals(detectedFromFormat)) {
                        fileResult.put("success", false);
                        fileResult.put("error", "Could not detect file format");
                        fileResult.put("filename", originalFilename);
                        results.add(fileResult);
                        errorCount++;
                        continue;
                    }
                    
                    // Perform conversion
                    String convertedContent = FormatConverter.convert(
                        content, detectedFromFormat, detectedToFormat, protobufSchema
                    );
                    
                    String outputFilename = FileFormatDetector.changeExtension(
                        originalFilename,
                        FileFormatDetector.getExtensionForFormat(detectedToFormat)
                    );
                    
                    String base64Content = Base64.getEncoder().encodeToString(
                        convertedContent.getBytes(StandardCharsets.UTF_8)
                    );
                    
                    fileResult.put("success", true);
                    fileResult.put("originalFilename", originalFilename);
                    fileResult.put("outputFilename", outputFilename);
                    fileResult.put("detectedFormat", detectedFromFormat);
                    fileResult.put("convertedFormat", detectedToFormat);
                    fileResult.put("content", convertedContent);
                    fileResult.put("base64Content", base64Content);
                    fileResult.put("size", convertedContent.length());
                    
                    results.add(fileResult);
                    successCount++;
                    
                } catch (Exception e) {
                    fileResult.put("success", false);
                    fileResult.put("error", e.getMessage());
                    fileResult.put("filename", file.getOriginalFilename());
                    results.add(fileResult);
                    errorCount++;
                }
            }
            
            response.put("success", true);
            response.put("results", results);
            response.put("totalFiles", files.length);
            response.put("successCount", successCount);
            response.put("errorCount", errorCount);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @PostMapping("/download")
    public ResponseEntity<byte[]> downloadFile(@RequestBody Map<String, String> request) {
        try {
            String content = request.get("content");
            String filename = request.get("filename");
            
            if (content == null || filename == null) {
                return ResponseEntity.badRequest().build();
            }
            
            byte[] fileContent = content.getBytes(StandardCharsets.UTF_8);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", filename);
            headers.setContentLength(fileContent.length);
            
            return ResponseEntity.ok()
                .headers(headers)
                .body(fileContent);
                
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

