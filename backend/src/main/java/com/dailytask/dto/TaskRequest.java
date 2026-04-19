package com.dailytask.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class TaskRequest {
    private Long id;
    private Long templateId;
    private String title;
    private String status;
    private Integer progress;
    private LocalDate dueDate;
    private List<TaskDataRequest> taskData;
}
