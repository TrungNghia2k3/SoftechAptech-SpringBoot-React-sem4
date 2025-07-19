package com.ntn.ecommerce;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class BookStoreApplication {
    public static void main(String[] args) {
        DotenvApplication.loadEnv();
        SpringApplication.run(BookStoreApplication.class, args);
    }
}
