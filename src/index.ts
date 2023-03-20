import { users, products, purchases, createProduct, createUser, getAllProducts, getAllPurchasesFromUserId, getAllUsers, getProductById, getProductByName, makeANewPurchase } from "./database";
import { ToProducts, TProduct, TUser, TPurchase } from "./types";
import express, {Request, Response} from 'express'
import cors from 'cors'


createUser("u03", "danilo@gmail.com", "13579");
getAllUsers()

createProduct("p03", "relógio", 150, ToProducts.ACCESSORIES)
getAllProducts()
getProductById("p03")
getProductByName("a")

makeANewPurchase("u02", "p03", 1, 150)
getAllPurchasesFromUserId("u02")

//=====================================
//Express I

const app = express();

app.use(express.json());

app.use(cors());

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003 com sucesso!");
});

app.get("/ping", (req: Request, res: Response) => {
    res.send("Pong!")
});

// getAllUsers
app.get("/users", (req: Request, res: Response) => {
    res.status(200).send(users)
});

// getAllProducts

app.get("/products", (req: Request, res: Response) => {
    res.status(200).send(products)
});

// getProductByName
app.get("/products/search", (req: Request, res: Response) => {
    const q = req.query.q as string

    const result = products.filter(item => item.name.toLocaleLowerCase().includes(q.toLocaleLowerCase()))

    res.status(200).send(result)
});

// createNewUser
app.post("/users", (req: Request, res: Response) => {
const newUser: TUser = {
    id: req.body.id,
    email: req.body.email,
    password: req.body.password
}

users.push(newUser)

res.status(201).send("Cadastro realizado com sucesso!")
});

// createNewProduct
app.post("/products", (req: Request, res: Response) => {
const newProduct: TProduct = {
    id: req.body.id,
    name: req.body.name,
    price: req.body.price,
    category: req.body.category
}

products.push(newProduct)

res.status(201).send("Produto registrado com sucesso!")
});

// makeNewPurchase
app.post("/purchases", (req: Request, res: Response) => {
const newPurchase: TPurchase = {
    userId: req.body.userId,
    productId: req.body.productId,
    quantity: req.body.quantity,
    totalPrice: req.body.totalPrice
}

purchases.push(newPurchase)

res.status(201).send("Compra realizada com sucesso!")
});

//Express II

// getProductsById
app.get("/products/:id", (req: Request, res: Response) => {
    const {id} = req.params

    const result = products.find(product => product.id === id)

    res.status(200).send(result)
});

// getPurchaseByUserId
app.get("/purchases/:userId", (req: Request, res: Response) => {
    const {userId} = req.params

    const result = purchases.find(purchase => purchase.userId === userId)

    res.status(200).send(result)
});

//deleteUserById
app.delete("/users/:id", (req: Request, res: Response) => {
    const {id} = req.params

    const index = users.findIndex(user => user.id === id)

    users.splice(index, 1)

    res.status(200).send("Usuário removido com sucesso!")
});

//deleteProductById
app.delete("/products/:id", (req: Request, res: Response) => {
    const {id} = req.params

    const index = products.findIndex(product => product.id === id)

    products.splice(index, 1)

    res.status(200).send("Produto removido com sucesso!")
});

//editUserById
app.put("/users/:id", (req: Request, res: Response) => {
    const {id} = req.params

    const newEmail = req.body.email
    const newPassword = req.body.password

    const getUser = users.find(user => user.id === id)

    if (getUser) {
        getUser.email = newEmail || getUser.email
        getUser.password = newPassword || getUser.password
    }

    res.status(200).send("Usuário atualizado com sucesso!")
});


//editProductById
app.put("/products/:id", (req: Request, res: Response) => {
    const {id} = req.params

    const newName = req.body.name
    const newPrice = req.body.price
    const newCategory = req.body.category

    const getProduct = products.find(product => product.id === id)

    if (getProduct) {
        getProduct.name = newName || getProduct.name
        getProduct.price = newPrice || getProduct.price
        getProduct.category = newCategory || getProduct.category
    }

    res.status(200).send("Produto atualizado com sucesso!")
});