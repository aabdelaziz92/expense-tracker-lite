import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category } from '../../../../core/models/category';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories-list',
  imports: [
    CommonModule,
    LucideAngularModule
  ],
  templateUrl: './categories-list.html',
  styleUrl: './categories-list.css'
})
export class CategoriesList {
  @Input() categories: Category[] = [];
  @Output() selectedCategory: EventEmitter<Category> = new EventEmitter<Category>();

  onCategorySelected(category: Category) {
    this.categories.forEach(cat => cat.selected = false);
    category.selected = true;
    this.selectedCategory.emit(category);
  }
}
