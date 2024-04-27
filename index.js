// const express = require('express');
import express from 'express';
import ProductController from './src/controllers/product.controller.js';
import UserController from './src/controllers/user.controller.js';
import ejsLayouts from 'express-ejs-layouts';
import path from 'path';
import validateRequest from './src/middlewares/validation.middleware.js';
import { uploadFile } from './src/middlewares/file-upload.middleware.js';

const server = express();
server.use(express.static('./src/public'));

// Parse form data
server.use(express.urlencoded({extended: true}));

// Setup view engine settings
server.set("view engine", "ejs");
server.set("views", path.join(path.resolve('src', 'views')))//We are giving the path for the folder not to the file because our application will have many views.

server.use(ejsLayouts);

// Create an instance of product controller
const productController = new ProductController();
const userController = new UserController();


server.get('/register', userController.getRegister);
server.get('/', productController.getProducts);
server.get('/add-product', productController.getAddForm);
server.get('/update-product/:id', productController.getUpdateProductView);
server.post('/delete-product/:id', productController.deleteProduct);
server.post('/', uploadFile.single('imageUrl'), validateRequest, productController.postAddProduct);
server.post('/update-product', productController.postUpdateProduct);


server.use(express.static('src/views'));

server.listen(3400);