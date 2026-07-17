package com.auca.VotingApp2.repository;

import com.auca.VotingApp2.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // Change findByUsername to return Optional and match your new field
    User findByUsername(String username);

    Optional<User> findByEmail(String email);

	List<User> findByUsernameContainingOrEmailContaining(String username, String email);
}
