package com.auca.onlinevotingsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ElectionResponse {
    private Long electionId;
    private String electionName;
    private String electionDescription;
    private String image;
    private String electionStartDate;
    private String electionEndDate;
    private String electionTime;
    private boolean electionStatus;
    private List<CandidateResponse> candidates;
}
