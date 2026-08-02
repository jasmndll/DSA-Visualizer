package com.example.dsav.controller;

import com.example.dsav.dto.ProgressResponse;
import com.example.dsav.entity.ProgressStatus;
import com.example.dsav.service.ProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class ProgressController {

    private final ProgressService progressService;

    @GetMapping
    public List<ProgressResponse> getMyProgress(@AuthenticationPrincipal UserDetails userDetails) {
        return progressService.getProgressForUser(userDetails.getUsername());
    }

    @PutMapping("/{moduleKey}")
    public ProgressResponse updateProgress(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String moduleKey,
            @RequestParam ProgressStatus status,
            @RequestBody(required = false) String codeSnapshot) {
        return progressService.updateProgress(userDetails.getUsername(), moduleKey, status, codeSnapshot);
    }

    @GetMapping("/heatmap")
    public Map<String, Long> getHeatmap(@AuthenticationPrincipal UserDetails userDetails) {
        return progressService.getHeatmap(userDetails.getUsername());
    }
}