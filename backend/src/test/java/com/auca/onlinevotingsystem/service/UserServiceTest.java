package com.auca.onlinevotingsystem.service;

import com.auca.onlinevotingsystem.model.Role;
import com.auca.onlinevotingsystem.model.User;
import com.auca.onlinevotingsystem.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    public void testRegisterUser() {
        User user = new User();
        user.setUsername("newuser");
        user.setRole(Role.ROLE_USER);

        when(userRepository.save(any(User.class))).thenReturn(user);

        User savedUser = userService.registerUser(user);
        assertThat(savedUser).isNotNull();
        assertThat(savedUser.getUsername()).isEqualTo("newuser");
    }
}
