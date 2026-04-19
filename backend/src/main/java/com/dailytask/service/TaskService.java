package com.dailytask.service;

import com.dailytask.entity.Task;
import com.dailytask.entity.TaskData;
import java.util.List;

public interface TaskService {
    List<Task> findAll();
    
    List<Task> findByTemplateId(Long templateId);
    
    List<Task> findByFilter(Long templateId, String status, String keyword);
    
    Task findById(Long id);
    
    List<TaskData> getTaskData(Long taskId);
    
    Task create(Task task, List<TaskData> taskDataList);
    
    Task update(Long id, Task task, List<TaskData> taskDataList);
    
    void delete(Long id);
    
    Task updateStatus(Long id, String status);
    
    Task updateProgress(Long id, Integer progress);
}
