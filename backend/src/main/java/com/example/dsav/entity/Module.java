package com.example.dsav.entity;

import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "modules")
@Getter
@Setter @NoArgsConstructor
@AllArgsConstructor
@Builder
public class Module {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true, nullable = false)
    private String moduleKey;
    @Column(nullable = false)
    private String title;
    private String category;
    @Column(length = 1000)
    private String description;
}
