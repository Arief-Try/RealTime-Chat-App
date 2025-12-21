import { Component, effect, inject } from '@angular/core';
import { ChatService } from '../../supabase/chat.service';

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [],
  templateUrl: './delete-modal.component.html',
  styleUrl: './delete-modal.component.css'
})
export class DeleteModalComponent {

  private chat_service =inject(ChatService)

  constructor() {
    effect(() => {
      console.log(this.chat_service.savedChat);

  });
  }

  deleteChat() {
    const id = (this.chat_service.savedChat() as {id: string}).id

    console.log(id);

  }

}
