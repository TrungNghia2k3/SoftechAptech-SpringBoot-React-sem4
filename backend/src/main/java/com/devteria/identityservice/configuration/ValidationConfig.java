package com.devteria.identityservice.configuration;

import com.devteria.identityservice.dto.request.ProductRequest;
import jakarta.validation.ConstraintViolation;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

import java.util.Set;

@Configuration
public class ValidationConfig {

    @Bean
    public MessageSource messageSource() {

        ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();

        messageSource.setBasename("classpath:messages");

        messageSource.setDefaultEncoding("UTF-8");

        return messageSource;
    }

    @Bean
    public LocalValidatorFactoryBean validator(MessageSource messageSource) {

        LocalValidatorFactoryBean validatorFactoryBean = new LocalValidatorFactoryBean();

        validatorFactoryBean.setValidationMessageSource(messageSource);

        return validatorFactoryBean;
    }
}
