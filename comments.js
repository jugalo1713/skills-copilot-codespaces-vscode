//Create a web server


//import modules
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//import models
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");

//import validation
const validatePostInput = require("../../validation/post");

// @route   GET api/posts/test
// @desc    Tests post route
// @access  Public
router.get("/test", (req, res) =>
  res.json({
    msg: "Posts Works"
  })
);

// @route   GET api/posts
// @desc    GET posts
// @access  Public
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 }) //sort by date descending
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ nopostsfound: "No posts found." }));
});

// @route   GET api/posts/:id
// @desc    GET post by id
// @access  Public
router.get("/:id", (req, res) => {
  Post.findById(req.params.id) //req.params.id is the id from the url
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({ nopostfound: "No post found with that id." })
    );
});

// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post(
  "/", //the route
  passport.authenticate("jwt", { session: false }), //the passport middleware
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    //check validation
    if (!isValid) {
      //if any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    //create a new post object
    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      //user: req.user.id //this is the user id from the token
      user: req.user.id
    });

    //save the post
    newPost.save().then(post => res.json(post));
  }
);

// @route   DELETE api/posts/: