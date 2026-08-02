package com.example.dsav.repository;

import com.example.dsav.entity.CodeSubmission;
import com.example.dsav.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CodeSubmissionRepository extends JpaRepository<CodeSubmission, Long> {
    List<CodeSubmission> findByUserOrderByCreatedAtDesc(User user);
}