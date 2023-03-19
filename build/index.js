"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
const types_1 = require("./types");
(0, database_1.createUser)(3, "mike@gmail.com", "25225");
(0, database_1.getAllUsers)();
(0, database_1.createProduct)(3, "relógio", 150, types_1.ToProducts.ACCESSORIES);
(0, database_1.getAllProducts)();
(0, database_1.getProductById)(3);
(0, database_1.getProductByName)("a");
(0, database_1.makeANewPurchase)(2, 3, 1, 150);
(0, database_1.getAllPurchasesFromUserId)(2);
//# sourceMappingURL=index.js.map