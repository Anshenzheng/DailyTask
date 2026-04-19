import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TaskTemplate } from '../../models';
import { TemplateService } from '../../services/template.service';

@Component({
  selector: 'app-template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.scss']
})
export class TemplateListComponent implements OnInit {
  templates: TaskTemplate[] = [];
  loading = false;
  displayedColumns: string[] = ['id', 'name', 'description', 'createdAt', 'actions'];

  constructor(
    private templateService: TemplateService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadTemplates();
  }

  loadTemplates(): void {
    this.loading = true;
    this.templateService.getAll().subscribe({
      next: (templates) => {
        this.templates = templates;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('加载模板列表失败', '关闭', { duration: 3000 });
      }
    });
  }

  editTemplate(id: number): void {
    this.router.navigate(['/templates/edit', id]);
  }

  deleteTemplate(template: TaskTemplate): void {
    if (confirm(`确定要删除模板"${template.name}"吗？`)) {
      this.templateService.delete(template.id).subscribe({
        next: () => {
          this.snackBar.open('删除成功', '关闭', { duration: 2000 });
          this.loadTemplates();
        },
        error: () => {
          this.snackBar.open('删除失败', '关闭', { duration: 3000 });
        }
      });
    }
  }

  createTaskFromTemplate(templateId: number): void {
    this.router.navigate(['/tasks/new'], { queryParams: { templateId } });
  }
}
