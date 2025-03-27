package com.devteria.identityservice.dto.request;


import com.devteria.identityservice.validator.ContactNumberConstraint;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserAddressRequest {

    @NotEmpty
    String provinceCode;

    @NotEmpty
    String provinceName;

    @NotEmpty
    String districtCode;

    @NotEmpty
    String districtName;

    @NotEmpty
    String wardCode;

    @NotEmpty
    String wardName;

    @NotEmpty
    String fullAddress;

    @NotEmpty
    String fullName;

    @ContactNumberConstraint
    String phone;

    boolean isDefault;
}
