package com.dailytask.dto;

import lombok.Data;
import java.util.List;

@Data
public class TemplateRequest {
    private Long id;
    private String name;
    private String description;
    private List<FieldRequest> fields;
}
