package com.dailytask.entity;

import lombok.Data;

@Data
public class TaskData {
    private Long id;
    private Long taskId;
    private Long fieldId;
    private String fieldValue;
}
