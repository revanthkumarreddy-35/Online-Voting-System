// VoteController.java
package com.auca.onlinevotingsystem.controller;

import com.auca.onlinevotingsystem.dto.CastVoteRequest;
import com.auca.onlinevotingsystem.model.*;
import com.auca.onlinevotingsystem.service.*;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.HashMap;

@RestController
@RequestMapping("/api/votes")
public class VoteController {

    @Autowired
    private VoteService voteService;
    @Autowired
    private CandidateService candidateService;

    @GetMapping
    public ResponseEntity<List<Vote>> getAllVotes() {
        return ResponseEntity.ok(voteService.getAllVotes());
    }

    @GetMapping("/{voteId}")
    public ResponseEntity<Vote> getVoteById(@PathVariable Long voteId) {
        return voteService.getVoteById(voteId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/candidate/{candidateId}/votes")
    public ResponseEntity<Long> getVotesCount(@PathVariable Long candidateId) {
        Long voteCount = voteService.getVoteCountForCandidate(candidateId);
        return ResponseEntity.ok(voteCount);
    }
    
    @GetMapping("/receipt/{receiptId}")
    public ResponseEntity<Map<String, String>> verifyReceipt(@PathVariable String receiptId) {
        return voteService.getVoteByReceiptId(receiptId)
                .map(vote -> {
                    Map<String, String> response = new HashMap<>();
                    response.put("status", "VERIFIED");
                    response.put("message", "Vote is securely stored in the ledger.");
                    response.put("timestamp", vote.getVoteTime() != null ? vote.getVoteTime().toString() : "N/A");
                    response.put("election", vote.getElection() != null ? vote.getElection().getElectionName() : "Unknown Election");
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(consumes = "application/json", produces = "application/json")
    public ResponseEntity<Map<String, String>> castVote(@RequestBody CastVoteRequest voteRequest,
                                           @RequestHeader Map<String, String> headers,
                                           HttpSession session) {
        try {
            headers.forEach((key, value) -> System.out.println(key + ": " + value));
            long userId = voteRequest.getUserId();
            Candidate candidate = candidateService.getCandidateById(voteRequest.getCandidateId());

            User user = new User();
            user.setId(userId);

            Vote vote = new Vote();
            vote.setCandidate(candidate);
            vote.setElection(((Candidate) candidate).getElection());
            vote.setUser(user);
            vote.setVoteTime(LocalDateTime.now());
            
            // Generate Cryptographic Receipt ID (Simulated with UUID for Phase 3)
            String receiptId = "TX-" + UUID.randomUUID().toString().substring(0, 18).toUpperCase();
            vote.setReceiptId(receiptId);

            voteService.saveVote(vote);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Vote cast successfully.");
            response.put("receiptId", receiptId);
            
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            ex.printStackTrace();
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", ex.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PutMapping("/{voteId}")
    public ResponseEntity<Vote> updateVote(@PathVariable Long voteId,
                                           @RequestBody Vote voteDetails) {
        return voteService.getVoteById(voteId)
                .map(existingVote -> {
                    existingVote.setCandidate(((Vote) voteDetails).getCandidate());
                    existingVote.setElection(((Vote) voteDetails).getElection());
                    existingVote.setUser(((Vote) voteDetails).getUser());
                    existingVote.setVoteTime(LocalDateTime.now());
                    voteService.saveVote(existingVote);
                    return ResponseEntity.ok(existingVote);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{voteId}")
    public ResponseEntity<String> deleteVote(@PathVariable Long voteId) {
        voteService.deleteVote(voteId);
        return ResponseEntity.ok("Vote deleted successfully.");
    }
}
