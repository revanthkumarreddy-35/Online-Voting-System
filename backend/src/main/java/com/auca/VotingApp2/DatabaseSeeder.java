package com.auca.VotingApp2;

import com.auca.VotingApp2.model.Candidate;
import com.auca.VotingApp2.model.Election;
import com.auca.VotingApp2.model.Role;
import com.auca.VotingApp2.model.User;
import com.auca.VotingApp2.repository.CandidateRepository;
import com.auca.VotingApp2.repository.ElectionRepository;
import com.auca.VotingApp2.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final ElectionRepository electionRepository;
    private final CandidateRepository candidateRepository;
    private final UserRepository userRepository;

    public DatabaseSeeder(ElectionRepository electionRepository, CandidateRepository candidateRepository, UserRepository userRepository) {
        this.electionRepository = electionRepository;
        this.candidateRepository = candidateRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Seed Master Admin
        if (userRepository.findByUsername("masteradmin") == null) {
            System.out.println("Seeding master admin user...");
            User masterAdmin = new User();
            masterAdmin.setUsername("masteradmin");
            masterAdmin.setPassword("masterpass");
            masterAdmin.setFirstName("Master");
            masterAdmin.setLastName("Admin");
            masterAdmin.setEmail("masteradmin@votecast.com");
            masterAdmin.setPhoneNumber("0000000000");
            masterAdmin.setPhoto("https://ui-avatars.com/api/?name=Master+Admin&background=6d28d9&color=fff");
            masterAdmin.setRole(Role.ROLE_MASTER_ADMIN);
            masterAdmin.setStatus(com.auca.VotingApp2.model.UserStatus.APPROVED);
            userRepository.save(masterAdmin);
        }

        if (userRepository.findByUsername("admin1") == null) {
            System.out.println("Seeding admin user...");
            User admin = new User();
            admin.setUsername("admin1");
            admin.setPassword("adminpass");
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setEmail("admin@votecast.com");
            admin.setPhoneNumber("1234567890");
            admin.setPhoto("https://ui-avatars.com/api/?name=Admin+User&background=random");
            admin.setRole(Role.ROLE_ADMIN);
            admin.setStatus(com.auca.VotingApp2.model.UserStatus.APPROVED);
            userRepository.save(admin);
        }
        if (userRepository.findByUsername("voter1") == null) {
            System.out.println("Seeding voter1 user...");
            User voter = new User();
            voter.setUsername("voter1");
            voter.setPassword("voterpass");
            voter.setFirstName("Voter");
            voter.setLastName("User");
            voter.setEmail("voter@votecast.com");
            voter.setPhoneNumber("0987654321");
            voter.setPhoto("https://ui-avatars.com/api/?name=Voter+User&background=random");
            voter.setRole(Role.ROLE_USER);
            voter.setStatus(com.auca.VotingApp2.model.UserStatus.APPROVED);
            userRepository.save(voter);
        }

        if (electionRepository.count() == 0) {
            System.out.println("Seeding initial elections...");
            
            Election election1 = new Election();
            election1.setElectionName("2024 Presidential Election");
            election1.setElectionDescription("National Presidential Election");
            election1.setElectionStartDate("2024-11-01");
            election1.setElectionEndDate("2024-11-05");
            election1.setImage("https://via.placeholder.com/150/0000FF/808080?Text=Pres");
            
            Election election2 = new Election();
            election2.setElectionName("Local City Council");
            election2.setElectionDescription("Vote for local representatives");
            election2.setElectionStartDate("2024-05-10");
            election2.setElectionEndDate("2024-05-15");
            election2.setImage("https://via.placeholder.com/150/FF0000/FFFFFF?Text=City");

            electionRepository.saveAll(List.of(election1, election2));

            if (candidateRepository.count() == 0) {
                System.out.println("Seeding initial candidates...");
                
                Candidate cand1 = new Candidate();
                cand1.setFullName("Alice Johnson");
                cand1.setParty("Democratic Party");
                cand1.setElection(election1);
                cand1.setImage("https://randomuser.me/api/portraits/women/44.jpg");

                Candidate cand2 = new Candidate();
                cand2.setFullName("Bob Smith");
                cand2.setParty("Republican Party");
                cand2.setElection(election1);
                cand2.setImage("https://randomuser.me/api/portraits/men/32.jpg");

                Candidate cand3 = new Candidate();
                cand3.setFullName("Charlie Davis");
                cand3.setParty("Independent");
                cand3.setElection(election2);
                cand3.setImage("https://randomuser.me/api/portraits/men/65.jpg");

                candidateRepository.saveAll(List.of(cand1, cand2, cand3));
            }
        }
    }
}
