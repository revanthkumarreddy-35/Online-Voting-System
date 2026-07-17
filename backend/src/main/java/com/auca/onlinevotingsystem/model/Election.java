package com.auca.onlinevotingsystem.model;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;
@Data
@Entity
@Table(name = "Election")

public class Election {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long electionId;
    @NotBlank(message = "Election name is required")
    private String electionName;
    
    @NotBlank(message = "Election description is required")
    private String electionDescription;
    
    private String image;
    
    @NotBlank(message = "Start date is required")
    private String electionStartDate;
    
    @NotBlank(message = "End date is required")
    private String electionEndDate;
    
    private String electionTime;
    private boolean electionStatus;
    //@JsonIgnore
    @OneToMany(mappedBy = "election", cascade = CascadeType.ALL)

    @JsonBackReference
    //@JsonManagedReference
    private List<Candidate> candidates;

    @OneToMany(mappedBy = "election")
    @JsonIgnore
    private List<Vote> votes;

}
