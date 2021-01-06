import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { Evento } from 'src/app/_models/Evento';
import { EventoService } from 'src/app/_services/evento.service';

@Component({
  selector: 'app-evento-edit',
  templateUrl: './evento-edit.component.html',
  styleUrls: ['./evento-edit.component.scss'],
})
export class EventoEditComponent implements OnInit {
  titulo = 'Editar Evento';

  registerForm!: FormGroup;
  evento: Evento = new Evento();
  imagemURL = 'assets/imgs/upload.png';
  file!: File;
  fileNameToUpdate = '';
  dataAtual = '';

  constructor(
    private eventoService: EventoService,
    private fb: FormBuilder,
    private localeService: BsLocaleService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {
    this.localeService.use('pt-br');
  }

  get lotes(): FormArray {
    return this.registerForm.get('lotes') as FormArray;
  }

  get redesSociais(): FormArray {
    return this.registerForm.get('redesSociais') as FormArray;
  }

  ngOnInit(): void {
    this.validator();
    this.carregaEvento();
  }

  carregaEvento(): void {
    const idEvento = +this.route.snapshot.params.id;

    this.eventoService.getEventoById(idEvento).subscribe((evento: Evento) => {
      this.evento = Object.assign({}, evento);

      this.dataAtual = new Date().getMilliseconds().toString();
      this.fileNameToUpdate = this.evento.imagemURL.toString();

      this.imagemURL = `http://localhost:5000/Resources/Images/${this.evento.imagemURL}?_ts=${this.dataAtual}`;

      this.evento.imagemURL = '';
      this.registerForm.patchValue(this.evento);

      this.evento.lotes.forEach((lote) => {
        this.lotes.push(this.criaLote(lote));
      });

      this.evento.redesSociais.forEach((redeSocial) => {
        this.redesSociais.push(this.criaRedeSocial(redeSocial));
      });
    });
  }

  validator(): void {
    this.registerForm = this.fb.group({
      id: [],
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
      imagemURL: [''],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      lotes: this.fb.array([]),
      redesSociais: this.fb.array([]),
    });
  }

  criaLote(lote: any): FormGroup {
    return this.fb.group({
      id: [lote.id],
      nome: [lote.nome, Validators.required],
      quantidade: [lote.quantidade, Validators.required],
      preco: [lote.preco, Validators.required],
      dataInicio: [lote.dataInicio],
      dataFim: [lote.dataFim],
    });
  }

  adicionarLote(): void {
    this.lotes.push(this.criaLote({ id: 0 }));
  }

  removerLote(id: number): void {
    this.lotes.removeAt(id);
  }

  criaRedeSocial(redeSocial: any): FormGroup {
    return this.fb.group({
      id: [redeSocial.id],
      nome: [redeSocial.nome, Validators.required],
      url: [redeSocial.url, Validators.required],
    });
  }

  adicionarRedeSocial(): void {
    this.redesSociais.push(this.criaRedeSocial({ id: 0 }));
  }

  removerRedeSocial(id: number): void {
    this.redesSociais.removeAt(id);
  }

  salvarEvento() {
    this.evento = Object.assign(
      { id: this.evento.id },
      this.registerForm.value
    );

    this.evento.imagemURL = this.fileNameToUpdate;

    this.uploadImagem();

    this.eventoService.putEvento(this.evento).subscribe(
      () => {
        this.toastr.success('Editado com sucesso');        
      },
      (erro) => {
        this.toastr.error(`Erro ao editar: ${erro}`);
      }
    );
  }

  uploadImagem() {
    debugger;

    let valorImagem = this.registerForm.get('imagemURL')?.value;

    if (valorImagem !== '') {
      this.eventoService
        .postUpload(this.file, this.fileNameToUpdate)
        .subscribe(() => {
          this.dataAtual = new Date().getMilliseconds().toString();
          this.imagemURL = `http://localhost:5000/Resources/Images/${this.evento.imagemURL}?_ts=${this.dataAtual}`;
        });
    }
  }

  onFileChange(event: any): void {
    const reader = new FileReader();

    reader.onload = (event: any) => (this.imagemURL = event.target.result);

    this.file = event.target.files[0];

    reader.readAsDataURL(event.target.files[0]);
  }
}
