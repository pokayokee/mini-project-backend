import express from "express";
import {
  addNote,
  createNote,
  deleteNote,
  editNote,
  getAllNotes,
  getNotesUser,
  searchNotes,
  togglePin,
} from "./controllers/notesController.js";
import { authUser } from "../../../middleware/auth.js";
import { Note } from "../../../models/Note.js";

const router = express.Router();

// Read all notes
router.get("/notes", getAllNotes);

// Create a note
router.post("/notes", createNote);

// Add note
router.post("/add-note", authUser, addNote);

// Edit note
router.put("/edit-note/:noteId", authUser, editNote);

// Update isPinned
router.put("/update-note-pinned/:noteId", authUser, togglePin);

// Get all notes by user
router.get("/get-all-notes", authUser, getNotesUser);

// Delete note
router.delete("/delete-note/:noteId", authUser, deleteNote);

// Search notes
router.get("/search-notes", authUser, searchNotes);

export default router;
