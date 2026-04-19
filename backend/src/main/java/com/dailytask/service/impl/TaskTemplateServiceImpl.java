package com.dailytask.service.impl;

import com.dailytask.entity.TaskTemplate;
import com.dailytask.entity.TemplateField;
import com.dailytask.mapper.TaskTemplateMapper;
import com.dailytask.mapper.TemplateFieldMapper;
import com.dailytask.service.TaskTemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TaskTemplateServiceImpl implements TaskTemplateService {

    @Autowired
    private TaskTemplateMapper taskTemplateMapper;

    @Autowired
    private TemplateFieldMapper templateFieldMapper;

    @Override
    public List<TaskTemplate> findAll() {
        return taskTemplateMapper.findAll();
    }

    @Override
    public TaskTemplate findById(Long id) {
        return taskTemplateMapper.findById(id);
    }

    @Override
    public List<TemplateField> getTemplateFields(Long templateId) {
        return templateFieldMapper.findByTemplateId(templateId);
    }

    @Override
    @Transactional
    public TaskTemplate create(TaskTemplate template, List<TemplateField> fields) {
        taskTemplateMapper.insert(template);
        if (fields != null && !fields.isEmpty()) {
            for (TemplateField field : fields) {
                field.setTemplateId(template.getId());
                templateFieldMapper.insert(field);
            }
        }
        return template;
    }

    @Override
    @Transactional
    public TaskTemplate update(Long id, TaskTemplate template, List<TemplateField> fields) {
        TaskTemplate existing = taskTemplateMapper.findById(id);
        if (existing == null) {
            throw new RuntimeException("模板不存在");
        }
        template.setId(id);
        taskTemplateMapper.update(template);
        
        templateFieldMapper.deleteByTemplateId(id);
        if (fields != null && !fields.isEmpty()) {
            for (TemplateField field : fields) {
                field.setTemplateId(id);
                templateFieldMapper.insert(field);
            }
        }
        return template;
    }

    @Override
    @Transactional
    public void delete(Long id) {
        templateFieldMapper.deleteByTemplateId(id);
        taskTemplateMapper.deleteById(id);
    }
}
