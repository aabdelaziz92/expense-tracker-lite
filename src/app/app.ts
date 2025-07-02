import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Loading } from "./shared/components/loading/loading";
import { Messages } from "./shared/components/messages/messages";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Loading, Messages],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'expense-tracker-lite';
}
