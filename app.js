require('dotenv').config(); //Level 2 Security
const encrypt = require('mongoose-encryption')  //Level 1 Security
const bodyparser = require('body-parser')
const mongoose = require('mongoose')
const express = require('express')
const ejs = require('ejs')
const app = express();

app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static('public'))
app.set('view engine', 'ejs')

app.get('/', getHome)
app.post('/', postHome)
app.get('/login', getLogin)
app.post('/login', postLogin)
app.listen(3000, server)

function getHome(req, res){
	res.render('home');
}

function postHome(req, res){
	const doc1 = new Model({
		email: req.body.email,
		password: req.body.password
	});
	doc1.save((err)=>{
		if(err) console.log(err);
		else res.render('success');
	});
}

function getLogin(req, res){
	res.render('login');
}

function postLogin(req, res){
	const email= req.body.email;
	const password= req.body.password;
	Model.findOne({email: email}, (err, object)=>{
		if(err){ console.log(err); }
		else {
			if(object){
				if(object.password == password){
					res.render('success');
				} else res.redirect('/login')
			} else res.redirect('/login')
		}
	});
}

function server(){
	console.log('Server Kickin!')
}

mongoose.connect('mongodb://localhost:27017/userDB');
const schema = new mongoose.Schema({ email: String, password: String })
//const password = "1234567890"; //Level 1 Security
const password = process.env.DB_PASS; //Level 2 Security
schema.plugin(encrypt, {secret: password, encryptedFields: ['password']}); //Level 1 Security
const Model = new mongoose.model('User', schema);
