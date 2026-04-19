import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { TaskTemplate, TemplateField, ApiResponse } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private baseUrl = `${environment.apiBaseUrl}/templates`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<TaskTemplate[]> {
    return this.http.get<ApiResponse<TaskTemplate[]>>(this.baseUrl)
      .pipe(map(response => response.data));
  }

  getById(id: number): Observable<{ template: TaskTemplate, fields: TemplateField[] }> {
    return this.http.get<ApiResponse<{ template: TaskTemplate, fields: TemplateField[] }>>(`${this.baseUrl}/${id}`)
      .pipe(map(response => response.data));
  }

  getFields(templateId: number): Observable<TemplateField[]> {
    return this.http.get<ApiResponse<TemplateField[]>>(`${this.baseUrl}/${templateId}/fields`)
      .pipe(map(response => response.data));
  }

  create(template: any): Observable<TaskTemplate> {
    return this.http.post<ApiResponse<TaskTemplate>>(this.baseUrl, template)
      .pipe(map(response => response.data));
  }

  update(id: number, template: any): Observable<TaskTemplate> {
    return this.http.put<ApiResponse<TaskTemplate>>(`${this.baseUrl}/${id}`, template)
      .pipe(map(response => response.data));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`)
      .pipe(map(response => response.data));
  }
}
