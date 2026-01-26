package com.konvert.controller;

import com.konvert.masking.MaskingResult;
import com.konvert.masking.MaskingService;
import com.konvert.masking.MaskingType;
import com.konvert.util.FileFormatDetector;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/mask")
@CrossOrigin(origins = "*")
public class MaskingController {
    private final MaskingService maskingService;

    public MaskingController(MaskingService maskingService) {
        this.maskingService = maskingService;
    }

    @PostMapping("/file")
    public ResponseEntity<Map<String, Object>> maskFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "format", required = false) String format,
            @RequestParam(value = "types", required = false) String types,
            @RequestParam(value = "fieldAware", required = false) Boolean fieldAware) {
        Map<String, Object> response = new HashMap<>();

        try {
            if (file == null || file.isEmpty()) {
                response.put("success", false);
                response.put("error", "No file uploaded");
                return ResponseEntity.badRequest().body(response);
            }

            String originalFilename = file.getOriginalFilename();
            String detectedFormat = format;
            if (detectedFormat == null || detectedFormat.trim().isEmpty()) {
                detectedFormat = FileFormatDetector.detectFromFilename(originalFilename);
            }
            if (detectedFormat == null || "unknown".equals(detectedFormat)) {
                detectedFormat = "txt";
            }
            if ("pdf".equalsIgnoreCase(detectedFormat)) {
                response.put("success", false);
                response.put("error", "PDF masking is temporarily disabled. Please use another format.");
                return ResponseEntity.badRequest().body(response);
            }

            String outputFilename = buildMaskedFilename(originalFilename, detectedFormat);
            EnumSet<MaskingType> typeSet = parseTypes(types);
            boolean fieldAwareEnabled = fieldAware != null ? fieldAware : ("json".equals(detectedFormat) || "yaml".equals(detectedFormat) || "yml".equals(detectedFormat));

            MaskingResult result = maskingService.maskFile(file, detectedFormat, outputFilename, typeSet, fieldAwareEnabled);
            String base64 = Base64.getEncoder().encodeToString(result.getOutputBytes());

            response.put("success", true);
            response.put("originalFilename", originalFilename);
            response.put("outputFilename", result.getOutputFilename());
            response.put("detectedFormat", result.getDetectedFormat());
            response.put("maskedCount", result.getMaskedCount());
            response.put("counts", result.getCounts());
            response.put("warning", result.getWarning());
            response.put("base64Content", base64);

            if (result.getOutputText() != null) {
                response.put("content", result.getOutputText());
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    private String buildMaskedFilename(String originalFilename, String detectedFormat) {
        String base = originalFilename == null || originalFilename.isBlank() ? "masked" : originalFilename;
        int dot = base.lastIndexOf('.');
        String stem = dot > 0 ? base.substring(0, dot) : base;
        String ext = FileFormatDetector.getExtensionForFormat(detectedFormat);
        return stem + "_masked" + ext;
    }

    private EnumSet<MaskingType> parseTypes(String types) {
        if (types == null || types.isBlank()) {
            return EnumSet.allOf(MaskingType.class);
        }
        EnumSet<MaskingType> result = EnumSet.noneOf(MaskingType.class);
        for (String raw : types.split(",")) {
            MaskingType.fromString(raw).ifPresent(result::add);
        }
        return result.isEmpty() ? EnumSet.allOf(MaskingType.class) : result;
    }
}
