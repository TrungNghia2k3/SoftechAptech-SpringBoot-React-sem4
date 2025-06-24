package com.ntn.ecommerce.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.*;

import com.ntn.ecommerce.dto.response.ApiResponse;
import com.ntn.ecommerce.dto.response.VNPayCallbackResponse;
import com.ntn.ecommerce.service.TransactionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping("/vn-pay-callback/{userId}")
    public ApiResponse<VNPayCallbackResponse> payCallbackHandler(
            @PathVariable String userId, @RequestBody Map<String, String> requestParams) {
        System.out.println("Received params: " + requestParams);
        return ApiResponse.<VNPayCallbackResponse>builder()
                .result(transactionService.payCallbackHandler(userId, requestParams))
                .build();
    }
}
