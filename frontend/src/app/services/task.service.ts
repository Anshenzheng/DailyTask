import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Task, TaskData, ApiResponse } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseUrl = `${environment.apiBaseUrl}/tasks`;

  constructor(private http: HttpClient) { }

  getAll(templateId?: number, status?: string, keyword?: string): Observable<Task[]> {
    let params = new HttpParams();
    if (templateId !== undefined && templateId !== null) {
      params = params.set('templateId', templateId.toString());
    }
    if (status) {
      params = params.set('status', status);
    }
    if (keyword) {
      params = params.set('keyword', keyword);
    }
    
    return this.http.get<ApiResponse<Task[]>>(this.baseUrl, { params })
      .pipe(map(response => response.data));
  }

  getById(id: number): Observable<{ task: Task, taskData: TaskData[] }> {
    return this.http.get<ApiResponse<{ task: Task, taskData: TaskData[] }>>(`${this.baseUrl}/${id}`)
      .pipe(map(response => response.data));
  }

  create(task: any): Observable<Task> {
    return this.http.post<ApiResponse<Task>>(this.baseUrl, task)
      .pipe(map(response => response.data));
  }

  update(id: number, task: any): Observable<Task> {
    return this.http.put<ApiResponse<Task>>(`${this.baseUrl}/${id}`, task)
      .pipe(map(response => response.data));
  }

  updateStatus(id: number, status: string): Observable<Task> {
    return this.http.put<ApiResponse<Task>>(`${this.baseUrl}/${id}/status`, { status })
      .pipe(map(response => response.data));
  }

  updateProgress(id: number, progress: number): Observable<Task> {
    return this.http.put<ApiResponse<Task>>(`${this.baseUrl}/${id}/progress`, { progress })
      .pipe(map(response => response.data));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`)
      .pipe(map(response => response.data));
  }
}
