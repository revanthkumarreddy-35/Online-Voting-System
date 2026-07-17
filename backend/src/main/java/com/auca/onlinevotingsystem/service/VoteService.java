// VoteService.java
package com.auca.onlinevotingsystem.service;

import com.auca.onlinevotingsystem.model.*;
import com.auca.onlinevotingsystem.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class VoteService {

    @Autowired
    private VoteRepository voteRepository;
    @Autowired
    private ElectionService electionService;
    @Autowired
    private CandidateService candidateService;
    @Autowired
    private CandidateRepository candidateRepository;

    public List<Vote> getAllVotes() {
        return voteRepository.findAll();
    }

    public Optional<Vote> getVoteById(Long voteId) {
        return voteRepository.findById(voteId);
    }

    public Vote saveVote(Vote vote) {
        return voteRepository.save(vote);
    }

    public void deleteVote(Long voteId) {
        voteRepository.deleteById(voteId);
    }

    public Optional<Vote> findVoteByUserAndElection(Long userId, Long electionId) {
        return voteRepository.findByUser_IdAndElection_ElectionId(userId, electionId);
    }

    public void validateVote(Long userId, Long electionId) {
        Election election = electionService.getElectionById(electionId);
        if (!election.isElectionStatus()) {
            throw new IllegalStateException("Election is not active.");
        }
        if (findVoteByUserAndElection(userId, electionId).isPresent()) {
            throw new IllegalStateException("User has already voted in this election.");
        }
    }

    public Long getVoteCountForCandidate(Long candidateId) {
        return voteRepository.countVotesByCandidateId(candidateId);
    }

	public CandidateService getCandidateService() {
		return candidateService;
	}

	public void setCandidateService(CandidateService candidateService) {
		this.candidateService = candidateService;
	}

	public CandidateRepository getCandidateRepository() {
		return candidateRepository;
	}

	public void setCandidateRepository(CandidateRepository candidateRepository) {
		this.candidateRepository = candidateRepository;
	}
}
