package com.konvert.license;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class TrialWebConfig implements WebMvcConfigurer {
    private final TrialInterceptor trialInterceptor;

    public TrialWebConfig(TrialInterceptor trialInterceptor) {
        this.trialInterceptor = trialInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(trialInterceptor)
                .addPathPatterns("/api/**")
                .excludePathPatterns("/api/health", "/api/trial/status");
    }
}
