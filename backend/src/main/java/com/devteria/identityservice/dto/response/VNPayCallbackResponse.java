package com.devteria.identityservice.dto.response;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public class VNPayCallbackResponse {
    public String vnp_TmnCode;
    public String vnp_Amount;
    public String vnp_BankCode;
    public String vnp_BankTranNo;
    public String vnp_CardType;
    public LocalDateTime vnp_PayDate;
    public String vnp_OrderInfo;
    public String vnp_TransactionNo;
    public String vnp_ResponseCode;
    public String vnp_TxnRef;
    public String vnp_TransactionStatus;
}
