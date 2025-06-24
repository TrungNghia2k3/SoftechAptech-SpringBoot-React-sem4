package com.ntn.ecommerce.exception;

import java.util.Map;

import lombok.Getter;

@Getter
public class MissingImageException extends RuntimeException {
    private final Map<String, String> errors;

    public MissingImageException(Map<String, String> errors) {
        super("Missing required images");
        this.errors = errors;
    }
}
