import { Product } from "@/models";

export class ProductService {
  getProducts = async ({
    search,
    category_id,
  }: {
    search: string | undefined;
    category_id: string | undefined;
  }): Promise<Product[]> => {
    let url = `${process.env.CATALOG_API_URL}/product`;
    if (category_id) {
      url += `/category/${category_id}`;
    }
    const response = await fetch(url, {
      next: {
        revalidate: 1, //cache
      },
    });
    let data = (await response.json()) ?? [];
    if (search) {
      return data.filter((product: Product) => {
        return product.name
          .toLocaleLowerCase()
          .includes(search.toLocaleLowerCase());
      });
    }
    return data;
  };

  getProduct = async (productId: string): Promise<Product> => {
    const response = await fetch(
      `${process.env.CATALOG_API_URL}/product/${productId}`,
      {
        next: {
          revalidate: 1, //cache
        },
      }
    );
    return response.json();
  };

  getProductsByIds = async (productIds: string[]): Promise<Product[]> => {
    const responses = await Promise.all(
      productIds.map((productId) =>
        fetch(`${process.env.CATALOG_API_URL}/product/${productId}`, {
          next: {
            revalidate: 1,
          },
        })
      )
    );

    return Promise.all(responses.map((response) => response.json()));
  };
}
