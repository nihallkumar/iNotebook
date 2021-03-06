const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');

// ROUTE 1: Get all notes using  : get "api/auth/fetchallnotes". Login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {

  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

// ROUTE 2: Add a new note using  : post "api/auth/addnote". Login required
router.post("/addnote", fetchuser, [
  body('title', 'Enter a valid title').isLength({ min: 3 }),
  body('description', 'Description must be atleast 5 character').isLength({ min: 5 }),
], async (req, res) => {

  // if there are errors, return Bad request and errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description, tag } = req.body;
    const note = new Note({
      title, description, tag, user: req.user.id
    })

    const savedNote = await note.save()

    res.json(savedNote);

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }

});

// ROUTE 3: Update an existing note using  : put "api/notes/updatenote". Login required
router.put("/updatenote/:id", fetchuser, [
  body('title', 'Enter a valid title').isLength({ min: 3 }),
  body('description', 'Description must be atleast 5 character').isLength({ min: 5 }),
], async (req, res) => {

  // if there are errors, return Bad request and errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // crete a new note object
    const { title, description, tag } = req.body;
    const newNote = {};
    if (title) { newNote.title = title };
    if (description) { newNote.description = description };
    if (body) { newNote.tag = tag };
  
    // find the note to be updated and update it 
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }
  
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed id not matched");
    }
  
    note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
    res.json({ note });
    
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

// ROUTE 4: Delete an existing note using  : delete "api/notes/deletenote". Login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {


  try {
    // find the note to be deleted and delete it 
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }
    // Allow deletion only if user owns this note 
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed id not matched");
    }

    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ "Success": "Note has been deleted", note: note });

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }

});

module.exports = router;