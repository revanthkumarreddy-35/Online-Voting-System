package com.auca.onlinevotingsystem.dto;

import lombok.Data;

@Data
public class CastVoteRequest {

    // Default constructor for deserialization
    public CastVoteRequest() {}

    public CastVoteRequest(Long userId, Long electionId, Long candidateId) {
    }
}
