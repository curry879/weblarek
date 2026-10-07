export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type TPayment = 'card' | 'cash';

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IBuyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}

export interface IProductsResponse {
    total: number;
    items: IProduct[];
}

export interface IOrder extends IBuyer {
    total: number;
    items: string[];
}

export interface IOrderResponse {
    id: string;
    total: number;
}

export interface IPage {
    catalog: HTMLElement[];
    counter: number;
}

export interface IModal {
    content: HTMLElement;
}

export type TCard = Pick<IProduct, 'title' | 'price'>;

export type TCardCatalog = Pick<
    IProduct,
    'title' | 'price' | 'image' | 'category'
>;

export type TCardPreview = Pick<
    IProduct,
    'title' | 'price' | 'image' | 'category' | 'description'
> & {
    buttonText: string;
    disabled: boolean;
};

export type TCardBasket = TCard & {
    index: number;
};

export interface IBasketView {
    items: HTMLElement[];
    total: number;
}

export interface IFormState {
    valid: boolean;
    errors: string;
}

export type TOrderForm = Pick<IBuyer, 'address'> & {
    payment: TPayment | null;
};

export type TContactsForm = Pick<IBuyer, 'email' | 'phone'>;

export type TSuccess = Pick<IOrderResponse, 'total'>;

export type TProductEvent = Pick<IProduct, 'id'>;

export interface IFieldChange<T = string> {
    field: string;
    value: T;
}
