var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose')

var app = express();

mongoose.connect('mongodb://localhost/MessageBoard');
mongoose.connection.on('error', function(err){}); 

var Schema = mongoose.Schema;

var  MessageSchema = new mongoose.Schema({
  name: String,
  text: String,
  //has many comments
  comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
});

var CommentSchema = new mongoose.Schema({
  //Comments bellong to Message 
  _message: {type: Schema.Types.ObjectId, ref: 'Message'},
  name: String, 
  text: String, 
  created_at: {type: Date, default: new Date}
});

var Message = mongoose.model('Message', MessageSchema)
var Comment = mongoose.model('Comment', CommentSchema)

app.use(bodyParser.urlencoded({extended:true}));
// setting up ejs and our views folder
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

//we're going to have /routes/index.js handle all of our routing

// setting server to run on port 3000
app.listen(3000, function() {
 console.log("listening on port 3000! for Messageboard ");
})

app.get('/', function(req, res){
    Message.find({}) 
    .populate('comments')
    .exec(function(err, message){
      console.log(message);
      //res.end();
      res.render('index', {messages: message})
    })   
  })

app.post('/post', function(req, res){
  var message = new Message({text: req.body.message.trim(), name: req.body.name})

  message.save(function(err){
    if(err){
      console.log("Something went wrong")

    }
    else{
      res.redirect('/')
    }
  })
})

app.post('/comment', function(req, res){
  Message.findOne({_id: req.body.post_id}, function(err, message){
    var comment = new Comment({text: req.body.comment, name: req.body.name});
    
    comment._message = message._id;
    message.comments.push(comment);
    comment.save(function(err){
    
      message.save(function(err){
        if(err){
          console.log("error in the comment save")
        }
        else{
          res.redirect('/')
        }
      });
    });
  });
});


