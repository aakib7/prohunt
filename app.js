require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var expressLayouts = require("express-ejs-layouts");
var bodyParser = require("body-parser");
const errorMiddleware = require("./middlewares/error");
var cors = require("cors");

// geting the routes api
var indexRouter = require("./routes/index");
var userRouter = require("./routes/api/users");
var gigRouter = require("./routes/api/gigs");
var jobRouter = require("./routes/api/jobs");
var blogRouter = require("./routes/api/blogs");
var bidRouter = require("./routes/api/bids");
var categoryRouter = require("./routes/api/category");
var orderRouter = require("./routes/api/order");
var conversationRouter = require("./routes/api/conversation");
var messageRouter = require("./routes/api/message");
var reportRouter = require("./routes/api/report");
var portfolioRouter = require("./routes/api/portfolio");
var admin = require("./routes/api/admin");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(cors());
const corsConfig = {
  credentials: true,
  origin: true,
  methods: ["GET", "POST", "DELETE", "PUT"],
};
app.use(cors(corsConfig));

// public folder access without /public/...
// app.use(express.static(path.join(__dirname, "public")));
// public folder access with /public/...
app.use("/public", express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());
// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));

// user the routes (define paths) api
app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/gigs", gigRouter);
app.use("/jobs", jobRouter);
app.use("/blog", blogRouter);
app.use("/bid", bidRouter);
app.use("/category", categoryRouter);
app.use("/order", orderRouter);
app.use("/conversation", conversationRouter);
app.use("/message", messageRouter);
app.use("/report", reportRouter);
app.use("/portfolio", portfolioRouter);
app.use("/admin", admin);

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
