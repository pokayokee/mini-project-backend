import { Note } from "../../../../models/Note.js";

export const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find().sort({createdOn: -1, isPinned: -1});
    res.json(notes);
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Fail to fetch all notes",
      details: err.message,
    })
  }
};

export const createNote = async (req, res) => {
  const { title, content, tags = [], isPinned = false, userId } = req.body;
    try {
      const note = Note.create({
        title,
        content,
        tags,
        isPinned,
        userId
      });
      res.status(201).json(note)
    } catch (err) {
      res.status(500).json({
        error: true,
        message: "Fail to create note",
        details: err.message,
    });
  }
};

export const addNote = async (req, res) => {
  const { title, content, tags = [], isPinned = false } = req.body;

  const { user } = req.user;

  if (!title || !content) {
    res.status(400).json({
      error: true,
      message: "All fields required!",
    });
  }

  if (!user || !user._id) {
    res.status(400).json({
      error: true,
      message: "Invalid user credentails",
    });
  }

  try {
    const note = await Note.create({
      title,
      content,
      tags,
      isPinned,
      userId: user._id,
    });
    await note.save();
    res.json({
      error: false,
      note,
      message: "Note added successfully!",
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
};

export const getNoteByUser = async (req, res) => {
  const { user } = req.user;

  try {
    const notes = await Note.find({userId: user._id}).sort({isPinned: -1});
    res.json({
      error: false,
      notes,
      message: "All notes retreived",
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
};

export const searchNotes = async (req, res) => {
  const { user } = req.user
  const { query } = req.query

  if (!query) {
    res.status(400).json({
      error: true,
      message: "Search query is required!"
    });
  }

  try {
    const matchingNotes = await Note.find({
      userId: user.id,
      $or: [
        {title: {$regex: new RegExp(query, "i")}},
        {content: {$regex: new RegExp(query, "i")}},
      ],
    });
    res.json({
      error: false,
      matchingNotes,
      message: "Notes matching the search query retrieved success!",
    })
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
}

