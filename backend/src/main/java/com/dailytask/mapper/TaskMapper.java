package com.dailytask.mapper;

import com.dailytask.entity.Task;
import org.apache.ibatis.annotations.*;
import java.util.List;

@Mapper
public interface TaskMapper {
    List<Task> findAll();
    
    List<Task> findByTemplateId(Long templateId);
    
    List<Task> findByStatus(String status);
    
    Task findById(Long id);
    
    void insert(Task task);
    
    void update(Task task);
    
    void deleteById(Long id);
    
    List<Task> findByFilter(@Param("templateId") Long templateId, 
                            @Param("status") String status,
                            @Param("keyword") String keyword);
}
