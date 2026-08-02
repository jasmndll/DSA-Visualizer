package com.example.dsav.repository;

import com.example.dsav.entity.Module;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ModuleRepository extends JpaRepository<Module, Long> {
    Optional<Module> findByModuleKey(String moduleKey);
}