package com.devteria.identityservice.controller;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/audio")
public class AudioController {

    @GetMapping("/product/{productId}/{audioName:.+}")
    public ResponseEntity<Resource> getProductAudio(@PathVariable String productId, @PathVariable String audioName)
            throws MalformedURLException {
        return getAudioResource(productId, audioName);
    }

    private ResponseEntity<Resource> getAudioResource(String productId, String audioName)
            throws MalformedURLException {
        Path audioPath = Paths.get("audio/product/").resolve(productId).resolve(audioName);
        Resource resource = new UrlResource(audioPath.toUri());
        if (resource.exists() && resource.isReadable()) {
            String contentType = determineAudioContentType(audioName);
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    private String determineAudioContentType(String fileName) {
        if (fileName.endsWith(".mp3")) {
            return "audio/mpeg";
        } else if (fileName.endsWith(".wav")) {
            return "audio/wav";
        }
        // Mặc định trả về audio/mpeg nếu không xác định được định dạng
        return "audio/mpeg";
    }
}
