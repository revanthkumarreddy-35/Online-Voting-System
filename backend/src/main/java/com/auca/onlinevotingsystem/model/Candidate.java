package com.auca.onlinevotingsystem.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.Set;

@Data
@Entity
@Table(name = "candidate")
public class Candidate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long candidateId;
    public String image;

    @NotBlank(message = "Full name is required")
    private String fullName;
    
    @NotBlank(message = "Party is required")
    private String party;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "electionId")
    private Election election;

    @OneToMany(mappedBy = "candidate", cascade = CascadeType.ALL)
    private Set<Vote> votes;
}
