import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { FieldConfig, TemplateField } from '../../models';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {
  @Input() fields: TemplateField[] = [];
  @Input() initialValues: { fieldId: number; fieldValue: string }[] = [];
  
  formGroup: FormGroup;
  fieldConfigs: FieldConfig[] = [];

  constructor(private fb: FormBuilder) {
    this.formGroup = this.fb.group({});
  }

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm(): void {
    const group: { [key: string]: any } = {};
    
    this.fieldConfigs = this.fields.map((field, index) => {
      let options: string[] = [];
      if (field.options && field.fieldType === 'select') {
        try {
          options = JSON.parse(field.options);
        } catch {
          options = field.options.split(',').map(s => s.trim()).filter(s => s);
        }
      }

      const initialValue = this.getInitialValue(field.id);
      const defaultValue = initialValue !== null ? initialValue : field.defaultValue || '';
      
      const validators: ValidatorFn[] = [];
      if (field.required) {
        validators.push(Validators.required);
      }
      if (field.maxLength && field.fieldType !== 'number') {
        validators.push(Validators.maxLength(field.maxLength));
      }

      group[`field_${field.id}`] = [defaultValue, validators];

      return {
        id: field.id,
        fieldName: field.fieldName,
        fieldLabel: field.fieldLabel,
        fieldType: field.fieldType,
        maxLength: field.maxLength,
        required: field.required,
        sortOrder: field.sortOrder,
        defaultValue: field.defaultValue,
        options,
        value: defaultValue
      };
    });

    this.fieldConfigs.sort((a, b) => a.sortOrder - b.sortOrder);
    this.formGroup = this.fb.group(group);
  }

  private getInitialValue(fieldId: number): string | null {
    const found = this.initialValues.find(v => v.fieldId === fieldId);
    return found ? found.fieldValue : null;
  }

  getFormValue(): { fieldId: number; fieldValue: string }[] {
    const values: { fieldId: number; fieldValue: string }[] = [];
    
    this.fieldConfigs.forEach(config => {
      const control = this.formGroup.get(`field_${config.id}`);
      if (control) {
        let value = control.value;
        if (value === null || value === undefined) {
          value = '';
        }
        values.push({
          fieldId: config.id,
          fieldValue: typeof value === 'boolean' ? (value ? 'true' : 'false') : String(value)
        });
      }
    });

    return values;
  }

  markAllAsTouched(): void {
    Object.values(this.formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  isFieldValid(fieldId: number): boolean {
    const control = this.formGroup.get(`field_${fieldId}`);
    return control ? !control.invalid || !control.touched : true;
  }

  getErrorMessage(config: FieldConfig): string {
    const control = this.formGroup.get(`field_${config.id}`);
    if (!control) return '';

    if (control.hasError('required')) {
      return `${config.fieldLabel}是必填项`;
    }
    if (control.hasError('maxlength')) {
      return `${config.fieldLabel}不能超过${config.maxLength}个字符`;
    }
    return '';
  }
}
