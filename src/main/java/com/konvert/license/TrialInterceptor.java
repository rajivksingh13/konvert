package com.konvert.license;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
public class TrialInterceptor implements HandlerInterceptor {
    private final TrialManager trialManager;
    private final ObjectMapper mapper = new ObjectMapper();

    public TrialInterceptor(TrialManager trialManager) {
        this.trialManager = trialManager;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException {
        TrialStatus status = trialManager.getTrialStatus();
        if (status.isValid()) {
            return true;
        }

        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json");
        Map<String, Object> body = new HashMap<>();
        body.put("error", "Trial expired");
        body.put("message", status.getMessage());
        body.put("trialExpired", true);
        body.put("daysRemaining", status.getDaysRemaining());
        body.put("extensionUrl", status.getExtensionUrl());
        body.put("supportEmail", status.getSupportEmail());
        mapper.writeValue(response.getWriter(), body);
        return false;
    }
}
