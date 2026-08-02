package com.example.dsav.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CodeExecutionRequest {
    @NotBlank
    private String language;

    @NotBlank
    private String code;

    private String stdin;

    private String moduleKey;
}