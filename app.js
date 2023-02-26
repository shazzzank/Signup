const bodyparser = require('body-parser')
const mongoose = require('mongoose')
const express = require('express')
const ejs = require('ejs')
const bcrypt = require('bcrypt'); 
const saltrounds = 10; 
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
	bcrypt.hash(req.body.password ,saltrounds, (err, hash)=>{
		const doc1 = new Model({
			email: req.body.email,
			password: hash 
		});
		doc1.save((err)=>{
			if(err) console.log(err);
			else res.render('success');
		});		
	})
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
				bcrypt.compare(password, object.password, (err, result)=>{
					if(result == true) res.render('success');
					else res.redirect('/login');
				});
			} else res.redirect('/login')
		}
	});
}

function server(){
	console.log('Server Kickin!')
}

mongoose.connect('mongodb://localhost:27017/userDB');
const schema = new mongoose.Schema({ email: String, password: String })
const Model = new mongoose.model('User', schema);
