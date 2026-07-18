package com.auca.onlinevotingsystem.dto;

import lombok.Data;

@Data
public class CastVoteRequest {

    private Long userId;
    private Long electionId;
    private Long candidateId;

    // Default constructor for deserialization
    public CastVoteRequest() {}

    public CastVoteRequest(Long userId, Long electionId, Long candidateId) {
        this.userId = userId;
        this.electionId = electionId;
        this.candidateId = candidateId;
    }
}
