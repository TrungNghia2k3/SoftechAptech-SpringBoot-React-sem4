package com.devteria.identityservice.exception;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "validation error", HttpStatus.BAD_REQUEST),
    USER_EXISTED(1002, "User existed", HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1003, "Username must be at least {min} characters", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1004, "Password must be at least {min} characters", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1005, "User does not exist", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1006, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1007, "You do not have permission", HttpStatus.FORBIDDEN),
    INVALID_DOB(1008, "Your age must be at least {min}", HttpStatus.BAD_REQUEST),
    INVALID_CREDENTIALS(1009, "Invalid credentials, please try again.", HttpStatus.BAD_REQUEST),
    PASSWORD_EXISTED(1010, "Password existed", HttpStatus.BAD_REQUEST),
    FIELD_EMPTY(1011, "Field must not be empty", HttpStatus.BAD_REQUEST),
    INVALID_EMAIL(1012, "The field must be email", HttpStatus.BAD_REQUEST),
    NOT_VERIFY(1013, "User has not been verified", HttpStatus.BAD_REQUEST),
    EMAIL_ERROR(1014, "Failed to send email", HttpStatus.INTERNAL_SERVER_ERROR),
    EXPIRED_OTP(1015, "OTP code is expired, please regenerate otp and try again", HttpStatus.BAD_REQUEST),
    FAILED_CREATE_TOKEN(1015, "Cannot create token", HttpStatus.BAD_REQUEST),
    CATEGORY_NOT_FOUND(1015, "Category not found", HttpStatus.BAD_REQUEST),
    EXPIRED_TOKEN(1016, "Token already expired", HttpStatus.BAD_REQUEST),
    INCORRECT_OTP(1017, "OTP code is incorrect", HttpStatus.BAD_REQUEST),
    ROLE_NOT_FOUND(1018, "Role not found", HttpStatus.BAD_REQUEST),
    EXISTED_PERMISSION(1019, "Permission existed", HttpStatus.BAD_REQUEST),
    EXISTED_ROLE(1020, "Role existed", HttpStatus.BAD_REQUEST),
    PERMISSION_NOT_FOUND(1021, "Permission not found", HttpStatus.BAD_REQUEST),
    FAILED_DELETE_PERMISSION(1022, "Cannot delete permission as it is assigned to one or more roles", HttpStatus.BAD_REQUEST),
    CATEGORY_EXISTED(1023, "Category existed", HttpStatus.BAD_REQUEST),
    PRODUCT_NOT_FOUND(1024, "Product not found", HttpStatus.BAD_REQUEST),
    REQUIRED_IMAGE(1025, "Image is required", HttpStatus.BAD_REQUEST),
    FILE_TOO_LARGE(1026, "File too large", HttpStatus.BAD_REQUEST),
    CANNOT_ADD_COMPLETED_CART(1027, "Cannot add to a completed cart", HttpStatus.BAD_REQUEST),
    EXCEEDS_QUANTITY(1028, "Quantity exceeds available stock", HttpStatus.BAD_REQUEST),
    ACTIVE_CART_NOT_FOUND(1029, "No active cart found for user", HttpStatus.BAD_REQUEST),
    INSUFFICIENT_STOCK(1030, "Insufficient stock for product", HttpStatus.BAD_REQUEST),
    CART_PRODUCT_NOT_FOUND(1031, "Cart product not found", HttpStatus.BAD_REQUEST),
    PUBLISHER_CODE_EXISTED(1032, "Publisher with code already exists.", HttpStatus.BAD_REQUEST),
    PUBLISHER_NAME_EXISTED(1033, "Publisher with name already exists.", HttpStatus.BAD_REQUEST),
    PUBLISHER_NOT_FOUND(1034, "Publisher with id does not exist.", HttpStatus.BAD_REQUEST),
    PUBLISHER_ASSOCIATED_PRODUCT(1035, "Publisher is associated with a product", HttpStatus.BAD_REQUEST),
    CATEGORY_CODE_EXISTED(1032, "Category with code already exists.", HttpStatus.BAD_REQUEST),
    CATEGORY_NAME_EXISTED(1033, "Category with name already exists.", HttpStatus.BAD_REQUEST),
    CATEGORY_ASSOCIATED_PRODUCT(1035, "Category is associated with a product", HttpStatus.BAD_REQUEST),
    ADDRESS_ALREADY_EXISTS(1036, "Address already exists", HttpStatus.BAD_REQUEST),
    ADDRESS_NOT_FOUND(1037, "Address not found", HttpStatus.BAD_REQUEST),
    FEEDBACK_NOT_FOUND(1032, "Feedback not found", HttpStatus.BAD_REQUEST),
    ORDER_NOT_FOUND(1033, "Order not found", HttpStatus.BAD_REQUEST),
    MANUFACTURE_NOT_FOUND(1034, "Manufacture not found", HttpStatus.BAD_REQUEST),
    COUPON_NOT_FOUND(1034, "Coupon not found", HttpStatus.BAD_REQUEST),
    FREE_SHIP_COUPON_TYPE_EXIST(1035, "Free ship coupon type already exists", HttpStatus.BAD_REQUEST),
    COUPON_ID_EXIST(1036, "Coupon ID already exists", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND(1037, "User not found", HttpStatus.BAD_REQUEST),
    INSUFFICIENT_POINTS(1038, "Insufficient points to redeem coupon", HttpStatus.BAD_REQUEST),
    MANUFACTURE_NAME_EXISTED(1039, "Manufacture with name already exists.", HttpStatus.BAD_REQUEST),
    USER_HAS_NOT_PURCHASE(1040, "User has not purchased this product", HttpStatus.BAD_REQUEST),
    COMMENT_NOT_FOUND(1041, "Comment not found", HttpStatus.BAD_REQUEST),
    USER_NOT_AUTHORIZED(1042, "User not authorized", HttpStatus.BAD_REQUEST),
    PRODUCT_ALREADY_EXISTS(1042, "The product already exists with. Please check the title or isbn10 or isbn13 again", HttpStatus.BAD_REQUEST),
    CURRENT_PASSWORD_INCORRECT(1043, "Current password is incorrect", HttpStatus.BAD_REQUEST),
    USER_ALREADY_COMMENTED_TODAY(1044, "You can only post one comment per product once per day", HttpStatus.BAD_REQUEST),
    MANUFACTURE_PRODUCT_NOT_FOUND(1045, "Manufacture product not found",HttpStatus.BAD_REQUEST),
    PRODUCT_MISMATCH(1046, "Product mismatch",HttpStatus.BAD_REQUEST),
    USER_NOT_COMMENT(1047, "User comment is required before adding an admin response.",HttpStatus.BAD_REQUEST),
    ;

    int code;

    String message;

    HttpStatusCode statusCode;
}
