import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/_models/User';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  registerForm!: FormGroup;
  user!: User;

  constructor(
    public fb: FormBuilder,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.validation();
  }

  validation(): void {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      userName: ['', Validators.required],
      passwords: this.fb.group(
        {
          password: ['', [Validators.required, Validators.minLength(4)]],
          confirmPassword: ['', Validators.required],
        },
        { validator: this.comparaSenhas }
      ),
    });
  }

  comparaSenhas(fb: FormGroup): void {
    const senhaCtrl = fb.get('password');
    const confirmaSenhaCtrl = fb.get('confirmPassword');

    if (
      confirmaSenhaCtrl?.errors == null ||
      'mismatch' in confirmaSenhaCtrl?.errors
    ) {
      if (senhaCtrl?.value !== confirmaSenhaCtrl?.value) {
        confirmaSenhaCtrl?.setErrors({ mismatch: true });
      } else {
        confirmaSenhaCtrl?.setErrors(null);
      }
    }
  }

  cadastrarUsuario(): void {
    if (this.registerForm.valid) {
      this.user = Object.assign(
        { password: this.registerForm.get('passwords.password')?.value },
        this.registerForm.value
      );

      this.authService.register(this.user).subscribe(
        () => {
          this.router.navigate(['/user/login']);
          this.toastr.success('Cadastro Realizado');
        },
        (error) => {
          const erro = error.error;
          erro.forEach((element: { code: any }) => {
            switch (element.code) {
              case 'DuplicateUserName':
                this.toastr.error('Cadastro Realizado');
                break;
              default:
                this.toastr.error(`Erro no cadastro! CODE: ${element.code}`);
                break;
            }
          });
        }
      );
    }
  }
}
