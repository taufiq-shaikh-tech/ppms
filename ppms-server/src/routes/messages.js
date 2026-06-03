// ppms-server/src/routes/messages.js
import express from "express";
import mongoose from "mongoose";
import Message from "../models/Message.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

/**
 * Create and send a message
 * POST /api/messages
 * body: { recipient, text }
 * recipient: user _id
 */
router.post("/", requireAuth(), async (req, res) => {
  try {
    const { recipient, text } = req.body;

    if (!recipient || !text?.trim()) {
      return res
        .status(400)
        .json({ message: "recipient and text are required" });
    }

    const message = await Message.create({
      sender: req.user.sub, // logged-in user (patient ya doctor)
      recipient,
      text: text.trim(),
    });

    const saved = await message.populate("sender recipient", "name role email");

    res.status(201).json(saved);
  } catch (err) {
    console.error("Create message error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * Get conversation between current user and another user
 * GET /api/messages/conversation/:otherUserId
 */
router.get("/conversation/:otherUserId", requireAuth(), async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const userId = req.user.sub;

    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: otherUserId },
        { sender: otherUserId, recipient: userId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender recipient", "name role email");

    res.json(messages);
  } catch (err) {
    console.error("Get conversation error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * Get all threads for current user (contacts + last message)
 * GET /api/messages/threads
 */
router.get("/threads", requireAuth(), async (req, res) => {
  try {
    const userId = req.user.sub.toString();

    // current user ke saare messages (patient ya doctor)
    const messages = await Message.find({
      $or: [{ sender: userId }, { recipient: userId }],
    }).sort({ createdAt: -1 });

    const threadsMap = new Map();

    for (const m of messages) {
      const senderId = m.sender.toString();
      const recipientId = m.recipient.toString();

      const otherId = senderId === userId ? recipientId : senderId;

      if (!threadsMap.has(otherId)) {
        // dusre user ka basic info lao (name, role, email)
        const userDoc = await mongoose
          .model("User")
          .findById(otherId, "name role email")
          .lean();

        if (!userDoc) continue;

        threadsMap.set(otherId, {
          userId: otherId,
          name: userDoc.name,
          role: userDoc.role,
          email: userDoc.email,
          lastMessage: m.text,
          lastMessageAt: m.createdAt,
          unreadCount: 0,
        });
      }

      // unread counter (jo messages current user ko aaye aur abhi read false hain)
      if (recipientId === userId && !m.read) {
        const thread = threadsMap.get(otherId);
        if (thread) {
          thread.unreadCount += 1;
        }
      }
    }

    const threads = Array.from(threadsMap.values()).sort(
      (a, b) => b.lastMessageAt - a.lastMessageAt
    );

    res.json(threads);
  } catch (err) {
    console.error("Get threads error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * Mark all messages from a user as read
 * POST /api/messages/read/:otherUserId
 */
router.post("/read/:otherUserId", requireAuth(), async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const userId = req.user.sub;

    const result = await Message.updateMany(
      {
        sender: otherUserId,
        recipient: userId,
        read: false,
      },
      {
        $set: { read: true },
      }
    );

    res.json({ markedRead: result.modifiedCount });
  } catch (err) {
    console.error("Mark read error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;