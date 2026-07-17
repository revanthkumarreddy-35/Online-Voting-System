package com.auca.onlinevotingsystem.repository;

import com.auca.onlinevotingsystem.model.Role;
import com.auca.onlinevotingsystem.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testSaveUserAndFindByUsername() {
        User user = new User();
        user.setUsername("testuser");
        user.setRole(Role.ROLE_USER);
        user.setEmail("test@test.com");
        user.setFirstName("Test");
        user.setLastName("User");
        user.setPassword("password");
        user.setPhoneNumber("1234567890");
        userRepository.save(user);

        User foundUser = userRepository.findByUsername("testuser");
        assertThat(foundUser).isNotNull();
        assertThat(foundUser.getUsername()).isEqualTo("testuser");
    }
}
