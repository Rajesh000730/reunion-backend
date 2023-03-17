var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const {expressjwt : jwt} = require('express-jwt');
const user = require('./models/users.model');
require('dotenv').config();

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//mongoose connection
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI).then(() => {console.log("connected")}).catch((err) => { console.log(err); }); 

// delete all user

const deleteUser = async ()=>{
  try{
    await user.deleteMany({})
  }
  catch(err){
    console.log(err)
  }
}

const addDummyUser = async ()=>{
      try{
        const dummyUser1 = new user({
          name: process.env.name,
          email: process.env.email,
          password: process.env.password
        })
       await dummyUser1.save()
        
        const dummyUser2 = new user({
          name: "rajesh1",
          email: "rajesh1@gmail.com",
          password: "rajesh1"
        })
        await dummyUser2.save()
        
      }
      catch(err){
        console.log(err)
      }
  }

try{
  deleteUser()
  addDummyUser()
}
catch(err){
  console.log(err)
}



//jwt middleware
app.use('/', indexRouter);
app.use('/api',jwt({  secret: process.env.secret,  algorithms: ['HS256']  }).unless({path: ['/api/authenticate']})
)

//jwt authorization
app.use((req, res, next)=>{
  nonAuthRoutes = ["/api/authenticate"];
  if(nonAuthRoutes.includes(req.path)){
    console.log(req.path)
    next();
  }else{
    console.log(req.auth)
    if(req.auth){
      next();
    }
  }

})







// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });


app.use('/api', usersRouter);

module.exports = app;
