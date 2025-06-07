export interface ProductsPayload {
    page: number;
    size: number;
}

export interface ProductsResponse {
  content: Product[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: Sort;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  first: boolean;
  empty: boolean;
}

export interface Product {
    id: string,
    mainImage: Image,
    images: Image[],
    name: string,
    producer: string,
    price: number,
    quantity: number,
    description: string,
    status: string,
    category: string,
    subcategory: string,
    seller: {
        id: string | null,
        name: string,
        email: string,
        companyName: string,
        telephoneNumber: string,
        role: string | null,
        products: Array
    },
}

export interface Image {
    id: string,
    url: string,
    publicId: string
}