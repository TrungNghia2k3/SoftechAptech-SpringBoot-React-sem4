package com.devteria.identityservice.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    @Builder.Default
    private int code = 1000;  // Mã trạng thái mặc định

    private String message;  // Thông báo

    private T result; // Kết quả trả về
    //    private List<ValidationError> errors;
    private Map<String, String> errors;  // Danh sách lỗi, nếu có
}
