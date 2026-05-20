package com.example.authapp.entity;

public enum Provider {
    GOOGLE("google"),
    NAVER("naver");

    private final String value;

    Provider(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static Provider fromString(String value) {
        for (Provider provider : Provider.values()) {
            if (provider.getValue().equalsIgnoreCase(value)) {
                return provider;
            }
        }
        throw new IllegalArgumentException("Unknown provider: " + value);
    }
}