package com.devteria.identityservice.controller;

import com.devteria.identityservice.dto.response.ApiResponse;
import com.devteria.identityservice.dto.response.VNPayCallbackResponse;
import com.devteria.identityservice.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping("/vn-pay-callback/{userId}")
    public ApiResponse<VNPayCallbackResponse> payCallbackHandler(@PathVariable String userId, @RequestBody Map<String, String> requestParams) {
        System.out.println("Received params: " + requestParams);
        return ApiResponse.<VNPayCallbackResponse>builder()
                .result(transactionService.payCallbackHandler(userId, requestParams))
                .build();
    }

}
