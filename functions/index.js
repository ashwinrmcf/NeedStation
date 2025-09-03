const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

// Configure your email transporter
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: functions.config().email.user, // Your Gmail address
    pass: functions.config().email.password // Your Gmail app password
  }
});

exports.sendContactEmail = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const { to, subject, html, replyTo } = req.body;

    if (!to || !subject || !html) {
      res.status(400).send('Missing required fields: to, subject, html');
      return;
    }

    const mailOptions = {
      from: functions.config().email.user,
      to: to,
      subject: subject,
      html: html,
      replyTo: replyTo || functions.config().email.user
    };

    await transporter.sendMail(mailOptions);
    
    res.status(200).json({
      success: true,
      message: 'Email sent successfully'
    });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: error.message
    });
  }
});
