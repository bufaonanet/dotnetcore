import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Evento } from '../_models/Evento';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale, ptBrLocale } from 'ngx-bootstrap/chronos';
import { ToastrService } from 'ngx-toastr';
defineLocale('pt-br', ptBrLocale);

import { EventoService } from '../_services/evento.service';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss'],
})
export class EventosComponent implements OnInit {
  titulo = 'Eventos';

  eventosFiltrados: Evento[] = [];
  eventos: Evento[] = [];
  evento!: Evento;

  imgLargura = 50;
  imgMargem = 10;
  mostrarImg = false;
  registerForm!: FormGroup;
  modoSalvar = '';
  tituloForm = '';
  bodyDeletarEvento = '';

  file!: File;

  _filtroLista = '';
  fileNameToUpdate = '';
  dataAtual = '';

  constructor(
    private eventoService: EventoService,
    private fb: FormBuilder,
    private localeService: BsLocaleService,
    private toastr: ToastrService
  ) {
    this.localeService.use('pt-br');
  }

  ngOnInit(): void {
    this.validator();
    this.getEventos();
  }

  get tema(): any {
    return this.registerForm.get('tema');
  }
  get local(): any {
    return this.registerForm.get('local');
  }
  get dataEvento(): any {
    return this.registerForm.get('dataEvento');
  }
  get imagemURL(): any {
    return this.registerForm.get('imagemURL');
  }
  get qtdPessoas(): any {
    return this.registerForm.get('qtdPessoas');
  }
  get telefone(): any {
    return this.registerForm.get('telefone');
  }
  get email(): any {
    return this.registerForm.get('email');
  }

  public get filtroLista(): string {
    return this._filtroLista;
  }
  public set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista
      ? this.filtrarEventos(this.filtroLista)
      : this.eventos;
  }

  openModal(template: ModalDirective): void {
    this.registerForm.reset();
    template.show();
  }

  criarEvento(template: ModalDirective): void {
    this.modoSalvar = 'post';
    this.tituloForm = 'Criar Evento';
    this.openModal(template);
  }

  editarEvento(template: ModalDirective, evento: Evento): void {
    this.openModal(template);
    this.modoSalvar = 'put';
    this.tituloForm = 'Editar Evento';

    this.evento = Object.assign({}, evento);
    this.fileNameToUpdate = this.evento.imagemURL.toString();
    this.evento.imagemURL = '';
    this.registerForm.patchValue(this.evento);
  }

  excluirEvento(template: ModalDirective, evento: Evento): void {
    this.evento = evento;
    this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${this.evento.tema}, Código: ${this.evento.id}? `;
    template.show();
  }

  confirmeDelete(template: ModalDirective): void {
    this.eventoService.deleteEvento(this.evento.id).subscribe(
      () => {
        template.hide();
        this.toastr.success('Registro Excluído');
        this.getEventos();
      },
      (error) => {
        this.toastr.success(`${error}`, 'Erro ao Excluir');
      }
    );
  }

  salvarAlteracao(template: ModalDirective): void {
    if (this.registerForm.valid) {
      if (this.modoSalvar === 'post') {
        this.evento = Object.assign({}, this.registerForm.value);

        this.uploadImagem();

        this.eventoService.postEvento(this.evento).subscribe(
          () => {
            template.hide();
            this.toastr.success('Registro Salvo');
            this.getEventos();
          },
          (error) => {
            this.toastr.error(`${error}`, 'Erro ao Salvar');
            console.log(error);
            
          }
        );
      }

      if (this.modoSalvar === 'put') {
        this.evento = Object.assign(
          { id: this.evento.id },
          this.registerForm.value
        );

        this.uploadImagem();

        this.eventoService.putEvento(this.evento).subscribe(
          () => {
            template.hide();
            this.toastr.success('Registro Editado');
            this.getEventos();
          },
          (error) => {
            this.toastr.error(`${error}`, 'Erro ao Editar');
          }
        );
      }
    }
  }

  private uploadImagem(): void {
    if (this.modoSalvar === 'post') {
      const nomeArquivo = this.evento.imagemURL.split('\\', 3);
      this.evento.imagemURL = nomeArquivo[2];

      this.eventoService.postUpload(this.file, nomeArquivo[2]).subscribe(() => {
        this.dataAtual = new Date().getMilliseconds().toString();
        this.getEventos();
      });
    } else {
      this.evento.imagemURL = this.fileNameToUpdate;

      this.eventoService
        .postUpload(this.file, this.fileNameToUpdate)
        .subscribe(() => {
          this.dataAtual = new Date().getMilliseconds().toString();
          this.getEventos();
        });
    }
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
      },
      (error) => {
        this.toastr.error(`${error}`, 'Erro ao buscar registros');
      }
    );
  }

  validator(): void {
    this.registerForm = this.fb.group({
      tema: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50),
        ],
      ],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(12000)]],
      imagemURL: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onFileChange(event: any): void {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      this.file = event.target.files[0];
    }
  }
}
