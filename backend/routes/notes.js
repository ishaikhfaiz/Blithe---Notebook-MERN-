const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');

// ROUTE 1:  Get all Notes using Get "api/notes/fetchallnotes". login req
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Some Error Occurred");
    }
})

// ROUTE 2:  Add Notes using POST "api/notes/addnote". login req
router.post('/addnote', fetchuser, [
    body('title', 'Enter a Valid Title').isLength({ min: 3 }),
    body('description', 'Enter a Description').isLength({ min: 5 })], async (req, res) => {
        try {
            const { title, description, tag } = req.body;

            // If Errors Return Bad Request
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const note = new Note({
                title, description, tag, user: req.user.id
            })

            const savedNote = await note.save()
            res.json(savedNote);

        } catch (error) {
            console.log(error.message);
            res.status(500).send("Some Error Occurred");
        }

    })

// ROUTE 3:  Update Notes using POST "api/notes/updatenote/id". login req

router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;

    // Create NewNote object to update the existing notes
    const newNote = {};
    try {
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        // Find the Note to be updated
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        // User can edit only own notes
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        // Finally Update
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note })

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Some Error Occurred");
    }
})

// ROUTE 4:  Delete Notes using Delete "api/notes/deletenote/id". login req

router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // Find the Note to be deleted
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        // User can delete only own notes
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        // Finally Update
        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has been Deleted", note: note })
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Some Error Occurred");
    }
})











module.exports = router