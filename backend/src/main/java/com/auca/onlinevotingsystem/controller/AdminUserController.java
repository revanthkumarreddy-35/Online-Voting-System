// AdminUserController.java
package com.auca.onlinevotingsystem.controller;

import com.auca.onlinevotingsystem.dto.PageResponse;
import com.auca.onlinevotingsystem.model.User;
import com.auca.onlinevotingsystem.model.UserStatus;
import com.auca.onlinevotingsystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/admin")
public class AdminUserController {

    @Autowired
    private UserService userService;

    @PostMapping("/users")
    public ResponseEntity<String> addUser(@RequestBody User user) {
        userService.registerUser(user);
        return ResponseEntity.ok("User added successfully.");
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully.");
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/users")
    public ResponseEntity<String> updateUser(@RequestBody User user) {
        userService.updateUser(user);
        return ResponseEntity.ok("User updated successfully.");
    }

    @GetMapping("/users/search")
    public ResponseEntity<List<User>> searchUsers(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String email
    ) {
        List<User> users = userService.searchUsers(username, email);
        return ResponseEntity.ok(users);
    }

    @PostMapping("/users/{id}/approve")
    public ResponseEntity<String> approveUser(@PathVariable Long id, @RequestBody Map<String, String> body) {
        User user = userService.getUserById(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        user.setStatus(UserStatus.APPROVED);
        user.setRejectionReason(null);
        user.setApprovedBy(body.get("approverUsername"));
        userService.updateUser(user);
        return ResponseEntity.ok("User approved successfully.");
    }

    @PostMapping("/users/{id}/reject")
    public ResponseEntity<String> rejectUser(@PathVariable Long id, @RequestBody Map<String, String> body) {
        User user = userService.getUserById(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        user.setStatus(UserStatus.REJECTED);
        user.setRejectionReason(body.get("rejectionReason"));
        user.setApprovedBy(body.get("approverUsername"));
        userService.updateUser(user);
        return ResponseEntity.ok("User rejected successfully.");
    }

    @GetMapping("/users")
    public ResponseEntity<PageResponse<User>> getAllUsers(
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "id") String sortBy) {

        System.out.println("Fetching users: pageNo=" + pageNo + ", pageSize=" + pageSize + ", sortBy=" + sortBy);
        var pageable = PageRequest.of(pageNo, pageSize, Sort.by(sortBy));
        var userPage = userService.getAllUsers(pageable);
        System.out.println("Fetched " + userPage.getTotalElements() + " users from database.");

        return ResponseEntity.ok(new PageResponse<>(
                userPage.getContent(),
                pageNo,
                userPage.getTotalPages(),
                userPage.getTotalElements()
        ));
    }

    @GetMapping("/user-role-stats")
    public ResponseEntity<Map<String, Integer>> getUserRoleStatistics() {
        List<User> users = userService.getAllUsers();
        Map<String, Integer> roleStats = new HashMap<>();
        for (User user : users) {
            String role = ((User) user).getRole().name();
            roleStats.put(role, roleStats.getOrDefault(role, 0) + 1);
        }
        return ResponseEntity.ok(roleStats);
    }

    @PostMapping("/upload/users")
    public ResponseEntity<String> uploadUsers(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Please select a file to upload.");
        }
        try {
            List<User> userList = new ArrayList<>();
            BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
            String line;
            reader.readLine(); // Skip header
            while ((line = reader.readLine()) != null) {
                String[] data = line.split(",");
                User user = new User();
                user.setFirstName(data[1]);
                user.setFirstName(data[2]);
                user.setLastName(data[3]);
                user.setEmail(data[4]);
                user.setPhoneNumber(data[5]);
                userList.add(user);
            }
            userService.saveAll(userList);
            return ResponseEntity.ok("User file uploaded successfully!");
        } catch (IOException | IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Failed to upload user file: " + e.getMessage());
        }
    }

    @GetMapping("/download/users")
    public ResponseEntity<ByteArrayResource> downloadUsers() throws IOException {
        List<User> users = userService.getAllUsers();
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        PrintWriter writer = new PrintWriter(outputStream);
        writer.println("ID,Username,Email,First Name,Last Name,Phone Number");
        for (User user : users) {
            writer.printf("%d,%s,%s,%s,%s,%s%n",
                    user.getId(),
                    user.getFirstName(),
                    user.getEmail(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getPhoneNumber());
        }
        writer.flush();
        writer.close();

        ByteArrayResource resource = new ByteArrayResource(outputStream.toByteArray());
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=users.csv");

        return ResponseEntity.ok()
                .headers(headers)
                .contentLength(resource.contentLength())
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(resource);
    }

}
