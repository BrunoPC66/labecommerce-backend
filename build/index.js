"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
const types_1 = require("./types");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const knex_1 = require("./database/knex");
(0, database_1.createUser)("u003", "danilo@gmail.com", "13579");
(0, database_1.getAllUsers)();
(0, database_1.createProduct)("p003", "relógio", 150, types_1.ToProducts.ACCESSORIES);
(0, database_1.getAllProducts)();
(0, database_1.getProductById)("p003");
(0, database_1.getProductByName)("a");
(0, database_1.makeANewPurchase)("u002", "p003", 1, 150);
(0, database_1.getAllPurchasesFromUserId)("u002");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003 com sucesso!");
});
app.get("/ping", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("Pong!");
}));
app.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, knex_1.db)("users");
        if (!result) {
            res.status(404);
            throw new Error("Requisição inválida");
        }
        res.status(200).send(result);
    }
    catch (err) {
        if (res.statusCode === 200) {
            res.status(500).send("Erro inesperado!");
        }
        ;
        res.send(err.message);
    }
}));
app.get("/products", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, knex_1.db)("products");
        if (!result) {
            res.status(404);
            throw new Error("Requisição inválida");
        }
        res.status(200).send(result);
    }
    catch (err) {
        if (res.statusCode === 200) {
            res.status(500).send("Erro inesperado!");
        }
        ;
        res.send(err.message);
    }
}));
app.get("/products/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const nameToSearch = req.query.q;
        const result = yield (0, knex_1.db)("products").where({ name: nameToSearch.toLowerCase() });
        if (nameToSearch !== undefined) {
            if (nameToSearch.length < 1) {
                res.status(400);
                throw new Error("Nome do produto deve possuir ao menos 1 caractere");
            }
            if (typeof nameToSearch !== "string") {
                res.status(400);
                throw new Error("Nome do produto deve ser uma string");
            }
            if (result.length < 1) {
                res.status(404);
                throw new Error("Produto não encontrado");
            }
        }
        res.status(200).send(result);
    }
    catch (err) {
        if (res.statusCode === 200) {
            res.status(500).send("Erro inesperado!");
        }
        ;
        res.send(err.message);
    }
}));
app.post("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.body.id;
        const email = req.body.email;
        const password = req.body.password;
        const verifyId = yield (0, knex_1.db)("users").where({ id: id });
        const verifyEmail = yield (0, knex_1.db)("users").where({ email: email });
        if (!id || !email || !password) {
            res.status(400);
            throw new Error("Informações para criar usuário faltando, verifique e tente novamente");
        }
        ;
        if (id !== undefined) {
            if (typeof id !== 'string') {
                res.status(400);
                throw new Error("'id' no formato incorreto, precisa ser uma string");
            }
            if (id.length < 4) {
                res.status(400);
                throw new Error("O 'id' deve conter um mínimo de 4 caracteres");
            }
            if (verifyId) {
                res.status(409);
                throw new Error("Id de usuário já existe, insira um id diferente");
            }
        }
        ;
        if (email !== undefined) {
            if (typeof email !== 'string') {
                res.status(400);
                throw new Error("'email' no formato incorreto, precisa ser uma string");
            }
            if (verifyEmail) {
                res.status(409);
                throw new Error("Email já existente, insira um email diferente");
            }
        }
        ;
        if (password !== undefined) {
            if (typeof password !== 'string') {
                res.status(400);
                throw new Error("'password' no formato incorreto, precisa ser uma string");
            }
            if (password.length < 5) {
                res.status(400);
                throw new Error("O 'password' deve conter no mínimo 5 caracters");
            }
        }
        ;
        const newUser = {
            id: id,
            email: email,
            password: password
        };
        yield (0, knex_1.db)("users").insert(newUser);
        res.status(201).send("Cadastro realizado com sucesso!");
    }
    catch (err) {
        if (res.statusCode === 200) {
            res.status(500).send("Erro inesperado!");
        }
        ;
        res.send(err.message);
    }
}));
app.post("/products", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.body.id;
        const name = req.body.name;
        const price = req.body.price;
        const category = req.body.category;
        const verifyId = yield (0, knex_1.db)("products").where({ id: id });
        const verifyName = yield (0, knex_1.db)("products").where({ name: name.toLowerCase() });
        if (!id || !name || !price || !category) {
            res.status(400);
            throw new Error("Informações para criar produto faltando, verifique e tente novamente");
        }
        if (id !== undefined) {
            if (typeof id !== 'string') {
                res.status(400);
                throw new Error("'id' no formato incorreto, precisa ser uma string");
            }
            if (verifyId) {
                res.status(409);
                throw new Error("Id de produto já existe, insira um id diferente");
            }
        }
        ;
        if (name !== undefined) {
            if (typeof name !== 'string') {
                res.status(400);
                throw new Error("'name' no formato incorreto, precisa ser uma string");
            }
            if (verifyName) {
                res.status(409);
                throw new Error("Produto já existente, modifique os valores do produto existente ou dê um novo nome a este");
            }
        }
        ;
        if (price !== undefined) {
            if (typeof price !== 'number') {
                res.status(400);
                throw new Error("'price' no formato incorreto, precisa ser um number");
            }
            if (price < 0) {
                res.status(400);
                throw new Error("Valor inválido, o 'price' do produto deve ser maior ou igual a 0");
            }
        }
        ;
        const newProduct = {
            id: id,
            name: name,
            price: price,
            category: category
        };
        yield (0, knex_1.db)("products").insert(newProduct);
        res.status(201).send("Produto registrado com sucesso!");
    }
    catch (err) {
        if (res.statusCode === 200) {
            res.status(500).send("Erro inesperado!");
        }
        ;
        res.send(err.message);
    }
}));
app.post("/purchases", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body.userId;
        const productId = req.body.productId;
        const quantity = req.body.quantity;
        const totalPrice = req.body.totalPrice;
        const verifyUserId = yield (0, knex_1.db)("users").where({ id: userId });
        const verifyProductId = yield (0, knex_1.db)("products").where({ id: productId });
        if (!userId || !productId || !quantity || !totalPrice) {
            res.status(400);
            throw new Error("Informações para criar compra faltando, verifique e tente novamente");
        }
        ;
        if (userId && productId && quantity && totalPrice) {
            if (!verifyUserId) {
                res.status(400);
                throw new Error("'userId' inexistente ou incorreto, selecione um usuário válido");
            }
            ;
            if (!verifyProductId) {
                res.status(400);
                throw new Error("'productId' inexistente ou incorreto, selecione um produto válido");
            }
            ;
            console.log(verifyProductId);
        }
        ;
        const newPurchase = {
            userId: userId,
            productId: productId,
            quantity: quantity,
            totalPrice: totalPrice
        };
        yield (0, knex_1.db)("purchases").insert(newPurchase);
        res.status(201).send("Compra realizada com sucesso!");
    }
    catch (err) {
        if (res.statusCode === 200) {
            res.status(500).send("Erro inesperado!");
        }
        ;
        res.send(err.message);
    }
}));
app.get("/products/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = database_1.products.find(product => product.id === id);
        if (id !== undefined) {
            if (typeof id !== "string") {
                res.status(400);
                throw new Error("'id' no formato incorreto, precisa ser uma string");
            }
            if (!result) {
                res.status(400);
                throw new Error("'productId' inexistente ou incorreto, selecione um produto válido");
            }
        }
        ;
        res.status(200).send(result);
    }
    catch (err) {
        if (res.statusCode === 200) {
            res.status(500).send("Erro inesperado!");
        }
        ;
        res.send(err.message);
    }
}));
app.get("/purchases/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const result = database_1.purchases.find(purchase => purchase.userId === userId);
        if (userId !== undefined) {
            if (typeof userId !== "string") {
                res.status(400);
                throw new Error("'id' no formato incorreto, precisa ser uma string");
            }
            if (!result) {
                res.status(400);
                throw new Error("'userId' inexistente ou incorreto, selecione um usuário válido");
            }
        }
        ;
        res.status(200).send(result);
    }
    catch (err) {
        if (res.statusCode === 200) {
            res.status(500).send("Erro inesperado!");
        }
        ;
        res.send(err.message);
    }
}));
app.delete("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const verifyId = database_1.users.find(user => user.id === id);
        const index = database_1.users.findIndex(user => user.id === id);
        if (id !== undefined) {
            if (typeof id !== "string") {
                res.status(400);
                throw new Error("'id' no formato incorreto, precisa ser uma string");
            }
            if (!verifyId) {
                res.status(400);
                throw new Error("'userId' inexistente ou incorreto, selecione um usuário válido");
            }
        }
        ;
        database_1.users.splice(index, 1);
        res.status(200).send("Usuário removido com sucesso!");
    }
    catch (err) {
        if (res.statusCode === 200) {
            res.status(500).send("Erro inesperado!");
        }
        ;
        res.send(err.message);
    }
}));
app.delete("/products/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const verifyId = database_1.products.find(product => product.id === id);
        const index = database_1.products.findIndex(product => product.id === id);
        if (id !== undefined) {
            if (typeof id !== "string") {
                res.status(400);
                throw new Error("'id' no formato incorreto, precisa ser uma string");
            }
            if (!verifyId) {
                res.status(400);
                throw new Error("'productId' inexistente ou incorreto, selecione um produto válido");
            }
        }
        ;
        database_1.products.splice(index, 1);
        res.status(200).send("Produto removido com sucesso!");
    }
    catch (err) {
        if (res.statusCode === 200) {
            res.status(500).send("Erro inesperado!");
        }
        ;
        res.send(err.message);
    }
}));
app.put("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const newEmail = req.body.email;
        const newPassword = req.body.password;
        const getUser = database_1.users.find(user => user.id === id);
        if (typeof id !== "string") {
            res.status(400);
            throw new Error("'id' no formato incorreto, precisa ser uma string");
        }
        if (!getUser) {
            res.status(400);
            throw new Error("'userId' inexistente ou incorreto, selecione um usuário válido");
        }
        if (newEmail !== undefined) {
            if (typeof newEmail !== "string") {
                res.status(400);
                throw new Error("'email' no formato incorreto, precisa ser uma string");
            }
            if (!newEmail.includes("@")) {
                res.status(400);
                throw new Error("Email não aceito, insira um email válido");
            }
        }
        ;
        if (newPassword !== undefined) {
            if (typeof newPassword !== "string") {
                res.status(400);
                throw new Error("'password' no formato incorreto, precisa ser uma string");
            }
            if (newPassword.length < 5) {
                res.status(400);
                throw new Error("O 'password' deve conter no mínimo 5 caracters");
            }
        }
        ;
        if (getUser) {
            getUser.email = newEmail || getUser.email;
            getUser.password = newPassword || getUser.password;
        }
        ;
        res.status(200).send("Usuário atualizado com sucesso!");
    }
    catch (err) {
        if (res.statusCode === 200) {
            res.status(500).send("Erro inesperado!");
        }
        ;
        res.send(err.message);
    }
}));
app.put("/products/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const newName = req.body.name;
        const newPrice = req.body.price;
        const newCategory = req.body.category;
        const getProduct = database_1.products.find(product => product.id === id);
        if (typeof id !== "string") {
            res.status(400);
            throw new Error("'id' no formato incorreto, precisa ser uma string");
        }
        if (!getProduct) {
            res.status(400);
            throw new Error("'productId' inexistente ou incorreto, selecione um produto válido");
        }
        if (newName !== undefined) {
            if (typeof newName !== "string") {
                res.status(400);
                throw new Error("'name' no formato incorreto, precisa ser uma string");
            }
            ;
        }
        if (newPrice !== undefined) {
            if (typeof newPrice !== "number") {
                res.status(400);
                throw new Error("'price' no formato incorreto, precisa ser um number");
            }
        }
        if (newCategory !== undefined) {
            if (newCategory !== "Acessórios") {
                if (newCategory !== "Roupas e calçados") {
                    if (newCategory !== "Eletrônicos") {
                        if (newCategory !== "Frutas") {
                            res.status(400);
                            throw new Error("Categoria não existente, selecione uma das seguintes: 'Acessórios', 'Roupas e calçados', 'Eletrônicos' ou 'Frutas'");
                        }
                    }
                }
            }
        }
        ;
        if (getProduct) {
            getProduct.name = newName || getProduct.name;
            getProduct.price = newPrice || getProduct.price;
            getProduct.category = newCategory || getProduct.category;
        }
        res.status(200).send("Produto atualizado com sucesso!");
    }
    catch (err) {
        if (res.statusCode === 200) {
            res.status(500).send("Erro inesperado!");
        }
        ;
        res.send(err.message);
    }
}));
//# sourceMappingURL=index.js.map