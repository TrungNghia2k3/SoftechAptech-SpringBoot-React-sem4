package com.ntn.ecommerce.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PublisherResponse {
    Long id;

    String code;

    String name;

    boolean disabled;
}
