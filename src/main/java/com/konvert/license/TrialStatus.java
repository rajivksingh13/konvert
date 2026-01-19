package com.konvert.license;

public class TrialStatus {
    private boolean valid;
    private String message;
    private Integer daysRemaining;
    private int trialDays;
    private String machineId;
    private String extensionUrl;
    private String supportEmail;

    public TrialStatus() {}

    public TrialStatus(boolean valid, String message, Integer daysRemaining, int trialDays, String machineId, String extensionUrl, String supportEmail) {
        this.valid = valid;
        this.message = message;
        this.daysRemaining = daysRemaining;
        this.trialDays = trialDays;
        this.machineId = machineId;
        this.extensionUrl = extensionUrl;
        this.supportEmail = supportEmail;
    }

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Integer getDaysRemaining() {
        return daysRemaining;
    }

    public void setDaysRemaining(Integer daysRemaining) {
        this.daysRemaining = daysRemaining;
    }

    public int getTrialDays() {
        return trialDays;
    }

    public void setTrialDays(int trialDays) {
        this.trialDays = trialDays;
    }

    public String getMachineId() {
        return machineId;
    }

    public void setMachineId(String machineId) {
        this.machineId = machineId;
    }

    public String getExtensionUrl() {
        return extensionUrl;
    }

    public void setExtensionUrl(String extensionUrl) {
        this.extensionUrl = extensionUrl;
    }

    public String getSupportEmail() {
        return supportEmail;
    }

    public void setSupportEmail(String supportEmail) {
        this.supportEmail = supportEmail;
    }
}
