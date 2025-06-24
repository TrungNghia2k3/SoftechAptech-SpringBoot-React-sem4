package com.ntn.ecommerce.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class ContactNumberValidator implements ConstraintValidator<ContactNumberConstraint, String> {

    @Override
    public void initialize(ContactNumberConstraint contactNumber) {}

    @Override
    public boolean isValid(String contactField, ConstraintValidatorContext cxt) {
        return contactField != null
                && contactField.matches("[0-9]+")
                && contactField.length() == 10; // SDT VN quy dinh la 10 so
    }
}
