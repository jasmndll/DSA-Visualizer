package com.example.dsav.controller;

import com.example.dsav.dto.CodeExecutionRequest;
import com.example.dsav.dto.CodeExecutionResponse;
import com.example.dsav.service.CodeExecutionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/execute")
@RequiredArgsConstructor
public class CodeExecutionController {

    private final CodeExecutionService codeExecutionService;

    @PostMapping
    public CodeExecutionResponse execute(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CodeExecutionRequest request) {
        return codeExecutionService.execute(request, userDetails.getUsername());
    }
}