var express = require("express");
var app = express();
var expressHbs = require('express-handlebars');
var bodyParser = require('body-parser');

app.set('view engine', 'hbs');
app.engine('hbs', expressHbs({
    extname: 'hbs'
}));

app.use(bodyParser.urlencoded({
    extended: true
}));

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/app'); // connection code
var Todo = mongoose.model('Todo', {
 task: {
 type: String,
 required: true
 }
});

app.use(express.static('public'));

var data = [];
var counter = 0;

app.get("/", function(req, res) {
 Todo.find(function(err, arrayOfItems) {
 res.render("index", {
 item: arrayOfItems
 });
 });
});

app.post("/client_to_server", function(req, res) {
 Todo.create({
 task: req.body.userData
 });
 res.redirect("/");
});

app.get('/delete/:id', function(req, res) {
 Todo.findById(req.params.id, function(err, todo) {
 if (!err) { //___Example of error checking
 todo.remove();
 } else { //____If item is not found then do something
 return err
 }
 });
 res.redirect('/');
});

app.get("/edit/:id", function(req, res) {
 Todo.findById(req.params.id, function(err, item) {
 res.render("edit", {
 todo: item
 });
 });
});

app.post('/update/:id', function(req, res) {
Todo.findById(req.params.id, function(err, todo) {
 todo.task = req.body.updated_task;
 todo.save();
});
 res.redirect('/');
});
app.get('/static', function(req, res) {
    res.sendFile('static_example.html', {
        root: "public"
    });
});

app.get("*", function(req, res) {
    res.redirect("/")
});

app.listen(3000);
console.log("server is running");