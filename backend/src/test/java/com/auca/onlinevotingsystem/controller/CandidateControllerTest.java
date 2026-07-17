package com.auca.onlinevotingsystem.controller;

import com.auca.onlinevotingsystem.config.AuthInterceptor;
import com.auca.onlinevotingsystem.model.Candidate;
import com.auca.onlinevotingsystem.service.CandidateService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CandidateController.class)
@AutoConfigureMockMvc(addFilters = false) // Ignore security/interceptor for basic unit tests
public class CandidateControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CandidateService candidateService;

    @MockBean
    private AuthInterceptor authInterceptor;

    @Test
    public void testGetAllCandidates() throws Exception {
        when(candidateService.getAllCandidatesWithElection()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/candidates"))
                .andExpect(status().isOk());
    }
}
