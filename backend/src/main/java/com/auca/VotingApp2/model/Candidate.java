package com.auca.VotingApp2.model;

import jakarta.persistence.*;
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

    private String fullName;
    private String party;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "electionId")
    private Election election;

    @OneToMany(mappedBy = "candidate", cascade = CascadeType.ALL)
    private Set<Vote> votes;
}
