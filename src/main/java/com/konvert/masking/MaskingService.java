package com.konvert.masking;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.FormulaEvaluator;
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

import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
                maskParagraph(paragraph, accumulator, types);
            }
            for (XWPFTable table : document.getTables()) {
                for (XWPFTableRow row : table.getRows()) {
                    for (XWPFTableCell cell : row.getTableCells()) {
                        for (XWPFParagraph paragraph : cell.getParagraphs()) {
                            maskParagraph(paragraph, accumulator, types);
                        }
                    }
                }
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            document.write(out);
            return new MaskingResult(out.toByteArray(), null, outputFilename, "docx", accumulator.total(), accumulator.counts(), null);
        }
    }

    private void maskParagraph(XWPFParagraph paragraph, MaskingAccumulator accumulator, EnumSet<MaskingType> types) {
        if (paragraph == null) {
            return;
        }
        List<XWPFRun> runs = paragraph.getRuns();
        if (runs == null || runs.isEmpty()) {
            return;
        }
        String text = collectRunText(runs);
        if (text == null || text.isEmpty()) {
            return;
        }
        MaskingOutcome outcome = masker.maskText(text, types);
        accumulator.add(outcome);
        distributeMaskedText(runs, text.length(), outcome.getText());
    }

    private void clearRunText(XWPFRun run) {
        if (run == null) {
            return;
        }
        int textCount = run.getCTR() != null ? run.getCTR().sizeOfTArray() : 0;
        if (textCount == 0) {
            run.setText("", 0);
            return;
        }
        for (int i = textCount - 1; i >= 0; i--) {
            run.setText("", i);
        }
    }

    private String collectRunText(List<XWPFRun> runs) {
        StringBuilder full = new StringBuilder();
        for (XWPFRun run : runs) {
            if (run == null || run.getCTR() == null) {
                continue;
            }
            int count = run.getCTR().sizeOfTArray();
            if (count == 0) {
                String first = run.getText(0);
                if (first != null) {
                    full.append(first);
                }
                continue;
            }
            for (int i = 0; i < count; i++) {
                String part = run.getText(i);
                if (part != null) {
                    full.append(part);
                }
            }
        }
        return full.toString();
    }

    private void distributeMaskedText(List<XWPFRun> runs, int originalLength, String maskedText) {
        if (runs == null || runs.isEmpty()) {
            return;
        }
        int index = 0;
        for (int i = 0; i < runs.size(); i++) {
            XWPFRun run = runs.get(i);
            int runLen = getRunTextLength(run);
            if (runLen == 0) {
                continue;
            }
            int remaining = maskedText.length() - index;
            int take = Math.min(runLen, Math.max(0, remaining));
            String chunk = take > 0 ? maskedText.substring(index, index + take) : "";
            clearRunText(run);
            run.setText(chunk, 0);
            index += take;
        }
        if (index < maskedText.length()) {
            XWPFRun last = runs.get(runs.size() - 1);
            String existing = last.getText(0);
            String tail = maskedText.substring(index);
            clearRunText(last);
            last.setText((existing == null ? "" : existing) + tail, 0);
        } else if (maskedText.length() < originalLength) {
            for (XWPFRun run : runs) {
                if (run != null) {
                    clearRunText(run);
                }
            }
            runs.get(0).setText(maskedText, 0);
        }
    }

    private int getRunTextLength(XWPFRun run) {
        if (run == null || run.getCTR() == null) {
            return 0;
        }
        int count = run.getCTR().sizeOfTArray();
        if (count == 0) {
            String text = run.getText(0);
            return text == null ? 0 : text.length();
        }
        int len = 0;
        for (int i = 0; i < count; i++) {
            String part = run.getText(i);
            if (part != null) {
                len += part.length();
            }
        }
        return len;
    }

    private MaskingResult maskExcel(MultipartFile file, String outputFilename, EnumSet<MaskingType> types) throws Exception {
        MaskingAccumulator accumulator = new MaskingAccumulator();
        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            DataFormatter formatter = new DataFormatter();
            FormulaEvaluator evaluator = workbook.getCreationHelper().createFormulaEvaluator();
            for (Sheet sheet : workbook) {
                Map<Integer, MaskingType> headerTypes = new HashMap<>();
                int headerRowIndex = -1;
                for (Row row : sheet) {
                    if (headerRowIndex == -1) {
                        boolean foundAny = false;
                        for (Cell cell : row) {
                            String header = formatter.formatCellValue(cell, evaluator);
                            if (header != null && !header.isBlank()) {
                                foundAny = true;
                            }
                            MaskingType type = masker.detectTypeFromKey(header);
                            if (type != null) {
                                headerTypes.put(cell.getColumnIndex(), type);
                            }
                        }
                        if (foundAny) {
                            headerRowIndex = row.getRowNum();
                            continue;
                        }
                        if (!foundAny) {
                            continue;
                        }
                    }
                    for (Cell cell : row) {
                        if (cell.getCellType() == CellType.BLANK) {
                            continue;
                        }
                        String value = formatter.formatCellValue(cell, evaluator);
                        if (value == null || value.isBlank()) {
                            continue;
                        }

                        MaskingType headerType = headerTypes.get(cell.getColumnIndex());
                        MaskingOutcome outcome;
                        if (headerType != null) {
                            String masked = masker.maskValue(value, headerType);
                            outcome = new MaskingOutcome(masked, java.util.Map.of(headerType.name().toLowerCase(), 1), 1);
                        } else {
                            outcome = masker.maskText(value, types);
                        }
                        String maskedValue = outcome.getText();
                        boolean changed = !maskedValue.equals(value);

                        if (!changed && isNumericCell(cell)) {
                            String rawNumeric = toPlainNumericString(cell.getNumericCellValue());
                            if (rawNumeric != null && !rawNumeric.isBlank() && !rawNumeric.equals(value)) {
                                MaskingOutcome numericOutcome = masker.maskText(rawNumeric, types);
                                if (numericOutcome.getTotal() > 0 && !numericOutcome.getText().equals(rawNumeric)) {
                                    outcome = numericOutcome;
                                    maskedValue = numericOutcome.getText();
                                    changed = true;
                                }
                            }
                        }

                        if (changed) {
                            cell.setCellValue(maskedValue);
                            accumulator.add(outcome);
                        }
                    }
                }
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return new MaskingResult(out.toByteArray(), null, outputFilename, "xlsx", accumulator.total(), accumulator.counts(), null);
        }
    }

    private boolean isNumericCell(Cell cell) {
        CellType cellType = cell.getCellType();
        if (cellType == CellType.NUMERIC) {
            return true;
        }
        if (cellType == CellType.FORMULA) {
            return cell.getCachedFormulaResultType() == CellType.NUMERIC;
        }
        return false;
    }

    private String toPlainNumericString(double value) {
        java.math.BigDecimal decimal = java.math.BigDecimal.valueOf(value);
        String raw = decimal.stripTrailingZeros().toPlainString();
        if (raw.endsWith(".0")) {
            return raw.substring(0, raw.length() - 2);
        }
        return raw;
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
                } else if (fieldAware && (child instanceof String || child instanceof Number)) {
                    String masked = masker.maskGeneric(child.toString());
                    out.put(key, masked);
                    accumulator.add(new MaskingOutcome(masked, java.util.Map.of("generic", 1), 1));
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
                String masked = masker.maskGeneric(value.toString());
                accumulator.add(new MaskingOutcome(masked, java.util.Map.of("generic", 1), 1));
                return masked;
            }
            MaskingOutcome outcome = masker.maskText(value.toString(), types);
            accumulator.add(outcome);
            return outcome.getText();
        }
        if (value instanceof Number) {
            if (fieldAware) {
                String masked = masker.maskGeneric(value.toString());
                accumulator.add(new MaskingOutcome(masked, java.util.Map.of("generic", 1), 1));
                return masked;
            }
            String text = value.toString();
            MaskingOutcome outcome = masker.maskText(text, types);
            accumulator.add(outcome);
            return outcome.getText();
        }
        return value;
    }

}
