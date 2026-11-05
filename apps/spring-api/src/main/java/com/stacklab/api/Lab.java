package com.stacklab.api;

import java.time.Instant;

public record Lab(String id, String slug, String title, String description, String status, String endpoint, Instant createdAt, Instant updatedAt) {}
