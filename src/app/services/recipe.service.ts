import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Recipe } from '../models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private jsonUrl = 'assets/nigerian-recipes.json';

  constructor(private http: HttpClient) {}

  getRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.jsonUrl);
  }

  searchRecipes(ingredient: string): Observable<Recipe[]> {
    return this.getRecipes().pipe(
      map((recipes: Recipe[]) =>
        recipes.filter((recipe: Recipe) =>
          recipe.ingredients.some((i: string) =>
            i.toLowerCase().includes(ingredient.toLowerCase())
          )
        )
      )
    );
  }
}
