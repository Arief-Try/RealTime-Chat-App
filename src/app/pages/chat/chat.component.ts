import { Component, effect, inject } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChatService } from '../../supabase/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
private auth = inject(AuthService);
private chat_service = inject(ChatService);
private router = inject(Router);
private fb = inject(FormBuilder);
chatForm!: FormGroup

constructor() {
  this.chatForm = this.fb.group({
    chat_message: ['',Validators.required]
  });

  effect(() => {
    this.onListChat()
  });
}

  async logOut() {
    this.auth.signOut().then(() => {
      this.router.navigate(['/login'])
    }).catch((error) => {
      alert(error.message)
    })
  }

onSubmit() {
  const formValue = this.chatForm.value.chat_message
  console.log(formValue);

  this.chat_service.chatMessage(formValue).then((res) => {
    console.log(res);
    this.chatForm.reset();
}).catch((error) => {
    alert(error.message);
})

}

onListChat() {
  this.chat_service.listChat().then((res) => {
    console.log(res);
  }).catch((error) => {
    alert(error.message);
  });
}
}
