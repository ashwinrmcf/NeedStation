package com.example.authbackend.config;

import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.config.MeterFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;

@Configuration
public class MonitoringConfig {

    @Value("${spring.application.name:needstation-backend}")
    private String applicationName;

    @Value("${spring.profiles.active:development}")
    private String activeProfile;

    @Autowired(required = false)
    private MeterRegistry meterRegistry;

    @PostConstruct
    public void configureMetrics() {
        if (meterRegistry != null) {
            meterRegistry.config()
                .commonTags("application", applicationName)
                .commonTags("environment", activeProfile)
                .meterFilter(MeterFilter.denyNameStartsWith("jvm.gc.pause"))
                .meterFilter(MeterFilter.deny(id -> {
                    String name = id.getName();
                    return name.startsWith("http.server.requests") && 
                           id.getTag("uri") != null && (
                               id.getTag("uri").startsWith("/actuator") ||
                               id.getTag("uri").startsWith("/swagger") ||
                               id.getTag("uri").startsWith("/v3/api-docs")
                           );
                }));
        }
    }
}
