package com.ntn.ecommerce.controller;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/images")
public class ImageController {

    private final String productImageDirectory = "images/upload/product/";
    private final String categoryImageDirectory = "images/upload/category/";

    @GetMapping("/product/{productId}/{imageName:.+}")
    public ResponseEntity<Resource> getProductImage(@PathVariable String productId, @PathVariable String imageName)
            throws MalformedURLException {
        return getImageResource(productImageDirectory, productId, imageName);
    }

    @GetMapping("/category/{categoryId}/{imageName:.+}")
    public ResponseEntity<Resource> getCategoryImage(@PathVariable Long categoryId, @PathVariable String imageName)
            throws MalformedURLException {
        return getImageResource(categoryImageDirectory, categoryId.toString(), imageName);
    }

    private ResponseEntity<Resource> getImageResource(String imageDirectory, String entityId, String imageName)
            throws MalformedURLException {
        Path imagePath = Paths.get(imageDirectory).resolve(entityId).resolve(imageName);
        Resource resource = new UrlResource(imagePath.toUri());
        if (resource.exists() && resource.isReadable()) {
            String contentType = determineContentType(imageName);
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    private String determineContentType(String fileName) {
        if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) {
            return "image/jpeg";
        } else if (fileName.endsWith(".png")) {
            return "image/png";
        } else if (fileName.endsWith(".gif")) {
            return "image/gif";
        }
        // Mặc định trả về image/jpeg nếu không xác định được định dạng
        return "image/jpeg";
    }
}
