// ElectionService.java
package com.auca.onlinevotingsystem.service;

import com.auca.onlinevotingsystem.exception.ResourceNotFoundException;
import com.auca.onlinevotingsystem.model.Election;
import com.auca.onlinevotingsystem.repository.ElectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ElectionService {
    @Autowired
    private ElectionRepository electionRepository;

    public List<Election> getAllElections() {
        return electionRepository.findAll();
    }

    public Election getElectionById(long id) {
        return electionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Election not found with ID: " + id));
    }

    public Election createElection(Election election) {
        return electionRepository.save(election);
    }

    public Election updateElection(long id, Election updatedElection) {
        return electionRepository.findById(id).map(existingElection -> {
            existingElection.setElectionName(updatedElection.getElectionName());
            existingElection.setElectionDescription(updatedElection.getElectionDescription());
            existingElection.setImage(updatedElection.getImage());
            existingElection.setElectionStartDate(updatedElection.getElectionStartDate());
            existingElection.setElectionEndDate(updatedElection.getElectionEndDate());
            existingElection.setElectionTime(updatedElection.getElectionTime());
            existingElection.setElectionStatus(updatedElection.isElectionStatus());
            return electionRepository.save(existingElection);
        }).orElseThrow(() -> new RuntimeException("Election not found with id " + id));
    }

    public void deleteElection(long id) {
        electionRepository.deleteById(id);
    }
}
