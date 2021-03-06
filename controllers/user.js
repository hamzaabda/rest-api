const User = require('./../models/user');
const jwt = require('jsonwebtoken');

const {SECRET_KEY}=require('./../config');
const bcrypt =require('bcrypt');
const crypto = require('crypto');
const user = require('./../models/user');
const nodemailer = require('nodemailer');


exports.register = async (req,res) => {
    const {nom,prenom,email,cin,role,password}=req.body;

    const user = await User.findOne({email,cin});
    if(user)
        return res.status(403).json({error:{message:'Email or cin already in use!'}});
    const newUser = new User({nom,prenom,email,cin,role,password});
    await newUser.save();
    res.status(200).json({message:'success'});
};

exports.login=async(req,res,next)=>{
    const {email,password}=req.body;
    const user =await User.findOne({email});
    const isValid = await bcrypt.compare(password, user.password);
    // password then hash
    
    if(!user)
    return res.status(403).json({error:{message:'invalid email/password'}});
    
    if(!isValid)
        return res.status(403).json({error:{message:'invalid email/password'}});
    const token = user.generateAuthToken();
    res.status(200).json({token,user});
};

getSignedToken = user => {
    return jwt.sign({
        nom: user.nom,
        prenom:user.prenom,
        email: user.email,
        password: user.password,
        role: user.role,
        cin: user.cin
    }, SECRET_KEY, { expiresIn: '1h' });
};

exports.getOneuser = async function (req, res,next){
    try {
        const user = await User.findById(req.params.id);
        user ? res.status(200).send(user) : res.status(404).send();
    } catch (error) {
        res.status(400).send();
    }
}

exports.getManyuser = async function (req, res,next) {
    try {
        const limit = req.query.limit ? +req.query.limit : undefined;
        const events = await User.find().limit(limit).sort({createdAt: 'desc'});
        res.status(200).send(events);
    } catch (error) {
        res.status(400).send();
    }
}
exports.getalluser = async function (req, res,next) {
    try {
      
        const user =await User.find({role:"user"});
                res.status(200).send(user);
    } catch (error) {
        res.status(400).send();
    }
}

exports.getallensegn = async function (req, res,next) {
    try {
      
        const user =await User.find({role:"enseignant"});
                res.status(200).send(user);
    } catch (error) {
        res.status(400).send();
    }
}
exports.deleteuser = async function (req, res,next) {
    try {
        const deleteuser  = await User.findByIdAndDelete(req.params.id);
        deleteuser  ? res.status(200).send() : res.status(404).send();
    } catch (error) {
        res.status(400).send();
    }
}

exports.updateuser = async function (req, res,next) {
    try {
        req.body.image = req.file.path;
        const updateuser = await User.findByIdAndUpdate(req.params.id, req.body);
        const status = updateuser ? 200 : 404;
        res.status(status).send();
    }catch (e) {
        res.status(400).send();
    }
}

















// ===PASSWORD RECOVER AND RESET

exports.forgotPassword = async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email});
if (!user){
    return ('there is no user with email address.',404);
}
console.log(user);

const resettoken = user.createpasswordresettoken();

await user.save({validateBeforeSave:false})

const resetURL =`http://localhost:3300/api/users/resetPassword/${resettoken}`;

const message=`forgot your password? submit a patch request with your new password and passwordConfirm to :${resetURL}`;

let transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false,
    auth: {
        user: 'hamzaabda09@outlook.com',
        pass: 'Azerty123456+',
    },
    tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
    },
});

try {
    
        let info = await transporter.sendMail({
        from: 'hamzaabda09@outlook.com',
        to: user.email,
        subject: 'your password reset token(valid for 10 min)',
        text: message
    }); 
}catch (e) {
    console.log(e);
}
res.send('sent!');



};



exports.resetPassword = async (req, res, next) => {

    token = req.params.token;

    const user =await User.findOne({passwordresettoken:token,
        passwordresetexpires:{$gt:Date.now()}});
    if(!user){
        return next ('invalid token',400);
    }
    
    let newPass = makeid(8);
      user.password=newPass;
      user.resetPasswordtoken = undefined;
      user.passwordresetexpires = undefined ;
      await user.save();

      let transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com",
        port: 587,
        secure: false,
        auth: {
            user: 'hamzaabda09@outlook.com',
            pass: 'Azerty123456+',
        },
        tls: {
            ciphers: 'SSLv3',
            rejectUnauthorized: false
        },
    });
    
    try {
        
            let info = await transporter.sendMail({
            from: 'hamzaabda09@outlook.com',
            to: user.email,
            subject: 'Password Reset',
            text: `Your new Password: ${newPass}`
        }); 
    }catch (e) {
        console.log(e);
    }
    res.send('An email with your new password have been sent.');

}

function makeid(length) {
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * 
 charactersLength)));
   }
   return result.join('');
}
