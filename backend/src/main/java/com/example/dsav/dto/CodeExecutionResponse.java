package com.example.dsav.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter @AllArgsConstructor
public class CodeExecutionResponse {
    private String stdout;
    private String stderr;
    private String status;
}