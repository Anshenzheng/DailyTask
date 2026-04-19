import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FieldRequest, FieldTypes, TemplateField } from '../../models';
import { TemplateService } from '../../services/template.service';

@Component({
  selector: 'app-template-edit',
  templateUrl: './template-edit.component.html',
  styleUrls: ['./template-edit.component.scss']
})
export class TemplateEditComponent implements OnInit {
  templateId: number | null = null;
  isEdit = false;
  templateForm: FormGroup;
  fieldTypes = FieldTypes;
  loading = false;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private templateService: TemplateService,
    private snackBar: MatSnackBar
  ) {
    this.templateForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.maxLength(500)]],
      fields: this.fb.array([])
    });
  }

  get fields(): FormArray {
    return this.templateForm.get('fields') as FormArray;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.templateId = +id;
      this.isEdit = true;
      this.loadTemplate();
    }
  }

  loadTemplate(): void {
    if (!this.templateId) return;
    
    this.loading = true;
    this.templateService.getById(this.templateId).subscribe({
      next: (data) => {
        this.templateForm.patchValue({
          name: data.template.name,
          description: data.template.description
        });
        
        data.fields.forEach(field => this.addField(field));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('加载模板失败', '关闭', { duration: 3000 });
        this.router.navigate(['/templates']);
      }
    });
  }

  createFieldFormGroup(field?: TemplateField): FormGroup {
    return this.fb.group({
      id: [field?.id || null],
      fieldName: [field?.fieldName || '', [Validators.required, Validators.maxLength(100)]],
      fieldLabel: [field?.fieldLabel || '', [Validators.required, Validators.maxLength(100)]],
      fieldType: [field?.fieldType || 'text', [Validators.required]],
      maxLength: [field?.maxLength || null],
      required: [field?.required || false],
      sortOrder: [field?.sortOrder || this.fields.length],
      defaultValue: [field?.defaultValue || ''],
      options: [field?.options || '']
    });
  }

  addField(field?: TemplateField): void {
    this.fields.push(this.createFieldFormGroup(field));
  }

  removeField(index: number): void {
    this.fields.removeAt(index);
    this.updateSortOrder();
  }

  moveFieldUp(index: number): void {
    if (index > 0) {
      const fields = this.fields.controls;
      const temp = fields[index];
      fields[index] = fields[index - 1];
      fields[index - 1] = temp;
      this.updateSortOrder();
    }
  }

  moveFieldDown(index: number): void {
    if (index < this.fields.length - 1) {
      const fields = this.fields.controls;
      const temp = fields[index];
      fields[index] = fields[index + 1];
      fields[index + 1] = temp;
      this.updateSortOrder();
    }
  }

  private updateSortOrder(): void {
    this.fields.controls.forEach((control, index) => {
      control.patchValue({ sortOrder: index });
    });
  }

  onSubmit(): void {
    if (this.templateForm.invalid) {
      this.markAllAsTouched(this.templateForm);
      return;
    }

    this.submitting = true;
    const formValue = this.templateForm.value;
    
    const request = {
      id: this.templateId,
      name: formValue.name,
      description: formValue.description,
      fields: formValue.fields as FieldRequest[]
    };

    if (this.isEdit && this.templateId) {
      this.templateService.update(this.templateId, request).subscribe({
        next: () => this.handleSuccess(),
        error: () => this.handleError()
      });
    } else {
      this.templateService.create(request).subscribe({
        next: () => this.handleSuccess(),
        error: () => this.handleError()
      });
    }
  }

  private handleSuccess(): void {
    this.submitting = false;
    this.snackBar.open(this.isEdit ? '模板更新成功' : '模板创建成功', '关闭', { duration: 2000 });
    this.router.navigate(['/templates']);
  }

  private handleError(): void {
    this.submitting = false;
    this.snackBar.open(this.isEdit ? '模板更新失败' : '模板创建失败', '关闭', { duration: 3000 });
  }

  private markAllAsTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup) {
        this.markAllAsTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach(c => {
          if (c instanceof FormGroup) {
            this.markAllAsTouched(c);
          } else {
            c.markAsTouched();
          }
        });
      } else {
        control.markAsTouched();
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/templates']);
  }

  getFieldTypeLabel(type: string): string {
    const fieldType = this.fieldTypes.find(f => f.value === type);
    return fieldType ? fieldType.label : type;
  }
}
