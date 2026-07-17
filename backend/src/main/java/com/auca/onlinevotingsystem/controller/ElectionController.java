package com.auca.onlinevotingsystem.controller;

import com.auca.onlinevotingsystem.dto.CandidateResponse;
import com.auca.onlinevotingsystem.dto.ElectionResponse;
import com.auca.onlinevotingsystem.model.Election;
import com.auca.onlinevotingsystem.service.ElectionService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/elections")
@CrossOrigin(origins = "http://localhost:3000") // Adjust origin as per your frontend URL
public class ElectionController {
    private static final Logger logger = LoggerFactory.getLogger(ElectionController.class);

    @Autowired
    private ElectionService electionService;

    @GetMapping
    public ResponseEntity<List<ElectionResponse>> getAllElections() {
        List<ElectionResponse> elections = electionService.getAllElections().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(elections);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ElectionResponse> getElectionById(@PathVariable long id) {
        Election election = electionService.getElectionById(id);
        return ResponseEntity.ok(mapToResponse(election));
    }

    @PostMapping
    public ResponseEntity<ElectionResponse> createElection(@Valid @RequestBody Election election) {
        logger.info("Received request to create election: {}", election.getElectionName());
        Election saved = electionService.createElection(election);
        return ResponseEntity.ok(mapToResponse(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ElectionResponse> updateElection(@PathVariable long id, @Valid @RequestBody Election updatedElection) {
        logger.info("Received request to update election: {}", id);
        Election updated = electionService.updateElection(id, updatedElection);
        return ResponseEntity.ok(mapToResponse(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteElection(@PathVariable long id) {
        logger.info("Received request to delete election: {}", id);
        electionService.deleteElection(id);
        return ResponseEntity.ok("Election deleted successfully");
    }

    private ElectionResponse mapToResponse(Election election) {
        List<CandidateResponse> candidateResponses = null;
        if (election.getCandidates() != null) {
            candidateResponses = election.getCandidates().stream().map(c -> 
                new CandidateResponse(c.getCandidateId(), c.getFullName(), c.getParty(), c.getImage(), election.getElectionId())
            ).collect(Collectors.toList());
        }
        return new ElectionResponse(
            election.getElectionId(),
            election.getElectionName(),
            election.getElectionDescription(),
            election.getImage(),
            election.getElectionStartDate(),
            election.getElectionEndDate(),
            election.getElectionTime(),
            election.isElectionStatus(),
            candidateResponses
        );
    }
}
