// UserController.java
package com.auca.VotingApp2.controller;

import com.auca.VotingApp2.dto.UserResponse;
import com.auca.VotingApp2.model.Role;
import com.auca.VotingApp2.model.User;
import com.auca.VotingApp2.model.UserStatus;
import com.auca.VotingApp2.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/home")
    public ResponseEntity<String> home() {
        return ResponseEntity.ok("Welcome to the Voting Application API!");
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        // Prevent self-registration as master admin
        if (user.getRole() == Role.ROLE_MASTER_ADMIN) {
            return ResponseEntity.badRequest().body("Cannot register as Master Admin.");
        }
        // Only allow ROLE_USER or ROLE_ADMIN from registration
        if (user.getRole() == null || (user.getRole() != Role.ROLE_USER && user.getRole() != Role.ROLE_ADMIN)) {
            user.setRole(Role.ROLE_USER);
        }
        user.setStatus(UserStatus.PENDING);
        userService.registerUser(user);
        return ResponseEntity.ok("Registration successful! Your account is pending admin verification.");
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestParam String username,
                                       @RequestParam String password,
                                       HttpSession session) {
        System.out.println("Attempting to log in user: " + username);
        User user = userService.loginUser(username);
        
        if (user == null || !user.getPassword().equals(password)) {
            System.out.println("Invalid credentials for: " + username);
            return ResponseEntity.badRequest().body("Invalid username or password.");
        }

        if (user.getStatus() == UserStatus.PENDING) {
            System.out.println("User is pending verification: " + username);
            return ResponseEntity.status(403).body("Your account is pending verification by an admin.");
        }

        if (user.getStatus() == UserStatus.REJECTED) {
            System.out.println("User was rejected: " + username);
            return ResponseEntity.status(403).body("Your account was rejected: " + (user.getRejectionReason() != null ? user.getRejectionReason() : "Inappropriate details."));
        }

        session.setAttribute("user", user);
        User luser = (User) session.getAttribute("user");
        System.out.println("User logged in with ID: " + luser.getId());

        return ResponseEntity.ok(
            new UserResponse(user.getId(), user.getFirstName(), user.getRole())
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        System.out.println("User logged out.");
        return ResponseEntity.ok("You are logged out.");
    }
}
