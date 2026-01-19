package com.konvert.controller;

import com.konvert.license.TrialManager;
import com.konvert.license.TrialStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/trial")
public class TrialController {
    private final TrialManager trialManager;

    public TrialController(TrialManager trialManager) {
        this.trialManager = trialManager;
    }

    @GetMapping("/status")
    public ResponseEntity<TrialStatus> status() {
        return ResponseEntity.ok(trialManager.getTrialStatus());
    }
}
