import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TemplateField, TaskStatuses, TaskTemplate } from '../../models';
import { TemplateService } from '../../services/template.service';
import { TaskService } from '../../services/task.service';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.scss']
})
export class TaskEditComponent implements OnInit {
  taskId: number | null = null;
  isEdit = false;
  templates: TaskTemplate[] = [];
  selectedTemplateId: number | null = null;
  templateFields: TemplateField[] = [];
  taskForm: FormGroup;
  statuses = TaskStatuses;
  loading = false;
  submitting = false;
  loadingFields = false;

  @ViewChild('dynamicForm') dynamicForm!: DynamicFormComponent;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private templateService: TemplateService,
    private taskService: TaskService,
    private snackBar: MatSnackBar
  ) {
    this.taskForm = this.fb.group({
      templateId: [null, [Validators.required]],
      title: ['', [Validators.required, Validators.maxLength(500)]],
      status: ['待开始', [Validators.required]],
      progress: [0, [Validators.min(0), Validators.max(100)]],
      dueDate: [null]
    });
  }

  ngOnInit(): void {
    this.loadTemplates();
    
    const id = this.route.snapshot.paramMap.get('id');
    const templateIdFromQuery = this.route.snapshot.queryParamMap.get('templateId');
    
    if (id) {
      this.taskId = +id;
      this.isEdit = true;
      this.loadTask();
    } else if (templateIdFromQuery) {
      this.selectedTemplateId = +templateIdFromQuery;
      this.taskForm.patchValue({ templateId: this.selectedTemplateId });
      this.loadTemplateFields(this.selectedTemplateId);
    }
  }

  loadTemplates(): void {
    this.templateService.getAll().subscribe({
      next: (templates) => {
        this.templates = templates;
      }
    });
  }

  onTemplateChange(templateId: number): void {
    this.selectedTemplateId = templateId;
    this.loadTemplateFields(templateId);
  }

  loadTemplateFields(templateId: number): void {
    if (!templateId) {
      this.templateFields = [];
      return;
    }

    this.loadingFields = true;
    this.templateService.getFields(templateId).subscribe({
      next: (fields) => {
        this.templateFields = fields;
        this.loadingFields = false;
      },
      error: () => {
        this.loadingFields = false;
        this.snackBar.open('加载模板字段失败', '关闭', { duration: 3000 });
      }
    });
  }

  loadTask(): void {
    if (!this.taskId) return;

    this.loading = true;
    this.taskService.getById(this.taskId).subscribe({
      next: (data) => {
        this.taskForm.patchValue({
          templateId: data.task.templateId,
          title: data.task.title,
          status: data.task.status,
          progress: data.task.progress,
          dueDate: data.task.dueDate ? new Date(data.task.dueDate) : null
        });

        this.selectedTemplateId = data.task.templateId;
        this.loadTemplateFields(data.task.templateId);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('加载任务失败', '关闭', { duration: 3000 });
        this.router.navigate(['/tasks']);
      }
    });
  }

  getTaskDataForSubmit(): { fieldId: number; fieldValue: string }[] {
    if (this.dynamicForm) {
      return this.dynamicForm.getFormValue();
    }
    return [];
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      if (this.dynamicForm) {
        this.dynamicForm.markAllAsTouched();
      }
      return;
    }

    this.submitting = true;
    const formValue = this.taskForm.value;
    
    const request = {
      id: this.taskId,
      templateId: formValue.templateId,
      title: formValue.title,
      status: formValue.status,
      progress: formValue.progress,
      dueDate: formValue.dueDate ? formValue.dueDate.toISOString().split('T')[0] : null,
      taskData: this.getTaskDataForSubmit()
    };

    if (this.isEdit && this.taskId) {
      this.taskService.update(this.taskId, request).subscribe({
        next: () => this.handleSuccess(),
        error: () => this.handleError()
      });
    } else {
      this.taskService.create(request).subscribe({
        next: () => this.handleSuccess(),
        error: () => this.handleError()
      });
    }
  }

  private handleSuccess(): void {
    this.submitting = false;
    this.snackBar.open(this.isEdit ? '任务更新成功' : '任务创建成功', '关闭', { duration: 2000 });
    this.router.navigate(['/tasks']);
  }

  private handleError(): void {
    this.submitting = false;
    this.snackBar.open(this.isEdit ? '任务更新失败' : '任务创建失败', '关闭', { duration: 3000 });
  }

  cancel(): void {
    this.router.navigate(['/tasks']);
  }
}
