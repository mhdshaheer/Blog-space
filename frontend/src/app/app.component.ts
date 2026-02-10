import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { ConfirmModalComponent } from './shared/components/confirm-modal/confirm-modal.component';
import { LoginComponent } from './features/auth/login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    ToastComponent,
    ConfirmModalComponent,
    LoginComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'blog-app';
  recievedData!: string;

  handleMsgFromChild(msg: string) {
    this.recievedData = msg;
  }
}
