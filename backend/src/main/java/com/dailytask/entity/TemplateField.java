package com.dailytask.entity;

import lombok.Data;

@Data
public class TemplateField {
    private Long id;
    private Long templateId;
    private String fieldName;
    private String fieldLabel;
    private String fieldType;
    private Integer maxLength;
    private Boolean required;
    private Integer sortOrder;
    private String defaultValue;
    private String options;
}
