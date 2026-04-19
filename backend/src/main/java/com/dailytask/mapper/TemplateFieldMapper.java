package com.dailytask.mapper;

import com.dailytask.entity.TemplateField;
import org.apache.ibatis.annotations.*;
import java.util.List;

@Mapper
public interface TemplateFieldMapper {
    List<TemplateField> findByTemplateId(Long templateId);
    
    TemplateField findById(Long id);
    
    void insert(TemplateField field);
    
    void update(TemplateField field);
    
    void deleteById(Long id);
    
    void deleteByTemplateId(Long templateId);
}
