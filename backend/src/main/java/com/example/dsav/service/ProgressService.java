package com.example.dsav.service;

import com.example.dsav.dto.ProgressResponse;
import com.example.dsav.entity.CodeSubmission;
import com.example.dsav.entity.Module;
import com.example.dsav.entity.Progress;
import com.example.dsav.entity.ProgressStatus;
import com.example.dsav.entity.User;
import com.example.dsav.repository.CodeSubmissionRepository;
import com.example.dsav.repository.ModuleRepository;
import com.example.dsav.repository.ProgressRepository;
import com.example.dsav.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProgressService {

    private final ProgressRepository progressRepository;
    private final UserRepository userRepository;
    private final ModuleRepository moduleRepository;
    private final CodeSubmissionRepository codeSubmissionRepository;

    public List<ProgressResponse> getProgressForUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return progressRepository.findByUser(user).stream()
                .map(p -> new ProgressResponse(p.getModule().getModuleKey(), p.getStatus(), p.getLastCodeSnapshot()))
                .toList();
    }

    public ProgressResponse updateProgress(String username, String moduleKey, ProgressStatus status, String codeSnapshot) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Module module = moduleRepository.findByModuleKey(moduleKey)
                .orElseThrow(() -> new IllegalArgumentException("Module not found: " + moduleKey));

        Progress progress = progressRepository.findByUserAndModule_ModuleKey(user, moduleKey)
                .orElse(Progress.builder().user(user).module(module).build());

        progress.setStatus(status);
        if (codeSnapshot != null) {
            progress.setLastCodeSnapshot(codeSnapshot);
        }
        progress.setUpdatedAt(LocalDateTime.now());

        progressRepository.save(progress);

        return new ProgressResponse(moduleKey, progress.getStatus(), progress.getLastCodeSnapshot());
    }

    public Map<String, Long> getHeatmap(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<CodeSubmission> submissions = codeSubmissionRepository.findByUserOrderByCreatedAtDesc(user);

        return submissions.stream()
                .collect(Collectors.groupingBy(
                        s -> s.getCreatedAt().toLocalDate().toString(),
                        Collectors.counting()
                ));
    }
}