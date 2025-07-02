import { Component, inject } from '@angular/core';
import { LoadingService } from '../../../core/services/loading.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading',
  imports: [
    CommonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './loading.html',
  styleUrl: './loading.css'
})
export class Loading {
  loadingService: LoadingService = inject(LoadingService);
}
