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

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CodeExecutionService {

    private final WebClient webClient;
    private final UserRepository userRepository;
    private final ModuleRepository moduleRepository;
    private final CodeSubmissionRepository codeSubmissionRepository;

    @Value("${glot.api.url}")
    private String glotUrl;

    @Value("${glot.api.token}")
    private String glotToken;

    private static final Map<String, String> LANGUAGE_SLUGS = Map.of(
            "javascript", "javascript",
            "python", "python",
            "java", "java",
            "cpp", "cpp"
    );

    private static final Map<String, String> FILE_EXTENSIONS = Map.of(
            "javascript", "js",
            "python", "py",
            "java", "java",
            "cpp", "cpp"
    );

    public CodeExecutionResponse execute(CodeExecutionRequest request, String username) {
        String slug = LANGUAGE_SLUGS.get(request.getLanguage());
        String extension = FILE_EXTENSIONS.get(request.getLanguage());
        if (slug == null) {
            throw new IllegalArgumentException("Unsupported language: " + request.getLanguage());
        }

        String fileName = "java".equals(request.getLanguage())
                ? "Main.java"
                : "main." + extension;

        Map<String, Object> body = Map.of(
                "files", List.of(Map.of(
                        "name", fileName,
                        "content", request.getCode()
                )),
                "stdin", request.getStdin() != null ? request.getStdin() : ""
        );

        Map<String, Object> result = webClient.post()
                .uri(glotUrl + "/run/" + slug + "/latest")
                .header("Authorization", "Token " + glotToken)
                .header("Content-Type", "application/json")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        String stdout = (String) result.get("stdout");
        String stderr = (String) result.get("stderr");
        String status = (stderr == null || stderr.isEmpty()) ? "Success" : "Runtime Error";

        saveSubmission(request, username, stdout, stderr, status);

        return new CodeExecutionResponse(stdout, stderr, status);
    }

    // Records every run so the heatmap (and later, submission history)
    // has real data to aggregate. Failing to save shouldn't break the
    // actual code execution response the student is waiting on, so this
    // stays a simple best-effort call rather than wrapping execute()
    // itself in extra risk.
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