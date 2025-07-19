package com.ntn.ecommerce;

import io.github.cdimascio.dotenv.Dotenv;

public class DotenvApplication {
    public static void loadEnv() {
        Dotenv dotenv = Dotenv.load();
        dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));
    }
}
