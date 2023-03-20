export type TUser = {
    id: string,
    email: string,
    password: string
};

export enum ToProducts {
    ACCESSORIES = "Acessórios",
    CLOTHES_AND_SHOES = "Roupas e calçados",
    ELECTRONICS = "Eletrônicos",
    FRUITS = "Frutas"
};

export type TProduct = {
    id: string,
    name: string,
    price: number,
    category: ToProducts
};

export type TPurchase = {
    userId: string,
    productId: string,
    quantity: number,
    totalPrice: number
};