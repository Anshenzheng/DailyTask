package com.dailytask.mapper;

import com.dailytask.entity.TaskData;
import org.apache.ibatis.annotations.*;
import java.util.List;

@Mapper
public interface TaskDataMapper {
    List<TaskData> findByTaskId(Long taskId);
    
    TaskData findById(Long id);
    
    void insert(TaskData taskData);
    
    void update(TaskData taskData);
    
    void deleteById(Long id);
    
    void deleteByTaskId(Long taskId);
}
