import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Evento } from '../_models/Evento';

@Injectable({
  providedIn: 'root',
})
export class EventoService {
  baseUrl = 'http://localhost:5000/api/evento';

  constructor(private http: HttpClient) {}

  getEventoAll(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.baseUrl);
  }

  getEventoById(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.baseUrl}/${id}`);
  }

  getEventoByTema(tema: string): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.baseUrl}/getByTema/${tema}`);
  }

  postEvento(evento: Evento): Observable<object> {
    return this.http.post(this.baseUrl, evento);
  }

  putEvento(evento: Evento): Observable<object> {
    return this.http.put(`${this.baseUrl}/${evento.id}`, evento);
  }

  deleteEvento(id: number): Observable<object> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
