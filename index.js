// const express = require('express');
import express from 'express';
import ProductController from './src/controllers/product.controller.js';
import UserController from './src/controllers/user.controller.js';
import ejsLayouts from 'express-ejs-layouts';
import path from 'path';
import validateRequest from './src/middlewares/validation.middleware.js';
import { uploadFile } from './src/middlewares/file-upload.middleware.js';
import session from 'express-session';
import { auth } from './src/middlewares/auth.middleware.js';

const server = express();
server.use(express.static('./src/public'));
server.use(session({
    secret: "SecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}//cookie: false for http and true for https. 
}))

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
server.get('/login', userController.getLogin);
server.post('/register', userController.postRegister);
server.post('/login', userController.postLogin);
server.get('/logout', userController.logout);
server.get('/', auth, productController.getProducts);
server.get('/add-product', auth, productController.getAddForm);
server.get('/update-product/:id', auth, productController.getUpdateProductView);
server.post('/delete-product/:id', auth, productController.deleteProduct);
server.post('/', auth, uploadFile.single('imageUrl'), validateRequest, productController.postAddProduct);
server.post('/update-product', auth, productController.postUpdateProduct);


server.use(express.static('src/views'));

server.listen(3400);