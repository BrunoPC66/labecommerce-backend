import {TUser, TProduct, TPurchase, ToProducts} from "./types"

export const users: TUser[] = [
    {
        id: "u001",
        email: "bruno@gmail.com",
        password: "01234"
    },
    {
        id: "u002",
        email: "nayara@gmail.com",
        password: "56789"
    }
];

export const products: TProduct[] = [
    {
        id: "p001",
        name: "manga",
        price: 6,
        category: ToProducts.FRUITS
    },
    {
        id: "p002",
        name: "goiaba",
        price: 4,
        category: ToProducts.FRUITS
    }
];

export const purchases: TPurchase[] = [
    {
        userId: "u001",
        productId: "p002",
        quantity: 3,
        totalPrice: 12
    },
    {
        userId: "u002",
        productId: "p001",
        quantity: 2,
        totalPrice: 12
    }
];

const allUsers : TUser[] = [...users];

const allProducts : TProduct[] = [...products];

const allPurchases : TPurchase[] = [...purchases];

export function createUser (id: string, email: string, password: string) : void {
    allUsers.push({
        id: id,
        email: email,
        password: password
    })
    console.log("Cadastro de usuário efetuado com sucesso!")
};

export function getAllUsers () {
    console.table(allUsers)
};

export function createProduct (id: string, name: string, price: number, category: ToProducts) : void {
    allProducts.push({
        id: id,
        name: name,
        price: price,
        category: category
    })
    console.log("Cadastro de produto efetuado com sucesso!")
};

export function getAllProducts () {
    console.table(allProducts)
};

export function getProductById (id: string) {  
    const getId = allProducts.filter((product) => {
        return product.id === id
    })

    return console.table(getId)
};

export function getProductByName (name: string) {
    const inputtedName = name
    const getName = allProducts.filter((product) => {
        return product.name.toLowerCase().includes(inputtedName.toLowerCase())
    })
    return console.table(getName)
};

export function makeANewPurchase (userId: string, productId: string, quantity: number, totalPrice: number) : void {
    allPurchases.push({
        userId: userId,
        productId: productId,
        quantity: quantity,
        totalPrice: totalPrice
    })
    console.log("Compra efetuada com sucesso");
};

export function getAllPurchasesFromUserId (userId: string) {
    const purchased = allPurchases.filter((purchase) => {
        return purchase.userId === userId
    })
    console.table(purchased)
};