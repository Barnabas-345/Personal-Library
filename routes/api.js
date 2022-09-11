/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
var expect = require("chai").expect;
let mongodb = require("mongodb");
let mongoose = require("mongoose");

module.exports = function (app) {

let uri = "mongodb+srv://eygis:" + process.env.PW + "@cluster0.hfzju.mongodb.net/personal_library?retryWrites=true&w=majority";


mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let bookSchema = new mongoose.Schema({
  title: {type: String, required: true},
  comments: [String]
})

let Book = mongoose.model("Book", bookSchema)

  app.route('/api/books')
    .get(function (req, res){
      let bookArray = [];
      Book.find(
        {},
        (err, results) => {
          if (!err && results) {
            results.forEach((result) => {
              let book = result.toJSON()
              book.commentcount = book.comments.length
              bookArray.push(book)
            })
            return res.json(bookArray)
          }
        }
      )
    })
    
    .post(function (req, res){
      let title = req.body.title;
      if (!title) {
        return res.json("missing required field title")
      }
      let newBook = new Book({
        title: title,
        comments: []
      })
      newBook.save((err, savedBook) => {
        if (!err && savedBook) {
          res.json(savedBook)
        }
      }) 
    })
    
    .delete(function(req, res){
      Book.deleteMany(
        {},
        (err, deletedLibrary) => {
          if (!err && deletedLibrary) {
            return res.json("complete delete successful")
          }
        }
      )
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      Book.findById(
        bookid,
        (err, result) => {
          if (!result) {
            return res.json("no book exists")
          }
          if (!err && result) {
            return res.json(result)
          }
        }
      )
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (!comment) {
            return res.json("missing required field comment")
          }
      Book.findByIdAndUpdate(
        bookid,
        {$push: {comments: comment}},
        {new: true},
        (err, updatedResult) => {
          if (!updatedResult) {
            return res.json("no book exists")
          }
          if (!err && updatedResult) {
            return res.json(updatedResult)
          }
        }
        
      )
    })
    
    .delete(function(req, res) {
      let bookid = req.params.id;
      Book.findByIdAndRemove(bookid, (err, deleted) => {
          if (err || !deleted) {
            //console.log(err)
           return res.json("no book exists")
          } else {
           return res.json("delete successful")
          }
        }  
      )
    });
  
};
