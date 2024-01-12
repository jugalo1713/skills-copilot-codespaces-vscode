// create web server
const express = require('express');
const app = express();
const port = 3000;
// connect to mongoDB
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/27017');
// create mongoose schema
const Comment = mongoose.model('Comment', {