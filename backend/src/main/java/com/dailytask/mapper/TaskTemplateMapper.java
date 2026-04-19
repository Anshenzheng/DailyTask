package com.dailytask.mapper;

import com.dailytask.entity.TaskTemplate;
import org.apache.ibatis.annotations.*;
import java.util.List;

@Mapper
public interface TaskTemplateMapper {
    List<TaskTemplate> findAll();
    
    TaskTemplate findById(Long id);
    
    void insert(TaskTemplate template);
    
    void update(TaskTemplate template);
    
    void deleteById(Long id);
}
