package com.dailytask.entity;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class Task {
    private Long id;
    private Long templateId;
    private String title;
    private String status;
    private Integer progress;
    private LocalDate dueDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
