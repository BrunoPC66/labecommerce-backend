import { users, products, purchases, createProduct, createUser, getAllProducts, getAllPurchasesFromUserId, getAllUsers, getProductById, getProductByName, makeANewPurchase } from "./database";
import { ToProducts, TProduct, TUser, TPurchase } from "./types";
import express, { Request, Response } from 'express'
import cors from 'cors'
import { db } from './database/knex'

createUser("u003", "danilo@gmail.com", "13579");
getAllUsers()

createProduct("p003", "relógio", 150, ToProducts.ACCESSORIES)
getAllProducts()
getProductById("p003")
getProductByName("a")

makeANewPurchase("u002", "p003", 1, 150)
getAllPurchasesFromUserId("u002")

//=====================================
//Express && Knex

const app = express();

app.use(express.json());

app.use(cors());

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003 com sucesso!");
});

app.get("/ping", async (req: Request, res: Response) => {
    res.send("Pong!")
});

// getAllUsers
app.get("/users", async (req: Request, res: Response) => {
    try {
        const result = await db("users")

        if (!result) {
            res.status(404)
            throw new Error("Requisição inválida")
        }

        res.status(200).send(result)
    } catch (err: any) {
        if (res.statusCode === 200) {
            res.status(500).send("Erro inesperado!")
        };
        res.send(err.message)
    }

});

// getAllProducts

app.get("/products", async (req: Request, res: Response) => {
    try {
        const result = await db("products")

        if (!result) {
            res.status(404)
            throw new Error("Requisição inválida")
        }

        res.status(200).send(result)
    } catch (err: any) {
        if (res.statusCode === 200) {
            res.status(500).send("Erro inesperado!")
        };
        res.send(err.message)
    }

});

// getProductByName
app.get("/products/search", async (req: Request, res: Response) => {
    try {
        const q = req.query.q as string

        const result = products.filter(item => item.name.toLowerCase().includes(q.toLowerCase()))

        if (q !== undefined) {
            if (q.length < 1) {
                res.status(400)
                throw new Error("Nome do produto deve possuir ao menos 1 caractere")
            }
            if (typeof q !== "string") {
                res.status(400)
                throw new Error("Nome do produto deve ser uma string")
            }
            if (result.length < 1) {
                res.status(404)
                throw new Error("Produto não encontrado")
            }
        }

        res.status(200).send(result)
    } catch (err: any) {
        if (res.statusCode === 200) {
            res.status(500).send("Erro inesperado!")
        };
        res.send(err.message)
    }
});

// createNewUser
app.post("/users", async (req: Request, res: Response) => {
    try {

        const id = req.body.id as string
        const email = req.body.email as string
        const password = req.body.password as string

        const verifyId = users.find(user => user.id === id)
        const verifyEmail = users.find(user => user.email === email)

        if (!id || !email || !password) {
            res.status(400)
            throw new Error("Informações para criar usuário faltando, verifique e tente novamente")
        };

        if (id !== undefined) {
            if (typeof id !== 'string') {
                res.status(400)
                throw new Error("'id' no formato incorreto, precisa ser uma string")
            }
            if (id.length < 4) {
                res.status(400)
                throw new Error("O 'id' deve conter um mínimo de 4 caracteres")
            }
            if (verifyId) {
                res.status(409)
                throw new Error("Id de usuário já existe, insira um id diferente")
            }
        };

        if (email !== undefined) {
            if (typeof email !== 'string') {
                res.status(400)
                throw new Error("'email' no formato incorreto, precisa ser uma string")
            }
            if (verifyEmail) {
                res.status(409)
                throw new Error("Email já existente, insira um email diferente")
            }
        };

        if (password !== undefined) {
            if (typeof password !== 'string') {
                res.status(400)
                throw new Error("'password' no formato incorreto, precisa ser uma string")
            }
            if (password.length < 5) {
                res.status(400)
                throw new Error("O 'password' deve conter no mínimo 5 caracters")
            }
        };

        users.push({ id: id, email: email, password: password })

        res.status(201).send("Cadastro realizado com sucesso!")
    }
    catch (err: any) {
        if (res.statusCode === 200) {
            res.status(500).send("Erro inesperado!")
        };
        res.send(err.message)
    }
});

// createNewProduct
app.post("/products", async (req: Request, res: Response) => {
    try {
        const id = req.body.id as string
        const name = req.body.name as string
        const price = req.body.price as number
        const category = req.body.category as ToProducts

        const verifyId = products.find(product => product.id === id)
        const verifyName = products.find(product => product.name === name)

        if (!id || !name || !price || !category) {
            res.status(400)
            throw new Error("Informações para criar produto faltando, verifique e tente novamente")
        }

        if (id !== undefined) {
            if (typeof id !== 'string') {
                res.status(400)
                throw new Error("'id' no formato incorreto, precisa ser uma string")
            }
            if (verifyId) {
                res.status(409)
                throw new Error("Id de produto já existe, insira um id diferente")
            }
        };

        if (name !== undefined) {
            if (typeof name !== 'string') {
                res.status(400)
                throw new Error("'name' no formato incorreto, precisa ser uma string")
            }
            if (verifyName) {
                res.status(409)
                throw new Error("Produto já existente, modifique os valores do produto existente ou dê um novo nome a este")
            }
        };

        if (price !== undefined) {
            if (typeof price !== 'number') {
                res.status(400)
                throw new Error("'price' no formato incorreto, precisa ser um number")
            }
            if (price < 0) {
                res.status(400)
                throw new Error("Valor inválido, o 'price' do produto deve ser maior ou igual a 0")
            }
        };

        if (category !== undefined) {
            if (category !== "Acessórios") {
                if (category !== "Roupas e calçados") {
                    if (category !== "Eletrônicos") {
                        if (category !== "Frutas") {
                            res.status(400)
                            throw new Error("Categoria não existente, selecione uma das seguintes: 'Acessórios', 'Roupas e calçados', 'Eletrônicos' ou 'Frutas'")
                        }    
                    }
                }    
            }
        };

        products.push({
            id: id,
            name: name,
            price: price,
            category: category
        })

        res.status(201).send("Produto registrado com sucesso!")
    }
    catch (err: any) {
        if (res.statusCode === 200) {
            res.status(500).send("Erro inesperado!")
        };
        res.send(err.message)
    }
});

// makeNewPurchase
app.post("/purchases", async (req: Request, res: Response) => {
    try {

        const userId = req.body.userId as string
        const productId = req.body.productId as string
        const quantity = req.body.quantity as number
        const totalPrice = req.body.totalPrice as number

        const verifyUserId = users.find(user => user.id === userId)
        const verifyProductId = products.find(product => product.id === productId)

        if (!userId || !productId || !quantity || !totalPrice) {
            res.status(400)
            throw new Error("Informações para criar compra faltando, verifique e tente novamente")
        };

        if (userId && productId && quantity && totalPrice) {
            if (!verifyUserId) {
                res.status(400)
                throw new Error("'userId' inexistente ou incorreto, selecione um usuário válido")
            };

            if (!verifyProductId) {
                res.status(400)
                throw new Error("'productId' inexistente ou incorreto, selecione um produto válido")
            };
            if (verifyProductId) {
                const verifyTotalPrice = verifyProductId?.price * quantity
                if (verifyTotalPrice !== totalPrice) {
                    res.status(400)
                    throw new Error("Valor 'totalPrice' incorreto, verifique o valor do produto e a quantidade e insira o total correto")
                }
            }
        };

        purchases.push({
            userId: userId,
            productId: productId,
            quantity: quantity,
            totalPrice: totalPrice
        })

        res.status(201).send("Compra realizada com sucesso!")
    }
    catch (err: any) {
        if (res.statusCode === 200) {
            res.status(500).send("Erro inesperado!")
        };
        res.send(err.message)
    }

});

//Express II

// getProductsById
app.get("/products/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const result = products.find(product => product.id === id)

        if (id !== undefined) {
            if (typeof id !== "string") {
                res.status(400)
                throw new Error("'id' no formato incorreto, precisa ser uma string")
            }
            if (!result) {
                res.status(400)
                throw new Error("'productId' inexistente ou incorreto, selecione um produto válido")
            }
        };

        res.status(200).send(result)
    }
    catch (err: any) {
        if (res.statusCode === 200) {
            res.status(500).send("Erro inesperado!")
        };
        res.send(err.message)
    }
});

// getPurchaseByUserId
app.get("/purchases/:userId", async (req: Request, res: Response) => {
    try {
        const { userId } = req.params

        const result = purchases.find(purchase => purchase.userId === userId)

        if (userId !== undefined) {
            if (typeof userId !== "string") {
                res.status(400)
                throw new Error("'id' no formato incorreto, precisa ser uma string")
            }
            if (!result) {
                res.status(400)
                throw new Error("'userId' inexistente ou incorreto, selecione um usuário válido")
            }
        };

        res.status(200).send(result)
    }
    catch (err: any) {
        if (res.statusCode === 200) {
            res.status(500).send("Erro inesperado!")
        };
        res.send(err.message)
    }
});

//deleteUserById
app.delete("/users/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const verifyId = users.find(user => user.id === id)

        const index = users.findIndex(user => user.id === id)

        if (id !== undefined) {
            if (typeof id !== "string") {
                res.status(400)
                throw new Error("'id' no formato incorreto, precisa ser uma string")
            }
            if (!verifyId) {
                res.status(400)
                throw new Error("'userId' inexistente ou incorreto, selecione um usuário válido")
            }
        };

        users.splice(index, 1)

        res.status(200).send("Usuário removido com sucesso!")
    }
    catch (err: any) {
        if (res.statusCode === 200) {
            res.status(500).send("Erro inesperado!")
        };
        res.send(err.message)
    }
});

//deleteProductById
app.delete("/products/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const verifyId = products.find(product => product.id === id)

        const index = products.findIndex(product => product.id === id)

        if (id !== undefined) {
            if (typeof id !== "string") {
                res.status(400)
                throw new Error("'id' no formato incorreto, precisa ser uma string")
            }
            if (!verifyId) {
                res.status(400)
                throw new Error("'productId' inexistente ou incorreto, selecione um produto válido")
            }
        };

        products.splice(index, 1)

        res.status(200).send("Produto removido com sucesso!")
    }
    catch (err: any) {
        if (res.statusCode === 200) {
            res.status(500).send("Erro inesperado!")
        };
        res.send(err.message)
    }
});

//editUserById
app.put("/users/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const newEmail = req.body.email
        const newPassword = req.body.password

        const getUser = users.find(user => user.id === id)

        if (typeof id !== "string") {
            res.status(400)
            throw new Error("'id' no formato incorreto, precisa ser uma string")
        }
        if (!getUser) {
            res.status(400)
            throw new Error("'userId' inexistente ou incorreto, selecione um usuário válido")
        }

        if (newEmail !== undefined) {
            if (typeof newEmail !== "string") {
                res.status(400)
                throw new Error("'email' no formato incorreto, precisa ser uma string")
            }
            if (!newEmail.includes("@")) {
                res.status(400)
                throw new Error("Email não aceito, insira um email válido")
            }
        };

        if (newPassword !== undefined) {
            if (typeof newPassword !== "string") {
                res.status(400)
                throw new Error("'password' no formato incorreto, precisa ser uma string")
            }
            if (newPassword.length < 5) {
                res.status(400)
                throw new Error("O 'password' deve conter no mínimo 5 caracters")
            }
        };

        if (getUser) {
            getUser.email = newEmail || getUser.email
            getUser.password = newPassword || getUser.password
        };

        res.status(200).send("Usuário atualizado com sucesso!")
    }
    catch (err: any) {
        if (res.statusCode === 200) {
            res.status(500).send("Erro inesperado!")
        };
        res.send(err.message)
    }
});


//editProductById
app.put("/products/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const newName = req.body.name
        const newPrice = req.body.price
        const newCategory = req.body.category
    
        const getProduct = products.find(product => product.id === id)
    
        if (typeof id !== "string") {
            res.status(400)
            throw new Error("'id' no formato incorreto, precisa ser uma string")
        }
        if (!getProduct) {
            res.status(400)
            throw new Error("'productId' inexistente ou incorreto, selecione um produto válido")
        }

        if (newName !== undefined) {
            if (typeof newName !== "string") {
                res.status(400)
                throw new Error("'name' no formato incorreto, precisa ser uma string")
            };    
        }

        if (newPrice !== undefined) {
            if (typeof newPrice !== "number") {
                res.status(400)
                throw new Error("'price' no formato incorreto, precisa ser um number")
            }    
        }

        if (newCategory !== undefined) {
            if (newCategory !== "Acessórios") {
                if (newCategory !== "Roupas e calçados") {
                    if (newCategory !== "Eletrônicos") {
                        if (newCategory !== "Frutas") {
                            res.status(400)
                            throw new Error("Categoria não existente, selecione uma das seguintes: 'Acessórios', 'Roupas e calçados', 'Eletrônicos' ou 'Frutas'")
                        }    
                    }
                }    
            }
        };

        if (getProduct) {
            getProduct.name = newName || getProduct.name
            getProduct.price = newPrice || getProduct.price
            getProduct.category = newCategory || getProduct.category
        }
    
        res.status(200).send("Produto atualizado com sucesso!")    
    }
    catch (err: any) {
        if (res.statusCode === 200) {
            res.status(500).send("Erro inesperado!")
        };
        res.send(err.message)
    }
});