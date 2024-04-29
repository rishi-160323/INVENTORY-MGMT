import UserModel from "../models/user.model.js";
import ProductModel from "../models/product.model.js";

export default class UserController{
    getRegister(req, res){
        res.render('register');
    }

    getLogin(req, res){
        res.render('login', {errorMessage: null});
    }

    postRegister(req, res){
        const {name, email, password} = req.body;
        UserModel.add(name, email, password);
        res.render('login', {errorMessage: null});
    }

    postLogin(req, res, next){
        const {email, password} = req.body;
        const user = UserModel.isValidUser(email, password);

        if(!user){
            return res.render('login', {errorMessage: "Invalid User's Credentials"});
        }
        req.session.userEmail = email;
        let products = ProductModel.getAll();
        res.render('products.ejs', {products: products, userEmail: req.session.userEmail});
        next();        

    }

    logout(req, res){
        req.session.destroy((err)=>{
            if(err){
                console.log(err);
            }else{
                res.redirect('/login');
            }
        })
    }
}