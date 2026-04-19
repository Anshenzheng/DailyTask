import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Task, TaskStatuses, TaskTemplate } from '../../models';
import { TaskService } from '../../services/task.service';
import { TemplateService } from '../../services/template.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  templates: TaskTemplate[] = [];
  dataSource = new MatTableDataSource<Task>();
  displayedColumns: string[] = ['id', 'title', 'template', 'status', 'progress', 'dueDate', 'createdAt', 'actions'];
  statuses = TaskStatuses;
  
  filterTemplateId: number | null = null;
  filterStatus: string | null = null;
  searchKeyword: string = '';
  loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private taskService: TaskService,
    private templateService: TemplateService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadTemplates();
    this.loadTasks();
  }

  loadTemplates(): void {
    this.templateService.getAll().subscribe({
      next: (templates) => {
        this.templates = templates;
      }
    });
  }

  loadTasks(): void {
    this.loading = true;
    this.taskService.getAll(
      this.filterTemplateId ?? undefined,
      this.filterStatus ?? undefined,
      this.searchKeyword || undefined
    ).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.dataSource.data = tasks;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('加载任务列表失败', '关闭', { duration: 3000 });
      }
    });
  }

  applyFilters(): void {
    this.loadTasks();
  }

  clearFilters(): void {
    this.filterTemplateId = null;
    this.filterStatus = null;
    this.searchKeyword = '';
    this.loadTasks();
  }

  editTask(id: number): void {
    this.router.navigate(['/tasks/edit', id]);
  }

  deleteTask(task: Task): void {
    if (confirm(`确定要删除任务"${task.title}"吗？`)) {
      this.taskService.delete(task.id).subscribe({
        next: () => {
          this.snackBar.open('删除成功', '关闭', { duration: 2000 });
          this.loadTasks();
        },
        error: () => {
          this.snackBar.open('删除失败', '关闭', { duration: 3000 });
        }
      });
    }
  }

  updateTaskStatus(task: Task, status: string): void {
    this.taskService.updateStatus(task.id, status).subscribe({
      next: () => {
        this.snackBar.open('状态更新成功', '关闭', { duration: 2000 });
        this.loadTasks();
      },
      error: () => {
        this.snackBar.open('状态更新失败', '关闭', { duration: 3000 });
      }
    });
  }

  updateTaskProgress(task: Task, progress: number): void {
    this.taskService.updateProgress(task.id, progress).subscribe({
      next: () => {
        this.snackBar.open('进度更新成功', '关闭', { duration: 2000 });
        this.loadTasks();
      },
      error: () => {
        this.snackBar.open('进度更新失败', '关闭', { duration: 3000 });
      }
    });
  }

  getTemplateName(templateId: number): string {
    const template = this.templates.find(t => t.id === templateId);
    return template ? template.name : '未知模板';
  }

  getStatusClass(status: string): string {
    switch (status) {
      case '待开始':
        return 'status-pending';
      case '进行中':
        return 'status-in-progress';
      case '已完成':
        return 'status-completed';
      case '已取消':
        return 'status-cancelled';
      default:
        return 'status-pending';
    }
  }

  getProgressColor(progress: number): string {
    if (progress >= 100) return 'primary';
    if (progress >= 50) return 'accent';
    return 'warn';
  }
}
