import {TUser, TProduct, TPurchase, ToProducts} from "./types"

const users: TUser[] = [
    {
        id: 1,
        email: "bruno@gmail.com",
        password: "01234"
    },
    {
        id: 2,
        email: "nayara@gmail.com",
        password: "56789"
    }
];

const products: TProduct[] = [
    {
        id: 1,
        name: "manga",
        price: 6,
        category: ToProducts.FRUITS
    },
    {
        id: 2,
        name: "goiaba",
        price: 4,
        category: ToProducts.FRUITS
    }
];

const purchases: TPurchase[] = [
    {
        userId: 1,
        productId: 2,
        quantity: 3,
        totalPrice: 12
    },
    {
        userId: 2,
        productId: 1,
        quantity: 2,
        totalPrice: 12
    }
];

const allUsers : TUser[] = [...users];

const allProducts : TProduct[] = [...products];

const allPurchases : TPurchase[] = [...purchases];

export function createUser (id: number, email: string, password: string) : void {
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

export function createProduct (id: number, name: string, price: number, category: ToProducts) : void {
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

export function getProductById (id: number) {  
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

export function makeANewPurchase (userId: number, productId: number, quantity: number, totalPrice: number) : void {
    allPurchases.push({
        userId: userId,
        productId: productId,
        quantity: quantity,
        totalPrice: totalPrice
    })
    console.log("Compra efetuada com sucesso");
};

export function getAllPurchasesFromUserId (userId: number) {
    const purchased = allPurchases.filter((purchase) => {
        return purchase.userId === userId
    })
    console.table(purchased)
};