import { Category } from "@/models";

export class CategoryService {
  getCategories = async (): Promise<Category[]> => {
    let url = `${process.env.CATALOG_API_URL}/category`;
    const response = await fetch(url, {
      next: {
        revalidate: 1, //cache
      },
    });
    return response.json();
  };
}
