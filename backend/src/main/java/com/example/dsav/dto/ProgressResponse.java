package com.example.dsav.dto;

import com.example.dsav.entity.ProgressStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter @AllArgsConstructor
public class ProgressResponse {
    private String moduleKey;
    private ProgressStatus status;
    private String lastCodeSnapshot;
}