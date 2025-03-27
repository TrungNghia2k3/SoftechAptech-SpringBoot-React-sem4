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
public class AudioUtilities {

    public String saveAudioFile(String entityId, String fileName, MultipartFile multipartFile) throws IOException {
        // Construct the upload directory for audio files
        String uploadDir = "audio/product/" + entityId;

        // Create the upload directory if it doesn't exist
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
            throw new IOException("Could not save audio file: " + fileName, ioe);
        }

        return fileCode + "-" + fileName;
    }

    public void deleteAudioFile(String entityId, String fileName) throws IOException {
        // Construct the upload directory for audio files
        String uploadDir = "audio/product/" + entityId;

        // Delete the audio file
        Path filePath = Paths.get(uploadDir).resolve(fileName);
        if (Files.exists(filePath)) {
            Files.delete(filePath);
        } else {
            throw new IOException("Audio file not found: " + fileName);
        }
    }

}
