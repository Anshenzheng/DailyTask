package com.dailytask.service.impl;

import com.dailytask.entity.Task;
import com.dailytask.entity.TaskData;
import com.dailytask.mapper.TaskDataMapper;
import com.dailytask.mapper.TaskMapper;
import com.dailytask.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TaskServiceImpl implements TaskService {

    @Autowired
    private TaskMapper taskMapper;

    @Autowired
    private TaskDataMapper taskDataMapper;

    @Override
    public List<Task> findAll() {
        return taskMapper.findAll();
    }

    @Override
    public List<Task> findByTemplateId(Long templateId) {
        return taskMapper.findByTemplateId(templateId);
    }

    @Override
    public List<Task> findByFilter(Long templateId, String status, String keyword) {
        return taskMapper.findByFilter(templateId, status, keyword);
    }

    @Override
    public Task findById(Long id) {
        return taskMapper.findById(id);
    }

    @Override
    public List<TaskData> getTaskData(Long taskId) {
        return taskDataMapper.findByTaskId(taskId);
    }

    @Override
    @Transactional
    public Task create(Task task, List<TaskData> taskDataList) {
        if (task.getStatus() == null || task.getStatus().isEmpty()) {
            task.setStatus("待开始");
        }
        if (task.getProgress() == null) {
            task.setProgress(0);
        }
        taskMapper.insert(task);
        
        if (taskDataList != null && !taskDataList.isEmpty()) {
            for (TaskData data : taskDataList) {
                data.setTaskId(task.getId());
                taskDataMapper.insert(data);
            }
        }
        return task;
    }

    @Override
    @Transactional
    public Task update(Long id, Task task, List<TaskData> taskDataList) {
        Task existing = taskMapper.findById(id);
        if (existing == null) {
            throw new RuntimeException("任务不存在");
        }
        task.setId(id);
        taskMapper.update(task);
        
        taskDataMapper.deleteByTaskId(id);
        if (taskDataList != null && !taskDataList.isEmpty()) {
            for (TaskData data : taskDataList) {
                data.setTaskId(id);
                taskDataMapper.insert(data);
            }
        }
        return task;
    }

    @Override
    @Transactional
    public void delete(Long id) {
        taskDataMapper.deleteByTaskId(id);
        taskMapper.deleteById(id);
    }

    @Override
    @Transactional
    public Task updateStatus(Long id, String status) {
        Task task = taskMapper.findById(id);
        if (task == null) {
            throw new RuntimeException("任务不存在");
        }
        task.setStatus(status);
        taskMapper.update(task);
        return task;
    }

    @Override
    @Transactional
    public Task updateProgress(Long id, Integer progress) {
        Task task = taskMapper.findById(id);
        if (task == null) {
            throw new RuntimeException("任务不存在");
        }
        task.setProgress(progress);
        if (progress >= 100) {
            task.setStatus("已完成");
        } else if (progress > 0) {
            task.setStatus("进行中");
        }
        taskMapper.update(task);
        return task;
    }
}
