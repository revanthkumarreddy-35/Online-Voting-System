package com.auca.VotingApp2.model;

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

    public Vote() {
        // Default constructor for deserialization
    }

	public void setCandidate(Candidate candidate2) {
		// TODO Auto-generated method stub
		
	}

	public void setElection(Object election2) {
		// TODO Auto-generated method stub
		
	}

	public void setUser(User user2) {
		// TODO Auto-generated method stub
		
	}

	public void setVoteTime(LocalDateTime now) {
		// TODO Auto-generated method stub
		
	}

	public Candidate getCandidate() {
		// TODO Auto-generated method stub
		return null;
	}

	public Object getElection() {
		// TODO Auto-generated method stub
		return null;
	}

	public User getUser() {
		// TODO Auto-generated method stub
		return null;
	}



}
