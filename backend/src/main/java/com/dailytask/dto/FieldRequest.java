package com.dailytask.dto;

import lombok.Data;

@Data
public class FieldRequest {
    private Long id;
    private String fieldName;
    private String fieldLabel;
    private String fieldType;
    private Integer maxLength;
    private Boolean required;
    private Integer sortOrder;
    private String defaultValue;
    private String options;
}
