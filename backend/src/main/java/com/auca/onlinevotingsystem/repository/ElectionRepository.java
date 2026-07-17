package com.auca.onlinevotingsystem.repository;

import com.auca.onlinevotingsystem.model.Election;

import java.util.Optional;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ElectionRepository extends JpaRepository<Election, Long> {

	Optional<Election> findById(Long id);


}
