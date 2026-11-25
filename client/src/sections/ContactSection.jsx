import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { api } from '../services/api';
import { Mail, Send, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export const ContactSection = () => {
  const { profile } = usePortfolio();
  const contactEmail = profile?.email || 'erneerajmaurya01@gmail.com';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus({ type: 'error', message: 'Please fill in all required fields (Name, Email, Message).' });
      return;
    }

    try {
      setSubmitting(true);
      setStatus({ type: '', message: '' });
      const res = await api.submitContactMessage(formData);
      if (res.success) {
        setStatus({
          type: 'success',
          message: 'Thank you! Your message has been received. I will get back to you shortly.'
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to send message. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-8 sm:py-12">
      <div className="mb-6 sm:mb-8">
        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
          Get In Touch
        </h2>
        <p className="mt-2 text-sm sm:text-lg text-primary font-medium">
          Let's build <span className="text-[#fb8236]">something</span> great.
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Have an analytics challenge, MIS reporting needs, or want to discuss a role? Drop me a line.
        </p>
      </div>

      {/* Direct Contact Box */}
      <div className="mb-6 sm:mb-8">
        <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block mb-2 font-semibold">
          EMAIL ME DIRECTLY
        </span>
        <a
          href={`mailto:${contactEmail}`}
          className="bg-card hover:bg-muted/50 rounded-2xl p-3.5 sm:p-5 flex items-center justify-between group transition-all duration-200 shadow-sm"
        >
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <div className="w-10 h-10 rounded-xl bg-[#fb8236]/10 text-[#fb8236] flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground font-mono">Mailto</div>
              <div className="font-heading font-bold text-xs sm:text-base text-foreground group-hover:text-[#fb8236] transition-colors break-all sm:break-normal">
                {contactEmail}
              </div>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-[#fb8236] group-hover:translate-x-1 transition-all shrink-0" />
        </a>
      </div>

      {/* Interactive Form */}
      <div className="bg-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 sm:p-8 shadow-sm">
        {status.message && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-start gap-3 text-xs sm:text-sm ${
              status.type === 'success'
                ? 'bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-300'
                : 'bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300'
            }`}
          >
            {status.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            )}
            <span>{status.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                FULL NAME *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full bg-background border border-neutral-300 dark:border-neutral-800 focus:border-[#fb8236] focus:ring-1 focus:ring-[#fb8236] rounded-xl px-4 py-3 text-sm text-foreground outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                EMAIL ADDRESS *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@company.com"
                required
                className="w-full bg-background border border-neutral-300 dark:border-neutral-800 focus:border-[#fb8236] focus:ring-1 focus:ring-[#fb8236] rounded-xl px-4 py-3 text-sm text-foreground outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
              SUBJECT
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Inquiry regarding MIS / Data Analytics project"
              className="w-full bg-background border border-neutral-300 dark:border-neutral-800 focus:border-[#fb8236] focus:ring-1 focus:ring-[#fb8236] rounded-xl px-4 py-3 text-sm text-foreground outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
              MESSAGE *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              placeholder="Tell me about your project, dataset, or role requirements..."
              required
              className="w-full bg-background border border-neutral-300 dark:border-neutral-800 focus:border-[#fb8236] focus:ring-1 focus:ring-[#fb8236] rounded-xl px-4 py-3 text-sm text-foreground outline-none transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#fb8236] hover:bg-[#e84e1b] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md shadow-[#fb8236]/20 cursor-pointer active:scale-95"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sending Message...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
};
