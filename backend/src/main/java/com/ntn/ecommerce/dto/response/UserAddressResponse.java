package com.ntn.ecommerce.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserAddressResponse {

    Long id;
    int provinceCode;
    String provinceName;
    int districtCode;
    String districtName;
    String wardCode;
    String wardName;
    String fullAddress;
    String fullName;
    String phone;
    boolean isDefault;
}
