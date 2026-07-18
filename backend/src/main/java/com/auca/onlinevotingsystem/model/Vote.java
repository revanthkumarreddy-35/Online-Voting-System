package com.auca.onlinevotingsystem.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
@Table(name = "Vote")
public class Vote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long voteId;

    @ManyToOne
    @JoinColumn(name = "id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "electionId")
    @JsonBackReference
    private Election election;

    @ManyToOne
    @JoinColumn(name = "candidateId")
    //@JsonBackReference
    private Candidate candidate;

    @Column(name = "vote_time")
    private LocalDateTime voteTime;

    public Vote() {
        // Default constructor for deserialization
    }
}
