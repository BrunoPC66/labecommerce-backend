export type TUser = {
    id: number,
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
    id: number,
    name: string,
    price: number,
    category: ToProducts
};

export type TPurchase = {
    userId: number,
    productId: number,
    quantity: number,
    totalPrice: number
};