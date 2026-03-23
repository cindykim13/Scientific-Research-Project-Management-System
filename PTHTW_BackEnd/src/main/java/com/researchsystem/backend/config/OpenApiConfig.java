package com.researchsystem.backend.config;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

/**
 * OpenAPI / Swagger UI global configuration.
 *
 * Spring Boot 4.0 auto-configures only tools.jackson.databind.json.JsonMapper (Jackson 3.x).
 * springdoc-openapi 2.6.0 requires com.fasterxml.jackson.databind.ObjectMapper (Jackson 2.x)
 * for its ObjectMapperProvider. Without this bean the /v3/api-docs endpoint throws
 * NoSuchBeanDefinitionException which surfaces as HTTP 500.
 */
@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "Research Management API",
                version = "v1",
                description = "REST API for the Research Topic Management System — covers topic lifecycle, " +
                              "council evaluation, user management, and audit trail.",
                contact = @Contact(
                        name = "Research System Team",
                        email = "support@researchsystem.com"
                ),
                license = @License(
                        name = "MIT License",
                        url = "https://opensource.org/licenses/MIT"
                )
        ),
        servers = {
                @Server(url = "http://localhost:8080", description = "Local Development"),
                @Server(url = "https://api.researchsystem.com", description = "Production")
        }
)
@SecurityScheme(
        name = "Bearer Authentication",
        type = SecuritySchemeType.HTTP,
        bearerFormat = "JWT",
        scheme = "bearer",
        in = SecuritySchemeIn.HEADER,
        description = "Provide a valid JWT token obtained from POST /api/v1/auth/login. " +
                      "Format: Authorization: Bearer <token>"
)
public class OpenApiConfig {

    @Bean
    @Primary
    public ObjectMapper objectMapper() {
        return new ObjectMapper()
                .registerModule(new JavaTimeModule())
                .configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false)
                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }
}
