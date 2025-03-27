package com.devteria.identityservice.exception;

import lombok.Getter;

import java.util.Map;

@Getter
public class MissingImageException extends RuntimeException {
    private final Map<String, String> errors;

    public MissingImageException(Map<String, String> errors) {
        super("Missing required images");
        this.errors = errors;
    }

}
