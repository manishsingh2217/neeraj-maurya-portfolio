const models = require('../models');
const nodemailer = require('nodemailer');

// Configure mail transporter if credentials exist
const createTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = process.env.SMTP_PORT || 587;
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  if (user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port == 465,
      auth: { user, pass }
    });
  }
  return null;
};

const getPortfolioData = async (req, res) => {
  try {
    // Record visitor analytics asynchronously
    try {
      const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1').replace('::ffff:', '');
      const userAgent = req.headers['user-agent'] || 'Unknown';
      const referer = req.headers['referer'] || '';
      const today = new Date().toISOString().split('T')[0];

      // Async write without blocking response
      models.VisitorAnalytics.create({
        ip,
        userAgent,
        page: req.query.page || '/',
        referer,
        dateString: today,
        timestamp: new Date()
      }).catch(err => console.error('Analytics tracking error:', err.message));
    } catch (e) {
      // Ignore analytics failures
    }

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Fetch all public sections
    const [
      profile,
      about,
      skills,
      experiences,
      projects,
      education,
      certifications,
      resources,
      socialLinks,
      settings,
      appearance,
      seoSettings
    ] = await Promise.all([
      models.Profile.findOne(),
      models.About.findOne(),
      models.Skill.find({ isEnabled: true }, { order: 1 }),
      models.Experience.find({}, { order: 1 }),
      models.Project.find({ isPublished: true }, { order: 1 }),
      models.Education.find({}, { order: 1 }),
      models.Certification.find({ isEnabled: true }, { order: 1 }),
      models.Resource.find({ isEnabled: true }, { order: 1 }),
      models.SocialLink.find({ isEnabled: true }, { order: 1 }),
      models.WebsiteSettings.findOne(),
      models.Appearance.findOne(),
      models.SeoSettings.findOne()
    ]);

    return res.json({
      success: true,
      data: {
        profile: profile || {},
        about: about || {},
        skills: skills || [],
        experiences: experiences || [],
        projects: projects || [],
        education: education || [],
        certifications: certifications || [],
        resources: resources || [],
        socialLinks: socialLinks || [],
        settings: settings || {},
        appearance: appearance || {},
        seoSettings: seoSettings || {}
      }
    });
  } catch (error) {
    console.error('Error fetching public portfolio:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve portfolio data.' });
  }
};

const submitContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required fields.'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1').replace('::ffff:', '');

    const newMessage = await models.Message.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject ? subject.trim() : 'Portfolio Contact Submission',
      message: message.trim(),
      isRead: false,
      senderIp: ip,
      createdAt: new Date()
    });

    // Send email notification to Neeraj Maurya asynchronously
    const targetEmail = process.env.CONTACT_NOTIFICATION_EMAIL || 'erneerajmaurya01@gmail.com';
    const transporter = createTransporter();

    if (transporter) {
      transporter.sendMail({
        from: `"Portfolio Contact Form" <${process.env.SMTP_USER || process.env.EMAIL_USER || email}>`,
        to: targetEmail,
        replyTo: email,
        subject: `New Portfolio Message: ${subject || 'Inquiry'} from ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px;">
            <h2 style="color: #fb8236; margin-top: 0;">New Contact Form Submission</h2>
            <p>You have received a new inquiry on your portfolio website:</p>
            <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
              <tr><td style="padding: 8px; font-weight: bold; width: 120px; border-bottom: 1px solid #eee;">Sender Name:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${name}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Sender Email:</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td></tr>
              <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Subject:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${subject || 'General Inquiry'}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Received At:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${new Date().toLocaleString()}</td></tr>
            </table>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 6px; border-left: 4px solid #fb8236; margin-top: 15px;">
              <strong style="display: block; margin-bottom: 6px;">Message:</strong>
              <div style="white-space: pre-wrap;">${message}</div>
            </div>
            <p style="font-size: 12px; color: #777; margin-top: 25px;">You can reply directly to this email to reach the sender at ${email}.</p>
          </div>
        `
      }).then(info => {
        console.log(`[Email Notification]: Successfully sent to ${targetEmail} (MessageId: ${info.messageId})`);
      }).catch(err => {
        console.warn(`[Email Notification Warning]: Could not send email via SMTP (${err.message}). Message is safely recorded in MongoDB database.`);
      });
    } else {
      console.log(`[Email Notification (Dev Mode)]: Notification prepared for ${targetEmail}:`);
      console.log(` - From: ${name} <${email}>`);
      console.log(` - Subject: ${subject}`);
      console.log(` - Note: To deliver live emails directly to your Gmail inbox, configure SMTP_USER and SMTP_PASS in server/.env`);
    }

    return res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Your message has been received.',
      data: {
        id: newMessage._id || newMessage.id,
        createdAt: newMessage.createdAt
      }
    });
  } catch (error) {
    console.error('Submit message error:', error);
    return res.status(500).json({ success: false, message: 'Server error while sending message.' });
  }
};

module.exports = { getPortfolioData, submitContactMessage };
