package com.auca.VotingApp2.model;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.Set;

import org.springframework.web.bind.annotation.RequestMapping;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ─── Add these fields ──────────────────────────────────────────
    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String email;

    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String photo;
    // ───────────────────────────────────────────────────────────────

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private UserStatus status = UserStatus.PENDING;

    @Column(length = 500)
    private String rejectionReason;

    private String approvedBy;

    @JsonIgnore
    @OneToMany(mappedBy = "user")
    private Set<Vote> votes;

}

