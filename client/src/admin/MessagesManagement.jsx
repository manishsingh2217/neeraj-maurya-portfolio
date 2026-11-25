import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { api } from '../services/api';
import {
  Mail,
  MailOpen,
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Reply,
  Calendar,
  X
} from 'lucide-react';

export const MessagesManagement = () => {
  const { refreshUnread } = useOutletContext() || {};
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [toast, setToast] = useState({ type: '', message: '' });

  // Detail Modal
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [savingReply, setSavingReply] = useState(false);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      let query = '';
      if (statusFilter !== 'all') query = `?status=${statusFilter}`;
      const res = await api.getMessages(query);
      if (res.success) {
        setMessages(res.data || []);
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to load messages.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [statusFilter]);

  const handleOpenDetail = async (msg) => {
    setSelectedMessage(msg);
    setReplyText(msg.replyNotes || '');
    if (!msg.isRead) {
      try {
        await api.markMessageRead(msg._id || msg.id, true);
        msg.isRead = true;
        fetchMessages();
        if (refreshUnread) refreshUnread();
      } catch (e) {}
    }
  };

  const handleToggleRead = async (id, currentRead) => {
    try {
      await api.markMessageRead(id, !currentRead);
      fetchMessages();
      if (refreshUnread) refreshUnread();
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete message from "${name}"?`)) return;
    try {
      await api.deleteMessage(id);
      setToast({ type: 'success', message: 'Message deleted.' });
      if (selectedMessage && (selectedMessage._id === id || selectedMessage.id === id)) {
        setSelectedMessage(null);
      }
      fetchMessages();
      if (refreshUnread) refreshUnread();
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    }
  };

  const handleSaveReply = async (e) => {
    e.preventDefault();
    if (!selectedMessage) return;
    try {
      setSavingReply(true);
      await api.replyMessage(selectedMessage._id || selectedMessage.id, replyText);
      setToast({ type: 'success', message: 'Reply note recorded.' });
      fetchMessages();
      setSelectedMessage((prev) => ({ ...prev, replyNotes: replyText, isRead: true }));
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setSavingReply(false);
    }
  };

  const filteredMessages = messages.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.message.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Contact Messages Management
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Review submissions from the public website contact form, reply, or archive.
          </p>
        </div>
      </div>

      {toast.message && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-xs sm:text-sm ${
            toast.type === 'success'
              ? 'bg-green-950/40 border border-green-500/30 text-green-300'
              : 'bg-red-950/40 border border-red-500/30 text-red-300'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-[#242424] border border-[#383838]/60 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search by sender name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl pl-9 pr-4 py-2 text-xs text-foreground outline-none"
          />
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2">
          {['all', 'unread', 'read'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
                statusFilter === status
                  ? 'bg-[#fb8236] text-black font-bold'
                  : 'bg-[#1a1a1a] text-muted-foreground hover:text-foreground border border-[#383838]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-[#242424] border border-[#383838]/60 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#fb8236] animate-spin" />
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="p-12 text-center text-xs text-muted-foreground">
            No contact messages found for the selected filter.
          </div>
        ) : (
          <div className="divide-y divide-[#383838]/40">
            {filteredMessages.map((msg) => (
              <div
                key={msg._id || msg.id}
                className={`p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors hover:bg-[#282828] cursor-pointer ${
                  !msg.isRead ? 'bg-[#2a2a2a]/40 border-l-4 border-l-[#fb8236]' : ''
                }`}
                onClick={() => handleOpenDetail(msg)}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      !msg.isRead
                        ? 'bg-[#fb8236]/20 text-[#fb8236] border border-[#fb8236]/40'
                        : 'bg-[#1c1c1c] text-muted-foreground border border-[#383838]'
                    }`}
                  >
                    {!msg.isRead ? <Mail className="w-5 h-5" /> : <MailOpen className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-sm text-foreground">
                        {msg.name}
                      </span>
                      {!msg.isRead && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-[#fb8236] text-black">
                          NEW
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground font-mono">
                        ({msg.email})
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-[#f8af26] mt-0.5">
                      {msg.subject || 'Portfolio Inquiry'}
                    </div>

                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1 max-w-xl">
                      {msg.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center shrink-0 text-xs">
                  <span className="text-[11px] font-mono text-muted-foreground">
                    {new Date(msg.createdAt || Date.now()).toLocaleDateString()}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleRead(msg._id || msg.id, msg.isRead);
                    }}
                    className="p-1.5 rounded-lg bg-[#1a1a1a] hover:bg-[#333] border border-[#383838] text-muted-foreground hover:text-foreground"
                    title={msg.isRead ? 'Mark as Unread' : 'Mark as Read'}
                  >
                    {msg.isRead ? <Mail className="w-3.5 h-3.5" /> : <MailOpen className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(msg._id || msg.id, msg.name);
                    }}
                    className="p-1.5 rounded-lg bg-[#1a1a1a] hover:bg-red-950/50 border border-[#383838] text-muted-foreground hover:text-red-400"
                    title="Delete Message"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[#242424] border border-[#383838] rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-[#383838] mb-6">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#fb8236] font-bold">
                  SENDER DETAILS
                </span>
                <h3 className="font-heading font-bold text-xl text-foreground mt-0.5">
                  {selectedMessage.name}
                </h3>
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || 'Portfolio Inquiry')}`}
                  className="text-xs text-[#f8af26] hover:underline font-mono"
                >
                  {selectedMessage.email}
                </a>
              </div>

              <button
                onClick={() => setSelectedMessage(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-mono uppercase text-muted-foreground font-semibold">
                  SUBJECT
                </span>
                <p className="text-sm font-semibold text-foreground mt-0.5">
                  {selectedMessage.subject || 'Portfolio Inquiry'}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-mono uppercase text-muted-foreground font-semibold">
                  MESSAGE BODY
                </span>
                <div className="bg-[#171717] border border-[#383838] rounded-2xl p-4 text-xs sm:text-sm text-foreground leading-relaxed mt-1.5 whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>

              <div className="text-[11px] font-mono text-muted-foreground">
                Received: {new Date(selectedMessage.createdAt || Date.now()).toLocaleString()}
              </div>

              {/* Reply Section */}
              <div className="pt-4 border-t border-[#383838]">
                <form onSubmit={handleSaveReply} className="space-y-3">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                    INTERNAL REPLY NOTES / STATUS
                  </label>
                  <textarea
                    rows="3"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="e.g. Replied via email on Nov 22; scheduled phone interview for Wednesday..."
                    className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2 text-xs text-foreground outline-none"
                  />
                  <div className="flex items-center justify-between">
                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || 'Portfolio Inquiry')}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#fb8236] hover:bg-[#e84e1b] text-black font-bold text-xs"
                    >
                      <Reply className="w-3.5 h-3.5" />
                      <span>Reply via Email Client</span>
                    </a>
                    <button
                      type="submit"
                      disabled={savingReply}
                      className="px-4 py-2 rounded-xl bg-[#1c1c1c] hover:bg-[#2e2e2e] border border-[#383838] text-foreground text-xs font-semibold"
                    >
                      {savingReply ? 'Saving Note...' : 'Save Note'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
