import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Evento } from '../_models/Evento';

import { EventoService } from '../_services/evento.service';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss'],
})
export class EventosComponent implements OnInit {
  eventosFiltrados: Evento[] = [];
  eventos: Evento[] = [];
  imgLargura = 50;
  imgMargem = 10;
  mostrarImg = false;
  modalRef!: BsModalRef;

  _filtroLista = '';

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService
  ) {}

  public get filtroLista(): string {
    return this._filtroLista;
  }
  public set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista
      ? this.filtrarEventos(this.filtroLista)
      : this.eventos;
  }

  ngOnInit(): void {
    this.getEventos();
  }

  openModal(templeta: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(templeta);
  }

  filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();

    return this.eventos.filter(
      (evento) => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  alternarImg(): void {
    this.mostrarImg = !this.mostrarImg;
  }

  getEventos(): void {
    this.eventoService.getEventoAll().subscribe(
      (_eventos: Evento[]) => {
        this.eventos = _eventos;
        this.eventosFiltrados = this.eventos;
        console.log(_eventos);
      },
      (erro) => {
        console.log(erro);
      }
    );
  }
}
