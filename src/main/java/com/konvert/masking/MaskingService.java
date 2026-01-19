package com.konvert.masking;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.apache.poi.xwpf.usermodel.XWPFTable;
import org.apache.poi.xwpf.usermodel.XWPFTableCell;
import org.apache.poi.xwpf.usermodel.XWPFTableRow;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.util.EnumSet;
import java.util.List;

@Service
public class MaskingService {
    private final SensitiveDataMasker masker = new SensitiveDataMasker();
    private final ObjectMapper jsonMapper = new ObjectMapper();
    private final YAMLMapper yamlMapper = new YAMLMapper();
    private static class MaskingAccumulator {
        private final java.util.Map<String, Integer> totals = new java.util.HashMap<>();

        MaskingAccumulator() {
            for (MaskingType type : MaskingType.values()) {
                totals.put(type.name().toLowerCase(), 0);
            }
        }

        void add(MaskingOutcome outcome) {
            if (outcome == null || outcome.getCounts() == null) {
                return;
            }
            for (var entry : outcome.getCounts().entrySet()) {
                totals.put(entry.getKey(), totals.getOrDefault(entry.getKey(), 0) + entry.getValue());
            }
        }

        int total() {
            return totals.values().stream().mapToInt(Integer::intValue).sum();
        }

        java.util.Map<String, Integer> counts() {
            return totals;
        }
    }

    public MaskingResult maskFile(MultipartFile file, String format, String outputFilename, EnumSet<MaskingType> types, boolean fieldAware) throws Exception {
        String normalized = format == null ? "unknown" : format.toLowerCase();

        switch (normalized) {
            case "docx":
                return maskDocx(file, outputFilename, types);
            case "xlsx":
            case "xls":
                return maskExcel(file, outputFilename, types);
            case "pdf":
                return maskPdf(file, outputFilename, types);
            case "json":
                return maskStructured(file, outputFilename, types, fieldAware, true);
            case "yaml":
            case "yml":
                return maskStructured(file, outputFilename, types, fieldAware, false);
            default:
                return maskText(file, outputFilename, normalized, types);
        }
    }

    private MaskingResult maskText(MultipartFile file, String outputFilename, String detectedFormat, EnumSet<MaskingType> types) throws Exception {
        String content = new String(file.getBytes(), StandardCharsets.UTF_8);
        MaskingOutcome outcome = masker.maskText(content, types);
        byte[] bytes = outcome.getText().getBytes(StandardCharsets.UTF_8);
        return new MaskingResult(bytes, outcome.getText(), outputFilename, detectedFormat, outcome.getTotal(), outcome.getCounts(), null);
    }

    private MaskingResult maskDocx(MultipartFile file, String outputFilename, EnumSet<MaskingType> types) throws Exception {
        MaskingAccumulator accumulator = new MaskingAccumulator();
        try (XWPFDocument document = new XWPFDocument(file.getInputStream())) {
            for (XWPFParagraph paragraph : document.getParagraphs()) {
                maskRuns(paragraph.getRuns(), accumulator, types);
            }
            for (XWPFTable table : document.getTables()) {
                for (XWPFTableRow row : table.getRows()) {
                    for (XWPFTableCell cell : row.getTableCells()) {
                        for (XWPFParagraph paragraph : cell.getParagraphs()) {
                            maskRuns(paragraph.getRuns(), accumulator, types);
                        }
                    }
                }
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            document.write(out);
            return new MaskingResult(out.toByteArray(), null, outputFilename, "docx", accumulator.total(), accumulator.counts(), null);
        }
    }

    private void maskRuns(List<XWPFRun> runs, MaskingAccumulator accumulator, EnumSet<MaskingType> types) {
        if (runs == null) {
            return;
        }
        for (XWPFRun run : runs) {
            String text = run.getText(0);
            if (text != null && !text.isEmpty()) {
                MaskingOutcome outcome = masker.maskText(text, types);
                run.setText(outcome.getText(), 0);
                accumulator.add(outcome);
            }
        }
    }

    private MaskingResult maskExcel(MultipartFile file, String outputFilename, EnumSet<MaskingType> types) throws Exception {
        MaskingAccumulator accumulator = new MaskingAccumulator();
        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            for (Sheet sheet : workbook) {
                for (Row row : sheet) {
                    for (Cell cell : row) {
                        if (cell.getCellType() == CellType.STRING) {
                            String value = cell.getStringCellValue();
                            MaskingOutcome outcome = masker.maskText(value, types);
                            cell.setCellValue(outcome.getText());
                            accumulator.add(outcome);
                        } else if (cell.getCellType() == CellType.NUMERIC) {
                            String value = String.valueOf((long) cell.getNumericCellValue());
                            if (value.length() >= 8) {
                                MaskingOutcome outcome = masker.maskText(value, types);
                                cell.setCellValue(outcome.getText());
                                accumulator.add(outcome);
                            }
                        }
                    }
                }
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return new MaskingResult(out.toByteArray(), null, outputFilename, "xlsx", accumulator.total(), accumulator.counts(), null);
        }
    }

    private MaskingResult maskPdf(MultipartFile file, String outputFilename, EnumSet<MaskingType> types) throws Exception {
        try (PDDocument document = PDDocument.load(new ByteArrayInputStream(file.getBytes()))) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);
            MaskingOutcome outcome = masker.maskText(text, types);

            PDDocument outDoc = new PDDocument();
            PDPage page = new PDPage(PDRectangle.LETTER);
            outDoc.addPage(page);
            try (PDPageContentStream contentStream = new PDPageContentStream(outDoc, page)) {
                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA, 10);
                contentStream.newLineAtOffset(40, 750);
                for (String line : outcome.getText().split("\\r?\\n")) {
                    contentStream.showText(line);
                    contentStream.newLineAtOffset(0, -12);
                }
                contentStream.endText();
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            outDoc.save(out);
            outDoc.close();
            return new MaskingResult(out.toByteArray(), outcome.getText(), outputFilename, "pdf", outcome.getTotal(), outcome.getCounts(),
                    "Masked PDF is regenerated as plain text; original layout may not be preserved.");
        }
    }

    private MaskingResult maskStructured(MultipartFile file, String outputFilename, EnumSet<MaskingType> types, boolean fieldAware, boolean isJson) throws Exception {
        String content = new String(file.getBytes(), StandardCharsets.UTF_8);
        ObjectMapper mapper = isJson ? jsonMapper : yamlMapper;
        Object data = mapper.readValue(content, Object.class);
        MaskingAccumulator accumulator = new MaskingAccumulator();
        Object masked = maskStructuredValue(data, accumulator, types, fieldAware);
        String output = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(masked);
        byte[] bytes = output.getBytes(StandardCharsets.UTF_8);
        String format = isJson ? "json" : "yaml";
        return new MaskingResult(bytes, output, outputFilename, format, accumulator.total(), accumulator.counts(), null);
    }

    private Object maskStructuredValue(Object value, MaskingAccumulator accumulator, EnumSet<MaskingType> types, boolean fieldAware) {
        if (value instanceof java.util.Map) {
            java.util.Map<?, ?> map = (java.util.Map<?, ?>) value;
            java.util.Map<String, Object> out = new java.util.LinkedHashMap<>();
            for (var entry : map.entrySet()) {
                String key = entry.getKey() == null ? "" : entry.getKey().toString();
                Object child = entry.getValue();
                MaskingType type = fieldAware ? masker.detectTypeFromKey(key) : null;
                if (type != null && types.contains(type)) {
                    String masked = masker.maskValue(child, type);
                    out.put(key, masked);
                    accumulator.add(new MaskingOutcome(masked, java.util.Map.of(type.name().toLowerCase(), 1), 1));
                } else {
                    out.put(key, maskStructuredValue(child, accumulator, types, fieldAware));
                }
            }
            return out;
        }
        if (value instanceof java.util.List) {
            java.util.List<?> list = (java.util.List<?>) value;
            java.util.List<Object> out = new java.util.ArrayList<>();
            for (Object child : list) {
                out.add(maskStructuredValue(child, accumulator, types, fieldAware));
            }
            return out;
        }
        if (value instanceof String) {
            if (fieldAware) {
                return value;
            }
            MaskingOutcome outcome = masker.maskText(value.toString(), types);
            accumulator.add(outcome);
            return outcome.getText();
        }
        if (value instanceof Number) {
            if (fieldAware) {
                return value;
            }
            String text = value.toString();
            MaskingOutcome outcome = masker.maskText(text, types);
            accumulator.add(outcome);
            return outcome.getText();
        }
        return value;
    }

}
