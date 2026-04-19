package com.dailytask.controller;

import com.dailytask.dto.FieldRequest;
import com.dailytask.dto.Result;
import com.dailytask.dto.TemplateRequest;
import com.dailytask.entity.TaskTemplate;
import com.dailytask.entity.TemplateField;
import com.dailytask.service.TaskTemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/templates")
public class TaskTemplateController {

    @Autowired
    private TaskTemplateService taskTemplateService;

    @GetMapping
    public Result<List<TaskTemplate>> list() {
        List<TaskTemplate> templates = taskTemplateService.findAll();
        return Result.success(templates);
    }

    @GetMapping("/{id}")
    public Result<Map<String, Object>> getById(@PathVariable Long id) {
        TaskTemplate template = taskTemplateService.findById(id);
        if (template == null) {
            return Result.error("模板不存在");
        }
        List<TemplateField> fields = taskTemplateService.getTemplateFields(id);
        Map<String, Object> result = new HashMap<>();
        result.put("template", template);
        result.put("fields", fields);
        return Result.success(result);
    }

    @GetMapping("/{id}/fields")
    public Result<List<TemplateField>> getFields(@PathVariable Long id) {
        List<TemplateField> fields = taskTemplateService.getTemplateFields(id);
        return Result.success(fields);
    }

    @PostMapping
    public Result<TaskTemplate> create(@RequestBody TemplateRequest request) {
        TaskTemplate template = new TaskTemplate();
        template.setName(request.getName());
        template.setDescription(request.getDescription());
        
        List<TemplateField> fields = convertToFields(request.getFields());
        
        TaskTemplate created = taskTemplateService.create(template, fields);
        return Result.success(created);
    }

    @PutMapping("/{id}")
    public Result<TaskTemplate> update(@PathVariable Long id, @RequestBody TemplateRequest request) {
        TaskTemplate template = new TaskTemplate();
        template.setId(id);
        template.setName(request.getName());
        template.setDescription(request.getDescription());
        
        List<TemplateField> fields = convertToFields(request.getFields());
        
        TaskTemplate updated = taskTemplateService.update(id, template, fields);
        return Result.success(updated);
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        taskTemplateService.delete(id);
        return Result.success();
    }

    private List<TemplateField> convertToFields(List<FieldRequest> fieldRequests) {
        if (fieldRequests == null) {
            return new ArrayList<>();
        }
        List<TemplateField> fields = new ArrayList<>();
        for (FieldRequest fr : fieldRequests) {
            TemplateField field = new TemplateField();
            field.setFieldName(fr.getFieldName());
            field.setFieldLabel(fr.getFieldLabel());
            field.setFieldType(fr.getFieldType());
            field.setMaxLength(fr.getMaxLength());
            field.setRequired(fr.getRequired());
            field.setSortOrder(fr.getSortOrder());
            field.setDefaultValue(fr.getDefaultValue());
            field.setOptions(fr.getOptions());
            fields.add(field);
        }
        return fields;
    }
}
