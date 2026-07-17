// UserService.java
package com.auca.VotingApp2.service;

import com.auca.VotingApp2.exception.ResourceNotFoundException;
import com.auca.VotingApp2.model.ResetToken;

import com.auca.VotingApp2.model.User;
import com.auca.VotingApp2.repository.ResetTokenRepository;
import com.auca.VotingApp2.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ResetTokenRepository resetTokenRepository;
    @Autowired
    private JavaMailSender mailSender;

    @Transactional
    public boolean sendPasswordResetEmail(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isEmpty()) return false;
        deleteExistingResetTokenByEmail(email);
        String token = UUID.randomUUID().toString();
        saveResetTokenForUser(user.get(), token);
        String resetUrl = "http://localhost:3000/reset-password?token=" + token;
        sendEmail(email, "Password Reset", "To reset your password, click:\n" + resetUrl);
        return true;
    }

	@Transactional
    protected void saveResetTokenForUser(User user, String token) {
        ResetToken resetToken = new ResetToken();
        resetToken.setUser(user);
        resetToken.setToken(token);
        resetToken.setExpiryDate(LocalDateTime.now().plusMinutes(15));
        resetTokenRepository.save(resetToken);
    }

    @Transactional
    public void deleteExistingResetTokenByEmail(String email) {
    	Optional<User> user = userRepository.findByEmail(email);
    	if (user.isPresent()) {
    	    // Logic to delete existing tokens can be implemented here
            // resetTokenRepository.deleteByUser(user.get());
    	}
    }

    private void sendEmail(String to, String subject, String body) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(to);
        msg.setSubject(subject);
        msg.setText(body);
        mailSender.send(msg);
    }

    public boolean doesEmailExist(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    @Transactional
    public User registerUser(User user) {
        return userRepository.save(user);
    }

    public User loginUser(String username) {
        return userRepository.findByUsername(username);
    }

    // ... password reset validation and CRUD below ...

    public Page<User> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
    }

    @Transactional
    public void updateUser(User user) {
        userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            System.out.println("Deleted user ID " + id);
        } else {
            System.out.println("User ID " + id + " not found");
        }
    }

    public List<User> searchUsers(String username, String email) {
        return userRepository.findByUsernameContainingOrEmailContaining(username, email);
    }

    public void saveAll(List<User> userList) {
        userRepository.saveAll(userList);
    }

	public boolean validatePasswordResetToken(String token) {
		// TODO Auto-generated method stub
		return false;
	}

	public boolean resetUserPassword(String token, String newPassword) {
		// TODO Auto-generated method stub
		return false;
	}

    // ... remaining password-reset methods omitted for brevity ...
}
