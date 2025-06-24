package com.ntn.ecommerce.dto.response;

import java.time.LocalDateTime;

import lombok.Builder;

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
