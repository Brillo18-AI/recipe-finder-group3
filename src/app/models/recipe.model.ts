export interface Recipe {
  id: number;
  title: string;
  ingredients: string[];
  instructions: string[];
  image: string;
  trending?: boolean;
}

