package com.devteria.identityservice.utilities;

import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Component
public class ImageUtilities {

    public String saveFile(String entityType, String entityId, String fileName, MultipartFile multipartFile) throws IOException {
        // Construct upload directory based on entity type and entity ID
        String uploadDir = getUploadDir(entityType, entityId);

        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate a unique file code
        String fileCode = RandomStringUtils.randomAlphanumeric(8);

        // Save the new file
        try (InputStream inputStream = multipartFile.getInputStream()) {
            Path filePath = uploadPath.resolve(fileCode + "-" + fileName);
            Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException ioe) {
            throw new IOException("Could not save file: " + fileName, ioe);
        }

        return fileCode + "-" + fileName;
    }

    public void deleteFile(String entityType, String entityId, String fileName) throws IOException {
        // Construct upload directory based on entity type and entity ID
        String uploadDir = getUploadDir(entityType, entityId);

        // Delete the file
        Path filePath = Paths.get(uploadDir).resolve(fileName);
        if (Files.exists(filePath)) {
            Files.delete(filePath);
        }
    }

    private String getUploadDir(String entityType, String entityId) {
        String uploadDir = "";
        if ("product".equalsIgnoreCase(entityType)) {
            uploadDir = "images/upload/product/" + entityId;
        } else if ("category".equalsIgnoreCase(entityType)) {
            uploadDir = "images/upload/category/" + entityId;
        } else {
            throw new IllegalArgumentException("Unsupported entity type: " + entityType);
        }
        return uploadDir;
    }
}
