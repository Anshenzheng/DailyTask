package com.dailytask.controller;

import com.dailytask.dto.Result;
import com.dailytask.dto.TaskDataRequest;
import com.dailytask.dto.TaskRequest;
import com.dailytask.entity.Task;
import com.dailytask.entity.TaskData;
import com.dailytask.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping
    public Result<List<Task>> list(
            @RequestParam(required = false) Long templateId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String keyword) {
        List<Task> tasks = taskService.findByFilter(templateId, status, keyword);
        return Result.success(tasks);
    }

    @GetMapping("/{id}")
    public Result<Map<String, Object>> getById(@PathVariable Long id) {
        Task task = taskService.findById(id);
        if (task == null) {
            return Result.error("任务不存在");
        }
        List<TaskData> taskData = taskService.getTaskData(id);
        Map<String, Object> result = new HashMap<>();
        result.put("task", task);
        result.put("taskData", taskData);
        return Result.success(result);
    }

    @PostMapping
    public Result<Task> create(@RequestBody TaskRequest request) {
        Task task = new Task();
        task.setTemplateId(request.getTemplateId());
        task.setTitle(request.getTitle());
        task.setStatus(request.getStatus());
        task.setProgress(request.getProgress());
        task.setDueDate(request.getDueDate());
        
        List<TaskData> taskDataList = convertToTaskData(request.getTaskData());
        
        Task created = taskService.create(task, taskDataList);
        return Result.success(created);
    }

    @PutMapping("/{id}")
    public Result<Task> update(@PathVariable Long id, @RequestBody TaskRequest request) {
        Task task = new Task();
        task.setId(id);
        task.setTemplateId(request.getTemplateId());
        task.setTitle(request.getTitle());
        task.setStatus(request.getStatus());
        task.setProgress(request.getProgress());
        task.setDueDate(request.getDueDate());
        
        List<TaskData> taskDataList = convertToTaskData(request.getTaskData());
        
        Task updated = taskService.update(id, task, taskDataList);
        return Result.success(updated);
    }

    @PutMapping("/{id}/status")
    public Result<Task> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        Task task = taskService.updateStatus(id, status);
        return Result.success(task);
    }

    @PutMapping("/{id}/progress")
    public Result<Task> updateProgress(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        Integer progress = body.get("progress");
        Task task = taskService.updateProgress(id, progress);
        return Result.success(task);
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        taskService.delete(id);
        return Result.success();
    }

    private List<TaskData> convertToTaskData(List<TaskDataRequest> requests) {
        if (requests == null) {
            return new ArrayList<>();
        }
        List<TaskData> taskDataList = new ArrayList<>();
        for (TaskDataRequest request : requests) {
            TaskData data = new TaskData();
            data.setFieldId(request.getFieldId());
            data.setFieldValue(request.getFieldValue());
            taskDataList.add(data);
        }
        return taskDataList;
    }
}
