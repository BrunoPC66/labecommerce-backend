import {TUser, TProduct, TPurchase} from "./types"

const users: TUser[] = [
    {
        id: "001",
        email: "bruno@gmail.com",
        password: "01234"
    },
    {
        id: "002",
        email: "nayara@gmail.com",
        password: "56789"
    }
]

const products: TProduct[] = [
    {
        id: "001",
        name: "manga",
        price: 6,
        category: "fruta"
    },
    {
        id: "002",
        name: "goiaba",
        price: 4,
        category: "fruta"
    }
]

const purchases: TPurchase[] = [
    {
        userId: "001",
        productId: "002",
        quantity: 3,
        totalPrice: 12
    },
    {
        userId: "002",
        productId: "001",
        quantity: 2,
        totalPrice: 12
    }
]