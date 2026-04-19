package com.dailytask.service;

import com.dailytask.entity.TaskTemplate;
import com.dailytask.entity.TemplateField;
import java.util.List;

public interface TaskTemplateService {
    List<TaskTemplate> findAll();
    
    TaskTemplate findById(Long id);
    
    List<TemplateField> getTemplateFields(Long templateId);
    
    TaskTemplate create(TaskTemplate template, List<TemplateField> fields);
    
    TaskTemplate update(Long id, TaskTemplate template, List<TemplateField> fields);
    
    void delete(Long id);
}
