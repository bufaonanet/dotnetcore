import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss'],
})
export class EventosComponent implements OnInit {
  private _filtroLista: string = '';

  public get filtroLista(): string {
    return this._filtroLista;
  }
  public set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista
      ? this.filtrarEventos(this.filtroLista)
      : this.eventos;
  }

  eventosFiltrados: any = [];
  eventos: any = [];

  imgLargura = 50;
  imgMargem = 10;
  mostrarImg = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getEventos();
  }

  filtrarEventos(filtrarPor: string): any {
    filtrarPor = filtrarPor.toLocaleLowerCase();

    return this.eventos.filter(
      (evento) => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  alternarImg() {
    this.mostrarImg = !this.mostrarImg;
  }

  getEventos() {
    this.http.get('http://localhost:5000/api/values/').subscribe(
      (resposta) => {
        this.eventos = resposta;
        console.log(resposta);
      },
      (erro) => {
        console.log(erro);
      }
    );
  }
}
