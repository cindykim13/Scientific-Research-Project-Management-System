package com.researchsystem.backend.util;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Paths;
import java.util.Locale;
import java.util.Set;

public final class AttachmentUploadWhitelist {

    private static final Set<String> ALLOWED_EXTENSIONS =
            Set.of("pdf", "doc", "docx");

    private static final Set<String> ALLOWED_MIME_TYPES =
            Set.of(
                    "application/pdf",
                    "application/msword",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            );

    private AttachmentUploadWhitelist() {}

    /**
     * Validates both the declared MIME type and the file extension.
     * If either does not match the allowlist, throws HTTP 415.
     */
    public static String validateAndNormalizeContentType(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File must not be empty");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "Unsupported file name");
        }

        String baseName = Paths.get(originalFilename).getFileName().toString();
        String extension = extractExtensionLower(baseName);
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new ResponseStatusException(
                    HttpStatus.UNSUPPORTED_MEDIA_TYPE,
                    "Unsupported file extension. Allowed: pdf, doc, docx"
            );
        }

        String contentType = file.getContentType();
        if (contentType == null || contentType.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "Unsupported content type");
        }

        // Remove optional charset/parameters: "application/pdf; charset=binary"
        contentType = contentType.toLowerCase(Locale.ROOT).split(";")[0].trim();
        if (!ALLOWED_MIME_TYPES.contains(contentType)) {
            throw new ResponseStatusException(
                    HttpStatus.UNSUPPORTED_MEDIA_TYPE,
                    "Unsupported MIME type. Allowed: application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            );
        }

        return contentType;
    }

    private static String extractExtensionLower(String filename) {
        String name = filename == null ? "" : filename;
        int dot = name.lastIndexOf('.');
        if (dot < 0 || dot == name.length() - 1) return "";
        return name.substring(dot + 1).toLowerCase(Locale.ROOT);
    }
}

