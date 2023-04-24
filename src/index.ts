import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import { db } from './database/knex'
import { purchases } from './database';

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

// ------- USERS -------

// getAllUsers
app.get("/users", async (req: Request, res: Response) => {
    try {
        const result = await db("users")

        if (result.length < 1) {
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

// createNewUser
app.post("/users", async (req: Request, res: Response) => {
    try {
        const id = Math.floor(Date.now() * Math.random()).toString(36)
        const name = req.body.name.toUpperCase()
        const email = req.body.email as string
        const password = req.body.password as string

        const [verifyId] = await db("users").where({id: id})
        const [verifyEmail] = await db("users").where({email: email})

        if (!email || !password) {
            res.status(400)
            throw new Error("Informações para criar usuário faltando, verifique e tente novamente")
        };

        if (verifyId) {
            res.status(409)
            throw new Error("Erro incomum, por favor tente novamente")
        }

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

        const newUser = {
            id: id,
            email: email,
            name: name,
            password: password
        }

        await db("users").insert(newUser)

        res.status(201).send("Cadastro realizado com sucesso!")
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

        const [getUser] = await db("users").where({id: id})

        if (typeof id !== "string") {
            res.status(400)
            throw new Error("'id' no formato incorreto, precisa ser uma string")
        }
        if (!getUser) {
            res.status(400)
            throw new Error("'userId' incorreto, selecione um usuário válido")
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
            const editedUser = {
                email: newEmail || getUser.email,
                password: newPassword || getUser.password
            }

            await db("users").update(editedUser).where({id: id})
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

//deleteUserById
app.delete("/users/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const [verifyId] = await db("users").where({id: id})

        if (id !== undefined) {
            if (typeof id !== "string") {
                res.status(400)
                throw new Error("'id' no formato incorreto, precisa ser uma string")
            }
            if (!verifyId) {
                res.status(400)
                throw new Error("'userId' incorreto, selecione um usuário válido")
            }
        };

        await db("users").delete().where({id: id})

        res.status(200).send("Usuário removido com sucesso!")
    }
    catch (err: any) {
        if (res.statusCode === 200) {
            res.status(500).send("Erro inesperado!")
        };
        res.send(err.message)
    }
});

// ------- PRODUCTS -------

// getAllProducts
app.get("/products", async (req: Request, res: Response) => {
    try {
        const result = await db("products")

        if (result.length < 1) {
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
        const name = req.query.name as string
        const result = await db("products").select().where("name", "LIKE", `%${name}%`)
        
        if (name !== undefined) {
            if (name.length < 1) {
                res.status(400)
                throw new Error("Nome do produto deve possuir ao menos 1 caractere")
            }
            if (typeof name !== "string") {
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

// getProductsById
app.get("/products/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const result = await db("products").where({id: id})

        if (id !== undefined) {
            if (typeof id !== "string") {
                res.status(400)
                throw new Error("'id' no formato incorreto, precisa ser uma string")
            }
            if (result.length < 1) {
                res.status(400)
                throw new Error("'id' incorreto, selecione um produto válido")
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

// createNewProduct
app.post("/products", async (req: Request, res: Response) => {
    try {
        const id = Math.floor(Date.now() * Math.random()).toString(36)
        const name = req.body.name.toUpperCase() as string
        const price = req.body.price as number
        const category = req.body.category.toUpperCase() as string

        const [verifyId] = await db("products").where({id: id})
        const [verifyName] = await db("products").where({name: name})

        if (!name || !price || !category) {
            res.status(400)
            throw new Error("Informações para criar produto faltando, verifique e tente novamente")
        }

        if (verifyId) {
            res.status(409)
            throw new Error("Erro incomum, por favor tente novamente")
        }

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

        const newProduct = {
            id: id,
            name: name,
            price: price,
            category: category
        }

        await db("products").insert(newProduct)

        res.status(201).send("Produto registrado com sucesso!")
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

        const newName = req.body.name.toUpperCase()
        const newPrice = req.body.price
        const newCategory = req.body.category.toUpperCase()
    
        const [getProduct] = await db("products").where({id: id})
    
        if (typeof id !== "string") {
            res.status(400)
            throw new Error("'id' no formato incorreto, precisa ser uma string")
        }
        if (!getProduct) {
            res.status(400)
            throw new Error("'id' do produto incorreto, selecione um produto válido")
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

        if (getProduct) {
            const editedProduct = {
            name: newName || getProduct.name,
            price: newPrice || getProduct.price,
            category: newCategory || getProduct.category
            }

            await db("products").update(editedProduct).where({id: id})
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

//deleteProductById
app.delete("/products/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const [verifyId] = await db("products").where({id: id})

        if (id !== undefined) {
            if (typeof id !== "string") {
                res.status(400)
                throw new Error("'id' no formato incorreto, precisa ser uma string")
            }
            if (!verifyId) {
                res.status(400)
                throw new Error("'id' do produto incorreto, selecione um produto válido")
            }
        };

        await await db("products").delete().where({id: id})

        res.status(200).send("Produto removido com sucesso!")
    }
    catch (err: any) {
        if (res.statusCode === 200) {
            res.status(500).send("Erro inesperado!")
        };
        res.send(err.message)
    }
});

// ------- PURCHASES -------

// getAllPurchases
app.get("/purchases", async (req: Request, res: Response) => {
    try {
        const result = await db("purchases")

        if (result.length < 1) {
            res.status(404)
            throw new Error("Requisição inválida, nenhuma compra registrada")
        }

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
app.get("/purchases/:userId/user", async (req: Request, res: Response) => {
    try {
        const { userId } = req.params

        const result = await db("purchases").where({buyer_id: userId})

        if (userId !== undefined) {
            if (typeof userId !== "string") {
                res.status(400)
                throw new Error("'id' no formato incorreto, precisa ser uma string")
            }
            if (result.length < 1) {
                res.status(400)
                throw new Error("'userId' incorreto ou nenhuma compra registrada")
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

// getPurchaseById
app.get("/purchases/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const result = await db("purchases").where({id: id})

        if (id !== undefined) {
            if (typeof id !== "string") {
                res.status(400)
                throw new Error("'id' no formato incorreto, precisa ser uma string")
            }
            if (result.length < 1) {
                res.status(400)
                throw new Error("'id' incorreto ou nenhuma compra registrada")
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

// getCompletePuchaseById
app.get("/purchases/:id/complete", async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const [purchaseById] = await db("purchases")
        .select(
            "purchases.id AS purchaseId",
            "purchases.total_price",
            "purchases.paid",
            "purchases.created_at",
            "purchases.buyer_id",
            "users.email",
            "users.name"
        )
        .innerJoin(
            "users",
            "purchases.buyer_id",
            "=",
            "users.id"
        )
        .where({"purchases.id": id})
        
        const purchasedProducts = await db("purchases_products")
        .select(
            "products.id AS productId",
            "products.name",
            "products.price",
            "products.category",
            "purchases_products.quantity"
        )
        .innerJoin(
            "purchases",
            "purchases_products.purchase_id",
            "=",
            "purchases.id"
        )
        .innerJoin(
            "products",
            "purchases_products.product_id",
            "=",
            "products.id"
        )
        .where({"purchases_products.purchase_id": id})

        if (id !== undefined) {
            if (typeof id !== "string") {
                res.status(400)
                throw new Error("'id' no formato incorreto, precisa ser uma string")
            }
        };

        if (!purchaseById) {
            res.status(404)
            throw new Error(`Compra com id ${id} não encontrada.`);
        }

        const {purchaseId, total_price, paid, created_at, buyer_id, email, name} = purchaseById

        const result = {
            purchaseId,
            total_price,
            paid,
            created_at,
            buyer_id,
            email,
            name,
            productsList: purchasedProducts
        }

        res.status(200).send(result)
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
        const id = Math.floor(Date.now() * Math.random()).toString(36)
        const userEmail = req.body.userEmail as string
        const paid = req.body.paid
        const cart = req.body.cart as [{
            productName: string;
            quantity: number;
        }]
        
        const [verifyUser] = await db("users").where({email: userEmail})
        const userId = verifyUser.id
        let totalPrice = 0

        if (!userEmail || !cart || !paid) {
            res.status(400)
            throw new Error("Informações para criar compra faltando, verifique e tente novamente")
        };

        if (!verifyUser) {
            res.status(400)
            throw new Error("'userId' incorreto, selecione um usuário válido")
        };

        const productsPurchased = cart.map(async (product) => {
            const {productName, quantity} = product
            const [verifyProduct] = await db("products").where({name: productName.toUpperCase()})
            const productTotalPrice = quantity * verifyProduct.price
            totalPrice += productTotalPrice

            if (!verifyProduct) {
                res.status(400)
                throw new Error("'id' do produto incorreto, selecione um produto válido")
            };

            const newPurchasesProducts = {
                purchase_id: id,
                product_id: verifyProduct.id,
                quantity: quantity
            }

            await db("purchases_products").insert(newPurchasesProducts)

            return newPurchasesProducts
        });

        await Promise.all(productsPurchased)
        
        const newPurchase = {
            id: id,
            total_price: totalPrice,
            paid: paid,
            buyer_id: userId
        }

        await db("purchases").insert(newPurchase)

        res.status(201).send("Compra realizada com sucesso!")
    }
    catch (err: any) {
        if (res.statusCode === 200) {
            res.status(500).send("Erro inesperado!")
        };
        res.send(err.message)
    }
});

// deletePuchaseById
app.delete("/purchases/:id/delete", async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const email = req.body.email as string
        const password = req.body.password as string
        
        const [verifyPurchaseId] = await db("purchases").where({id: id})
        const [verifyEmail] = await db("users").where({email: email})        
        
        if (!verifyPurchaseId) {
            res.status(400)
            throw new Error("'id' inválido ou nenhuma compra registrada")
        }
        
        if (!verifyEmail) {
            res.status(401)
            throw new Error("'email' incorreto, selecione um email válido")
        }

        if (verifyPurchaseId.buyer_id !== verifyEmail.id) {
            res.status(401)
            throw new Error("A compra não pertence a este usuário, por favor não tente cancelar a compra alheia")
        }

        if (verifyEmail.password !== password) {
            res.status(401)
            throw new Error("'password' incorreto, selecione uma senha válida")
        }
        
        await db("purchases").delete().where({id: id})

        res.status(201).send("Compra cancelada com sucesso!")
    }
    catch (err: any) {
        if (res.statusCode === 200) {
            res.status(500).send("Erro inesperado!")
        };
        res.send(err.message)
    }
});


// random id = Math.floor(Date.now() * Math.random()).toString(36)