import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  constructor(public authService: AuthService, public router: Router) {}

  ngOnInit(): void {}

  loggedIn(): boolean {
    return this.authService.logged();
  }

  logOut(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/user/login']);
  }

  entrar(): void {
    this.router.navigate(['/user/login']);
  }

  userName(): string | null {
    return sessionStorage.getItem('username');
  }

  showMenu(): boolean {
    return this.router.url != '/user/login';
  }
}
