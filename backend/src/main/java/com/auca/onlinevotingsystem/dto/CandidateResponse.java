package com.auca.onlinevotingsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CandidateResponse {
    private Long candidateId;
    private String fullName;
    private String party;
    private String image;
    private Long electionId;
}
