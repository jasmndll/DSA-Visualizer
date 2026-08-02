package com.example.dsav.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "progress", uniqueConstraints = @UniqueConstraint(
        columnNames = {"user_id", "module_id"}
))
@Getter @Setter @NoArgsConstructor
@AllArgsConstructor
@Builder
public class Progress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "module_id", nullable = false)
    private Module module;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ProgressStatus status = ProgressStatus.NOT_STARTED;
    @Column(columnDefinition = "TEXT")
    private String lastCodeSnapshot;

    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
