const models = require('../models');
const { logActivity } = require('../middleware/auth');

const getAllMessages = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};
    if (status === 'unread') query.isRead = false;
    if (status === 'read') query.isRead = true;

    let messages = await models.Message.find(query, { createdAt: -1 });

    if (search) {
      const s = search.toLowerCase();
      messages = messages.filter(m =>
        m.name.toLowerCase().includes(s) ||
        m.email.toLowerCase().includes(s) ||
        m.message.toLowerCase().includes(s) ||
        (m.subject && m.subject.toLowerCase().includes(s))
      );
    }

    const unreadCount = await models.Message.countDocuments({ isRead: false });

    return res.json({
      success: true,
      count: messages.length,
      unreadCount,
      data: messages
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { isRead } = req.body;
    const updated = await models.Message.findByIdAndUpdate(id, {
      isRead: isRead !== undefined ? Boolean(isRead) : true
    });
    if (!updated) return res.status(404).json({ success: false, message: 'Message not found.' });

    return res.json({ success: true, message: 'Message status updated.', data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await models.Message.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Message not found.' });

    await logActivity(req.admin, 'DELETE', 'Messages', `Deleted contact message from ${deleted.name}`, req);
    return res.json({ success: true, message: 'Message deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const replyMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { replyNotes } = req.body;
    const updated = await models.Message.findByIdAndUpdate(id, {
      replyNotes,
      isRead: true
    });
    if (!updated) return res.status(404).json({ success: false, message: 'Message not found.' });

    await logActivity(req.admin, 'UPDATE', 'Messages', `Recorded reply to ${updated.name}`, req);
    return res.json({ success: true, message: 'Reply recorded successfully.', data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllMessages, markAsRead, deleteMessage, replyMessage };
