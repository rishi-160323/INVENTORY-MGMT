// export default expects theree things
// HoistedDeclaration --> a function with function keyword
// Class
// Assigment Expression 
import { body, validationResult } from "express-validator";

const validateRequest = async (req, res, next)=>{
    // Validate data
    // 1. Setup rules for validation
    const rules = [
        body('name').notEmpty().withMessage('Name is required'),
        body('price').isFloat({gt:0}).withMessage('Price should be a positive value'),
        // body('imageUrl').isURL().withMessage('Invalid url'),
        body('imageUrl').custom((value, {req})=>{
            if(!req.file){
                throw new Error('Image is required');
            }
            return true;
        })
    ];

    // 2. Run those rules.
    await Promise.all(rules.map(rule=>rule.run(req)));

    // 3. Check if there are any errors after running the rules.
    var validationErrors = validationResult(req);

    // const {name, price, imageUrl} = req.body;
    // let errors = [];
    // if(!name || name.trim() == ""){
    //     errors.push("Name is required");
    // }
    // if(!price || parseFloat(price)<1){
    //     errors.push("Price must be a positive value")
    // }
    // try{
    //     const validUrl = new URL(imageUrl);//Checks whther the url is valid or invalid.
    // }catch(error){
    //     errors.push("Url is invalid");
    // }

    // 4. If errors, return the error message.

    if(!validationErrors.isEmpty()){
        return res.render('new-product.ejs',{
            errorMessage: validationErrors.array()[0].msg,
        })
    }
    next();
}

export default validateRequest;