package com.auca.onlinevotingsystem.controller;

import com.auca.onlinevotingsystem.dto.CandidateResponse;
import com.auca.onlinevotingsystem.model.Candidate;
import com.auca.onlinevotingsystem.service.CandidateService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/candidates")
public class CandidateController {
    private static final Logger logger = LoggerFactory.getLogger(CandidateController.class);
    
    private final CandidateService candidateService;

    public CandidateController(CandidateService candidateService) {
        this.candidateService = candidateService;
    }

    @PostMapping("/election/{electionId}")
    public ResponseEntity<CandidateResponse> addCandidate(@PathVariable("electionId") Long electionId, @Valid @RequestBody Candidate candidate) {
        logger.info("Received request to add candidate to election: {}", electionId);
        Candidate savedCandidate = candidateService.addCandidate(electionId, candidate);
        return ResponseEntity.ok(mapToResponse(savedCandidate));
    }

    @PutMapping("/{candidateId}")
    public ResponseEntity<CandidateResponse> updateCandidate(@PathVariable("candidateId") Long candidateId, @Valid @RequestBody Candidate candidateDetails) {
        logger.info("Received request to update candidate: {}", candidateId);
        Candidate updatedCandidate = candidateService.updateCandidate(candidateId, candidateDetails);
        return ResponseEntity.ok(mapToResponse(updatedCandidate));
    }

    @DeleteMapping("/{candidateId}")
    public ResponseEntity<Void> deleteCandidate(@PathVariable Long candidateId) {
        candidateService.deleteCandidate(candidateId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<CandidateResponse>> getAllCandidates() {
        List<CandidateResponse> candidates = candidateService.getAllCandidatesWithElection().stream()
                .map(this::mapToResponse).collect(Collectors.toList());
        return ResponseEntity.ok(candidates);
    }

    @GetMapping("/election/{electionId}")
    public ResponseEntity<List<CandidateResponse>> getCandidatesByElection(@PathVariable Long electionId) {
        List<CandidateResponse> candidates = candidateService.getCandidatesByElection(electionId).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
        return ResponseEntity.ok(candidates);
    }

    @GetMapping("/{candidateId}/votes")
    public ResponseEntity<Long> countVotesForCandidate(@PathVariable Long candidateId) {
        Long voteCount = candidateService.countVotesForCandidate(candidateId);
        return ResponseEntity.ok(voteCount);
    }

    private CandidateResponse mapToResponse(Candidate candidate) {
        return new CandidateResponse(
            candidate.getCandidateId(),
            candidate.getFullName(),
            candidate.getParty(),
            candidate.getImage(),
            candidate.getElection() != null ? candidate.getElection().getElectionId() : null
        );
    }
}
