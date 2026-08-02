package com.example.dsav.service;

import com.example.dsav.dto.ChatRequest;
import com.example.dsav.dto.ChatResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final WebClient webClient;

    @Value("${groq.api.url}")
    private String groqUrl;

    @Value("${groq.api.key}")
    private String groqKey;

    public ChatResponse chat(ChatRequest request) {
        String systemPrompt = "You are a friendly DSA tutor helping a beginner learn data structures "
                + "and algorithms. Keep answers concise and scannable — short paragraphs, "
                + "bullet points where helpful, and code in properly fenced markdown code "
                + "blocks with the correct language tag. Avoid long unbroken paragraphs. "
                + (request.getModuleContext() != null
                ? "The student is currently looking at: " + request.getModuleContext() + "."
                : "");

        Map<String, Object> body = Map.of(
                "model", "llama-3.3-70b-versatile",
                "messages", List.of(
                        Map.of("role", "system", "content", systemPrompt),
                        Map.of("role", "user", "content", request.getMessage())
                )
        );

        Map<String, Object> result = webClient.post()
                .uri(groqUrl)
                .header("Authorization", "Bearer " + groqKey)
                .header("Content-Type", "application/json")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        List<?> choices = (List<?>) result.get("choices");
        Map<?, ?> firstChoice = (Map<?, ?>) choices.get(0);
        Map<?, ?> message = (Map<?, ?>) firstChoice.get("message");
        String reply = (String) message.get("content");

        return new ChatResponse(reply);
    }
}