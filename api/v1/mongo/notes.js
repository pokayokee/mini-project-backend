import express from 'express';
import { addNote, createNote, getAllNotes, getNoteByUser, searchNotes } from './controllers/notesController.js';
import { authUser } from '../../../middleware/auth.js'; 

const router = express.Router()

// Read all notes
router.get("/notes", getAllNotes);

// Create a note
router.post("/notes", createNote);

// Add note
router.post("/add-note", authUser, addNote);

// Edit note
router.put("/edit-note/:noteId", async (req, res) => {

})

// Update isPinned
router.put("/update-note-pinned/:noteId", async (req, res) => {

})

// Get notes by user
router.get("/get-all-notes", authUser, getNoteByUser);

// Delete note
router.delete("/delete-note/:noteId", async (req, res) => {
  
})

// Search notes
router.get("/search-notes", authUser, searchNotes);

export default router;