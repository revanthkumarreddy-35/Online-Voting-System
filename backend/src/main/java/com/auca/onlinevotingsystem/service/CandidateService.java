package com.auca.onlinevotingsystem.service;

import com.auca.onlinevotingsystem.exception.ResourceNotFoundException;
import com.auca.onlinevotingsystem.model.Candidate;
import com.auca.onlinevotingsystem.model.Election;
import com.auca.onlinevotingsystem.repository.CandidateRepository;
import com.auca.onlinevotingsystem.repository.ElectionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CandidateService {
    private final CandidateRepository candidateRepository;
    private final ElectionRepository electionRepository;

    public CandidateService(CandidateRepository candidateRepository, ElectionRepository electionRepository) {
        this.candidateRepository = candidateRepository;
        this.electionRepository = electionRepository;
    }

    public Candidate addCandidate(Long electionId, Candidate candidate) {
        Election election = electionRepository.findById(electionId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Election not found with ID: " + electionId));
        candidate.setElection(election);
        return candidateRepository.save(candidate);
    }

    public Candidate updateCandidate(Long candidateId, Candidate candidateDetails) {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Candidate not found with ID: " + candidateId));

        // Update basic fields
        candidate.setFullName(candidateDetails.getFullName());
        candidate.setParty(candidateDetails.getParty());
        candidate.setImage(candidateDetails.getImage());

        // If election is provided in candidateDetails, reassign it
        if (candidateDetails.getElection() != null) {
            Long newElectionId = candidateDetails.getElection().getElectionId();
            Election election = electionRepository.findById(newElectionId)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Election not found with ID: " + newElectionId));
            candidate.setElection(election);
        }

        return candidateRepository.save(candidate);
    }

    public void deleteCandidate(Long candidateId) {
        if (!candidateRepository.existsById(candidateId)) {
            throw new ResourceNotFoundException(
                    "Candidate not found with ID: " + candidateId);
        }
        candidateRepository.deleteById(candidateId);
    }

    public List<Candidate> getAllCandidatesWithElection() {
        return candidateRepository.findAllWithElection();
    }

    public List<Candidate> getCandidatesByElection(Long electionId) {
        return candidateRepository.findByElection_ElectionId(electionId);
    }

    public Long countVotesForCandidate(Long candidateId) {
        return candidateRepository.countVotesByCandidateId(candidateId);
    }

    public Candidate getCandidateById(Long candidateId) {
        return candidateRepository.findById(candidateId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Candidate not found with ID: " + candidateId));
    }

    public Candidate saveCandidate(Candidate candidate) {
        return candidateRepository.save(candidate);
    }
}
