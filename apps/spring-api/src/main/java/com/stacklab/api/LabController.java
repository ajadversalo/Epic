package com.stacklab.api;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/labs")
@CrossOrigin(origins = "*")
public class LabController {
  private final ConcurrentMap<String, Lab> labs = new ConcurrentHashMap<>();

  public LabController() {
    create(new LabRequest("spring-boot", "Spring Boot CRUD", "REST CRUD implemented with Spring Boot.", "ready", "/labs/spring-boot"));
  }

  @GetMapping
  public List<Lab> list() { return labs.values().stream().toList(); }

  @GetMapping("/{id}")
  public ResponseEntity<Lab> get(@PathVariable String id) { return find(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build()); }

  @PostMapping
  public ResponseEntity<?> create(@RequestBody LabRequest input) {
    if (input.slug() == null || input.slug().isBlank() || input.title() == null || input.title().isBlank()) return ResponseEntity.badRequest().body("slug and title are required");
    if (labs.values().stream().anyMatch(lab -> lab.slug().equals(input.slug()))) return ResponseEntity.status(HttpStatus.CONFLICT).body("slug already exists");
    Instant timestamp = Instant.now();
    Lab lab = new Lab(UUID.randomUUID().toString(), input.slug(), input.title(), value(input.description()), value(input.status(), "planned"), value(input.endpoint(), "/labs/" + input.slug()), timestamp, timestamp);
    labs.put(lab.id(), lab);
    return ResponseEntity.status(HttpStatus.CREATED).body(lab);
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> replace(@PathVariable String id, @RequestBody LabRequest input) { return saveUpdate(id, input); }

  @PatchMapping("/{id}")
  public ResponseEntity<?> update(@PathVariable String id, @RequestBody LabRequest input) {
    Lab current = find(id).orElse(null);
    if (current == null) return ResponseEntity.notFound().build();
    LabRequest merged = new LabRequest(value(input.slug(), current.slug()), value(input.title(), current.title()), value(input.description(), current.description()), value(input.status(), current.status()), value(input.endpoint(), current.endpoint()));
    return saveUpdate(current.id(), merged);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> delete(@PathVariable String id) { return find(id).map(lab -> { labs.remove(lab.id()); return ResponseEntity.ok(new DeleteResponse(true, lab.id())); }).orElseGet(() -> ResponseEntity.notFound().build()); }

  private ResponseEntity<?> saveUpdate(String id, LabRequest input) {
    Lab current = find(id).orElse(null);
    if (current == null) return ResponseEntity.notFound().build();
    if (labs.values().stream().anyMatch(lab -> !lab.id().equals(current.id()) && lab.slug().equals(input.slug()))) return ResponseEntity.status(HttpStatus.CONFLICT).body("slug already exists");
    Lab updated = new Lab(current.id(), input.slug(), input.title(), value(input.description()), value(input.status(), "planned"), value(input.endpoint(), "/labs/" + input.slug()), current.createdAt(), Instant.now());
    labs.put(current.id(), updated);
    return ResponseEntity.ok(updated);
  }

  private java.util.Optional<Lab> find(String id) { return labs.values().stream().filter(lab -> lab.id().equals(id) || lab.slug().equals(id)).findFirst(); }
  private static String value(String value) { return value == null ? "" : value; }
  private static String value(String value, String fallback) { return value == null || value.isBlank() ? fallback : value; }
  private record DeleteResponse(boolean deleted, String id) {}
}
