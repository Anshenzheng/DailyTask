export interface TaskTemplate {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FieldRequest {
  id?: number;
  fieldName: string;
  fieldLabel: string;
  fieldType: string;
  maxLength?: number;
  required: boolean;
  sortOrder: number;
  defaultValue?: string;
  options?: string;
}

export interface TemplateField {
  id: number;
  templateId: number;
  fieldName: string;
  fieldLabel: string;
  fieldType: string;
  maxLength: number;
  required: boolean;
  sortOrder: number;
  defaultValue: string;
  options: string;
}

export interface Task {
  id: number;
  templateId: number;
  title: string;
  status: string;
  progress: number;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskData {
  id: number;
  taskId: number;
  fieldId: number;
  fieldValue: string;
}

export interface FieldConfig {
  id: number;
  fieldName: string;
  fieldLabel: string;
  fieldType: string;
  maxLength: number;
  required: boolean;
  sortOrder: number;
  defaultValue: string;
  options: string[];
  value: any;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export const FieldTypes = [
  { value: 'text', label: '单行文本' },
  { value: 'textarea', label: '多行文本' },
  { value: 'number', label: '数字' },
  { value: 'date', label: '日期' },
  { value: 'select', label: '下拉选择' },
  { value: 'checkbox', label: '复选框' }
];

export const TaskStatuses = [
  { value: '待开始', label: '待开始', color: 'primary' },
  { value: '进行中', label: '进行中', color: 'accent' },
  { value: '已完成', label: '已完成', color: 'success' },
  { value: '已取消', label: '已取消', color: 'warn' }
];
