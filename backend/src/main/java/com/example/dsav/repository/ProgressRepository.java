package com.example.dsav.repository;

import com.example.dsav.entity.Progress;
import com.example.dsav.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProgressRepository extends JpaRepository<Progress, Long> {
    List<Progress> findByUser(User user);
    Optional<Progress> findByUserAndModule_ModuleKey(User user, String moduleKey);
}