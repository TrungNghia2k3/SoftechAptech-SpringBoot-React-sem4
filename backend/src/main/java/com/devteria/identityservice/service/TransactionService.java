package com.devteria.identityservice.service;

import com.devteria.identityservice.dto.response.VNPayCallbackResponse;
import com.devteria.identityservice.entity.Order;
import com.devteria.identityservice.entity.Transaction;
import com.devteria.identityservice.entity.User;
import com.devteria.identityservice.exception.AppException;
import com.devteria.identityservice.exception.ErrorCode;
import com.devteria.identityservice.mapper.VNPayCallbackMapper;
import com.devteria.identityservice.repository.OrderRepository;
import com.devteria.identityservice.repository.TransactionRepository;
import com.devteria.identityservice.repository.UserRepository;
import com.devteria.identityservice.utilities.VNPayUtilities;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TransactionService {

    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

    UserRepository userRepository;
    TransactionRepository transactionRepository;
    OrderRepository orderRepository;
    @NonFinal
    @Value("${payment.vnPay.secretKey}")
    protected String secretKey;
    VNPayCallbackMapper vnPayCallbackMapper;


    public VNPayCallbackResponse payCallbackHandler(String userId, Map<String, String> requestParams) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Map<String, String> fields = new HashMap<>();
        Map<String, String> response = new HashMap<>();

        // Extract request parameters and handle encoding
        for (Map.Entry<String, String> entry : requestParams.entrySet()) {
            String fieldName = entry.getKey();
            String fieldValue = entry.getValue();
            if (fieldValue != null && !fieldValue.isEmpty()) {
                fields.put(URLEncoder.encode(fieldName,
                                StandardCharsets.US_ASCII),
                        URLEncoder.encode(fieldValue,
                                StandardCharsets.US_ASCII));
                response.put(fieldName, fieldValue);
            }
        }

        // Handle secure hash
        String vnp_SecureHash = requestParams.get("vnp_SecureHash");
        fields.remove("vnp_SecureHashType");
        fields.remove("vnp_SecureHash");

        String signValue = VNPayUtilities.hashAllFields(fields, secretKey);

        // Determine transaction status
        String transactionStatus;
        if (signValue.equals(vnp_SecureHash)) {
            transactionStatus = "00".equals(requestParams.get("vnp_TransactionStatus")) ? "Successfully" : "Failed";
        } else {
            transactionStatus = "Invalid signature";
        }
        response.put("transactionStatus", transactionStatus);

        // Parsing the pay date from the request parameters
        String payDateString = requestParams.get("vnp_PayDate");
        LocalDateTime transactionDate = LocalDateTime.parse(payDateString, DATE_TIME_FORMATTER);

        // Extracting orderId from vnp_OrderInfo
        String orderInfo = requestParams.get("vnp_OrderInfo");
        String orderId = extractOrderIdFromOrderInfo(orderInfo);

        // Find the Order by orderId
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Use MapStruct to map request parameters to VNPayCallbackResponse
        VNPayCallbackResponse callbackResponse = vnPayCallbackMapper.toVNPayCallbackResponse(response, transactionStatus);

        // Map VNPayCallbackResponse to Transaction
        Transaction transaction = vnPayCallbackMapper.toTransaction(callbackResponse);
        transaction.setUser(user);
        transaction.setOrder(order);

        // Save the transaction to the database
        transactionRepository.save(transaction);

        return callbackResponse;
    }

    private String extractOrderIdFromOrderInfo(String orderInfo) {
        if (orderInfo != null) {
            // Trích xuất giá trị sau "Order payment:"
            return orderInfo.substring("Order payment:".length()).trim();
        }
        log.info("Invalid vnp_OrderInfo format");
        throw new IllegalArgumentException("Invalid vnp_OrderInfo format");
    }
}
