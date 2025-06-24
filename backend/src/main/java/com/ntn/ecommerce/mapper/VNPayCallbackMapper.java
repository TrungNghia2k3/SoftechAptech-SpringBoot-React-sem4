package com.ntn.ecommerce.mapper;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import com.ntn.ecommerce.dto.response.VNPayCallbackResponse;
import com.ntn.ecommerce.entity.Transaction;

@Mapper(componentModel = "spring")
public interface VNPayCallbackMapper {

    @Mapping(target = "vnp_TmnCode", source = "requestParameterMap.vnp_TmnCode")
    @Mapping(target = "vnp_Amount", source = "requestParameterMap.vnp_Amount", qualifiedByName = "divideAmountBy100")
    @Mapping(target = "vnp_BankCode", source = "requestParameterMap.vnp_BankCode")
    @Mapping(target = "vnp_BankTranNo", source = "requestParameterMap.vnp_BankTranNo")
    @Mapping(target = "vnp_CardType", source = "requestParameterMap.vnp_CardType")
    @Mapping(target = "vnp_PayDate", source = "requestParameterMap.vnp_PayDate", dateFormat = "yyyyMMddHHmmss")
    @Mapping(target = "vnp_OrderInfo", source = "requestParameterMap.vnp_OrderInfo")
    @Mapping(target = "vnp_TransactionNo", source = "requestParameterMap.vnp_TransactionNo")
    @Mapping(target = "vnp_ResponseCode", source = "requestParameterMap.vnp_ResponseCode")
    @Mapping(target = "vnp_TxnRef", source = "requestParameterMap.vnp_TxnRef")
    @Mapping(target = "vnp_TransactionStatus", source = "transactionStatus")
    VNPayCallbackResponse toVNPayCallbackResponse(Map<String, String> requestParameterMap, String transactionStatus);

    Transaction toTransaction(VNPayCallbackResponse callbackResponse);

    default LocalDateTime map(String value) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        return LocalDateTime.parse(value, formatter);
    }

    @Named("divideAmountBy100")
    default long divideAmountBy100(String value) {
        return Long.parseLong(value) / 100;
    }
}
