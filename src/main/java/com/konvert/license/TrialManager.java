package com.konvert.license;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.Map;

@Component
public class TrialManager {
    private static final String APP_NAME = "KonvertR";
    private static final String TRIAL_FILE_NAME = "trial_data.json";

    private final ObjectMapper mapper = new ObjectMapper();
    private final Path trialDataFile;
    private final String machineId;
    private final TrialConfig config;

    public TrialManager(TrialConfig config) {
        this.trialDataFile = getTrialDataPath();
        this.machineId = getMachineId();
        this.config = config;
    }

    public TrialStatus getTrialStatus() {
        if (!config.isEnabled()) {
            return new TrialStatus(true, "Trial disabled.", null, config.getDays(), maskedMachineId(), config.getExtensionUrl(), config.getSupportEmail());
        }
        Map<String, String> data = loadTrialData();
        if (!Files.exists(trialDataFile) || !data.containsKey("machine_id") || !data.containsKey("start_date")) {
            TrialStatus initStatus = initializeTrial();
            return initStatus;
        }

        String storedMachineId = data.getOrDefault("machine_id", "");
        if (!storedMachineId.equals(machineId)) {
            return initializeTrial();
        }

        String encryptedStart = data.getOrDefault("start_date", "");
        if (encryptedStart.isBlank()) {
            return initializeTrial();
        }

        String startDateStr = decrypt(encryptedStart);
        if (startDateStr.isBlank()) {
            return initializeTrial();
        }

        try {
            LocalDateTime startDate = LocalDateTime.parse(startDateStr);
            long elapsedDays = Duration.between(startDate, LocalDateTime.now()).toDays();
            int daysRemaining = config.getDays() - (int) elapsedDays;

            if (daysRemaining <= 0) {
                return new TrialStatus(false,
                        "Trial period has expired. This software was activated " + elapsedDays + " day(s) ago.",
                        null,
                        config.getDays(),
                        maskedMachineId(),
                        config.getExtensionUrl(),
                        config.getSupportEmail());
            }

            return new TrialStatus(true,
                    "Trial active. " + daysRemaining + " day(s) remaining.",
                    daysRemaining,
                    config.getDays(),
                    maskedMachineId(),
                    config.getExtensionUrl(),
                    config.getSupportEmail());
        } catch (DateTimeParseException ex) {
            return initializeTrial();
        }
    }

    public TrialStatus initializeTrial() {
        LocalDateTime startDate = LocalDateTime.now();
        Map<String, String> data = new HashMap<>();
        data.put("machine_id", machineId);
        data.put("start_date", encrypt(startDate.toString()));
        data.put("initialized", "true");

        boolean saved = saveTrialData(data);
        String message = saved
                ? "Trial period started. You have " + config.getDays() + " days to use this software."
                : "Failed to initialize trial period. Please check file permissions. Path: " + trialDataFile;

        return new TrialStatus(saved, message, config.getDays(), config.getDays(), maskedMachineId(), config.getExtensionUrl(), config.getSupportEmail());
    }

    private Path getTrialDataPath() {
        String osName = System.getProperty("os.name", "").toLowerCase();
        String userHome = System.getProperty("user.home");

        Path baseDir;
        if (osName.contains("win")) {
            String appData = System.getenv("APPDATA");
            baseDir = appData != null
                    ? Paths.get(appData, APP_NAME)
                    : Paths.get(userHome, ".konvertr");
        } else if (osName.contains("mac")) {
            baseDir = Paths.get(userHome, "Library", "Application Support", APP_NAME);
        } else {
            baseDir = Paths.get(userHome, ".config", APP_NAME);
        }

        try {
            Files.createDirectories(baseDir);
        } catch (IOException ignored) {
        }

        return baseDir.resolve(TRIAL_FILE_NAME);
    }

    private String getMachineId() {
        String mac = "unknown";
        try {
            InetAddress localHost = InetAddress.getLocalHost();
            NetworkInterface network = NetworkInterface.getByInetAddress(localHost);
            if (network != null && network.getHardwareAddress() != null) {
                byte[] macBytes = network.getHardwareAddress();
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < macBytes.length; i++) {
                    sb.append(String.format("%02x", macBytes[i]));
                    if (i < macBytes.length - 1) {
                        sb.append(":");
                    }
                }
                mac = sb.toString();
            }
        } catch (Exception ignored) {
        }

        String machineName = "unknown";
        try {
            machineName = InetAddress.getLocalHost().getHostName();
        } catch (Exception ignored) {
        }

        String platformInfo = System.getProperty("os.name", "unknown") + "-" + System.getProperty("os.arch", "unknown");
        String combined = mac + "-" + machineName + "-" + platformInfo;

        return HashUtils.sha256Hex(combined).substring(0, 16);
    }

    private Map<String, String> loadTrialData() {
        if (!Files.exists(trialDataFile)) {
            return new HashMap<>();
        }

        try {
            byte[] bytes = Files.readAllBytes(trialDataFile);
            return mapper.readValue(bytes, new TypeReference<Map<String, String>>() {});
        } catch (IOException ex) {
            return new HashMap<>();
        }
    }

    private boolean saveTrialData(Map<String, String> data) {
        try {
            Files.createDirectories(trialDataFile.getParent());
            mapper.writerWithDefaultPrettyPrinter().writeValue(trialDataFile.toFile(), data);
            return true;
        } catch (IOException ex) {
            return false;
        }
    }

    private String encrypt(String value) {
        String key = machineId;
        char[] output = new char[value.length()];
        for (int i = 0; i < value.length(); i++) {
            output[i] = (char) (value.charAt(i) ^ key.charAt(i % key.length()));
        }
        byte[] bytes = new String(output).getBytes(StandardCharsets.ISO_8859_1);
        StringBuilder hex = new StringBuilder();
        for (byte b : bytes) {
            hex.append(String.format("%02x", b));
        }
        return hex.toString();
    }

    private String decrypt(String hex) {
        try {
            int len = hex.length();
            byte[] bytes = new byte[len / 2];
            for (int i = 0; i < len; i += 2) {
                bytes[i / 2] = (byte) Integer.parseInt(hex.substring(i, i + 2), 16);
            }
            String encrypted = new String(bytes, StandardCharsets.ISO_8859_1);
            String key = machineId;
            char[] output = new char[encrypted.length()];
            for (int i = 0; i < encrypted.length(); i++) {
                output[i] = (char) (encrypted.charAt(i) ^ key.charAt(i % key.length()));
            }
            return new String(output);
        } catch (Exception ex) {
            return "";
        }
    }

    private String maskedMachineId() {
        if (machineId.length() <= 8) {
            return machineId;
        }
        return machineId.substring(0, 8) + "...";
    }
}
