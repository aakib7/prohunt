var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var expressLayouts = require("express-ejs-layouts");
var bodyParser = require("body-parser");
const errorMiddleware = require("./middlewares/error");

// geting the routes api
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/api/users");
var gigsRouter = require("./routes/api/gigs");
var jobRouter = require("./routes/api/jobs");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());
// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));

// user the routes (define paths) api
app.use("/", indexRouter);
app.use("/user", usersRouter);
app.use("/gigs", gigsRouter);
app.use("/jobs", jobRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error Handler middleware
app.use(errorMiddleware);

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
