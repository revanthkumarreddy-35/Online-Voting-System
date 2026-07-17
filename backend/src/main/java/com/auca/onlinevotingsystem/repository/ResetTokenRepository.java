package com.auca.onlinevotingsystem.repository;



import com.auca.onlinevotingsystem.model.ResetToken;
import com.auca.onlinevotingsystem.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ResetTokenRepository extends JpaRepository<ResetToken, Long> {
    void deleteByToken(String token);
    Optional<ResetToken> findByUser(User user);
    Optional<ResetToken> findByToken(String token);
	Optional<User> findAllById(Optional<User> user);


}
