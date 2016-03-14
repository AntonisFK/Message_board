module.exports = function Route (app, Message, Comment){

  app.get('/', function(req, res){
    res.render('index')
  })

}