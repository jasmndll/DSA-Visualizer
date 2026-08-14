package com.example.dsav.service;

import com.example.dsav.dto.CodeExecutionRequest;
import com.example.dsav.dto.CodeExecutionResponse;
import com.example.dsav.entity.CodeSubmission;
import com.example.dsav.entity.Module;
import com.example.dsav.entity.User;
import com.example.dsav.repository.CodeSubmissionRepository;
import com.example.dsav.repository.ModuleRepository;
import com.example.dsav.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

// Calls OnlineCompiler.io (https://onlinecompiler.io/docs) - sync REST
// endpoint, free tier: 1,000,000 requests/month, no card required.
@Service
@RequiredArgsConstructor
public class CodeExecutionService {

    private final WebClient webClient;
    private final UserRepository userRepository;
    private final ModuleRepository moduleRepository;
    private final CodeSubmissionRepository codeSubmissionRepository;

    @Value("${onlinecompiler.api.url}")
    private String apiUrl;

    @Value("${onlinecompiler.api.key}")
    private String apiKey;

    // JavaScript isn't a distinct compiler here - Deno's TypeScript
    // runtime executes standard JS syntax fine, so it's the closest fit.
    private static final Map<String, String> COMPILERS = Map.of(
            "javascript", "typescript-deno",
            "python", "python-3.14",
            "java", "openjdk-25",
            "cpp", "g++-15"
    );

    public CodeExecutionResponse execute(CodeExecutionRequest request, String username) {
        String compiler = COMPILERS.get(request.getLanguage());
        if (compiler == null) {
            throw new IllegalArgumentException("Unsupported language: " + request.getLanguage());
        }

        Map<String, Object> body = Map.of(
                "compiler", compiler,
                "code", request.getCode(),
                "input", request.getStdin() != null ? request.getStdin() : ""
        );

        Map<String, Object> result = webClient.post()
                .uri(apiUrl)
                .header("Authorization", apiKey)
                .header("Content-Type", "application/json")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        String stdout = (String) result.get("output");
        String stderr = (String) result.get("error");
        String status = "success".equals(result.get("status")) ? "Success" : "Runtime Error";

        saveSubmission(request, username, stdout, stderr, status);

        return new CodeExecutionResponse(stdout, stderr, status);
    }

    private void saveSubmission(CodeExecutionRequest request, String username,
                                String stdout, String stderr, String status) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) return;

        Module module = request.getModuleKey() != null
                ? moduleRepository.findByModuleKey(request.getModuleKey()).orElse(null)
                : null;

        CodeSubmission submission = CodeSubmission.builder()
                .user(user)
                .module(module)
                .language(request.getLanguage())
                .code(request.getCode())
                .stdout(stdout)
                .stderr(stderr)
                .status(status)
                .build();

        codeSubmissionRepository.save(submission);
    }
}