import { Component, inject, OnInit } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { MessagesService } from '../../../core/services/messages.service';
import { Message } from '../../../core/models/message';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-messages',
  imports: [
    CommonModule,
    LucideAngularModule
  ],
  templateUrl: './messages.html',
  styleUrl: './messages.css'
})
export class Messages implements OnInit {
  show: boolean = false;
  messagesService: MessagesService = inject(MessagesService);
  errors$: Observable<Message[]> = this.messagesService.errors$;

  ngOnInit() {
    this.errors$.pipe(
      tap(errors => this.show = errors.length > 0)
    ).subscribe();
  }

  close() {
    this.show = false;
  }
}
