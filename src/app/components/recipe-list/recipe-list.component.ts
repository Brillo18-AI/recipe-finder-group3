import { Component, ChangeDetectionStrategy, signal, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from '../../models/recipe.model';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatToolbarModule
  ],
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipeListComponent implements OnInit {
  private recipeService = inject<RecipeService>(RecipeService);
  private cdr = inject(ChangeDetectorRef);

  searchInput = '';
  allRecipes = signal<Recipe[]>([]);
  displayedRecipes = signal<Recipe[]>([]);
  isSearching = signal<boolean>(false);

  ngOnInit(): void {
    this.recipeService.getRecipes().subscribe({
      next: (recipes: Recipe[]) => {
        this.allRecipes.set(recipes);
        
        // Show trending recipes by default
        const trending = recipes.filter((recipe) => recipe.trending === true);
        this.displayedRecipes.set(trending);
        
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading recipes:', err);
      }
    });
  }

  search(): void {
    const term = this.searchInput.trim();

    if (!term) {
      // Empty search - show trending foods
      this.isSearching.set(false);
      const trending = this.allRecipes().filter((recipe) => recipe.trending === true);
      this.displayedRecipes.set(trending);
    } else {
      // Active search - filter by ingredient
      this.isSearching.set(true);
      const filtered = this.allRecipes().filter((recipe) =>
        recipe.ingredients.some((ingredient) =>
          ingredient.toLowerCase().includes(term.toLowerCase())
        )
      );
      this.displayedRecipes.set(filtered);
    }
  }
}
