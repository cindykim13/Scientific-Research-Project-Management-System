package com.researchsystem.backend.config;

import org.springframework.context.annotation.Configuration;

/**
 * Web MVC configuration.
 *
 * CORS is handled exclusively by Spring Security's CorsFilter, registered via
 * SecurityConfig.corsConfigurationSource(). That bean maps "/**" with
 * allowedOriginPatterns("*"), covering all API and springdoc paths.
 *
 * Defining an additional WebMvcConfigurer.addCorsMappings() would create a
 * second, lower-priority CORS pass that conflicts with the security-layer filter
 * in Spring Security 7.x, potentially producing duplicate CORS headers.
 */
@Configuration
public class WebConfig {
}
