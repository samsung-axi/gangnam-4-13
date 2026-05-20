package com.banghyang.common.util;

public class ValidUtils {

    public static boolean isNotBlank(String str) {
        return str != null && !str.trim().isEmpty();
    }
}
