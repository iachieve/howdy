const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser')
const fs = require('fs');
const cors = require('cors');
const postRoutes = require('./routes/post');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, autoIndex: false, })
  .then(() => console.log("Connected to mongoDB/nodeapi"))
  .catch(err => console.log(err));

const myOwnMiddleware = (req, res, next) => {
  console.log('middleware applied!!');
  next();
};

// apiDocs
app.get('/', (req, res)=>{
  fs.readFile('docs/apiDocs.json', (err, data)=>{
    if(err){res.status(400).json({error: err})}
    const docs = JSON.parse(data);
    res.json(docs);
  })
})

// apply middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
// app.use(myOwnMiddleware);
app.use(cookieParser())
app.use(expressValidator());
app.use(cors());
app.use(express.json({
  type: ['application/json', 'text/plain']
}))

// routes

app.use('/', postRoutes);
app.use('/', authRoutes);
app.use('/', userRoutes);

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send({error: "Unauthorized"});
  }
});

const port = process.env.PORT || 8080;
app.listen(port, ()=> {console.log(`A NODE JS API LISTENING ON PORT ${port}`)});
