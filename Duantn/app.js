var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const mongoose = require('mongoose');

require('./models/m_category');
require('./models/m_blog');
require('./models/m_comment');
require('./models/m_order');
require('./models/m_order_detail');
require('./models/m_payment');
require('./models/m_product');
require('./models/m_product_variant');
require('./models/m_user');
require('./models/m_voucher');
require('./models/m_wishlist');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var categoriesRouter = require('./routes/category');
var productsRouter = require('./routes/product');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var cors = require('cors');
var corsOptionsDelegate = function (req, callback) {
var corsOptions= { origin: true };
 callback(null, corsOptions);
}



mongoose.connect('mongodb://localhost:27017/duantotnghiep')
  .then(()=> console.log('connected to mongodb'))
  .catch(err => console.error('fail to connect to mongodb' + err)) ;


app.use(cors(corsOptionsDelegate));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/category', categoriesRouter);
app.use('/product', productsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
