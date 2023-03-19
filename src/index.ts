import { createProduct, createUser, getAllProducts, getAllPurchasesFromUserId, getAllUsers, getProductById, getProductByName, makeANewPurchase } from "./database";
import { ToProducts } from "./types";


createUser(3, "mike@gmail.com", "25225");
getAllUsers()

createProduct(3, "relógio", 150, ToProducts.ACCESSORIES)
getAllProducts()
getProductById(3)
getProductByName("a")

makeANewPurchase(2, 3, 1, 150)
getAllPurchasesFromUserId(2)