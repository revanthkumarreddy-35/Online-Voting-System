// VoteController.java
package com.auca.VotingApp2.controller;

import com.auca.VotingApp2.dto.CandidateDto;
import com.auca.VotingApp2.model.*;
import com.auca.VotingApp2.service.*;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

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

    @PostMapping(consumes = "application/json", produces = "application/json")
    public ResponseEntity<String> castVote(@RequestBody CandidateDto candidateDto,
                                           @RequestHeader Map<String, String> headers,
                                           HttpSession session) {
        try {
            headers.forEach((key, value) -> System.out.println(key + ": " + value));
            long userId = candidateDto.getUserId();
            Candidate candidate = candidateService.getCandidateById(candidateDto.getCandidateId());

            User user = new User();
            user.setId(userId);

            Vote vote = new Vote();
            vote.setCandidate(candidate);
            vote.setElection(((Candidate) candidate).getElection());
            vote.setUser(user);
            vote.setVoteTime(LocalDateTime.now());

            voteService.saveVote(vote);
            return ResponseEntity.ok("Vote cast successfully.");
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.badRequest().body(ex.getMessage());
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
