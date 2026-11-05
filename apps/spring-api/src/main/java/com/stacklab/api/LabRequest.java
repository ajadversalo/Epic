package com.stacklab.api;

public record LabRequest(String slug, String title, String description, String status, String endpoint) {}
