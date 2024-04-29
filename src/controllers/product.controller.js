import path from 'path';
import ProductModel from '../models/product.model.js';
import { error } from 'console';


export default class ProductController{
    getProducts(req, res, next){
        // console.log(path.resolve());//This gives us the absolute path of the file from where our code is being executed that is 'index.js'.
        // return res.sendFile(path.join(path.resolve(), 'src', 'views', 'products.html'));
        let products = ProductModel.getAll();
        console.log(products);
        res.render('products.ejs', {products: products, userEmail: req.session.userEmail});
        next();

        // return res.sendFile(path.join(path.resolve('src', 'views', 'products.html')));
    }

    getAddForm(req, res, next){
       return res.render('new-product.ejs',{errorMessage: null, userEmail: req.session.userEmail});
       next();
    }

    postAddProduct(req, res, next){
        // console.log(req.body);//Undefined
        const {name, desc, price} = req.body;
        const imageUrl = 'images/'+req.file.filename;
        ProductModel.add(name, desc, price, imageUrl);
        let products = ProductModel.getAll();
        res.render('products.ejs', {products, userEmail: req.session.userEmail});
    }

    getUpdateProductView(req, res, next){
        // 1. if product exists then return view.
        // const {id} = req.body;
        const id = req.params.id;
        const productFound = ProductModel.getById(id);
        if(productFound){
            res.render('update-product.ejs', {product: productFound, errorMessage: null, userEmail: req.session.userEmail});
        }
        // 2. else return errors.
        else{
            res.send('Product not found');
        }
    }

    postUpdateProduct(req, res, next){
        ProductModel.update(req.body);
        let products = ProductModel.getAll();
        res.render('products.ejs', {products, userEmail: req.session.userEmail});
        next();
    }

    deleteProduct(req, res, next){
        const id = req.params.id;
        const productFound = ProductModel.getById(id);
        if(!productFound){
            return res.status(401).send('Product not found');
        }
        ProductModel.delete(id);
        let products = ProductModel.getAll();
        res.render('products', {products, userEmail: req.session.userEmail})
    }
}