const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendWaitlistNotification = async (userEmail, userName, courtName, date, startTime) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Booking Slot Available - Badminton Court',
      html: `
        <h2>Good News! A Slot is Now Available</h2>
        <p>Hi ${userName},</p>
        <p>A booking slot you were waiting for is now available:</p>
        <ul>
          <li><strong>Court:</strong> ${courtName}</li>
          <li><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</li>
          <li><strong>Time:</strong> ${startTime}</li>
        </ul>
        <p>Please book soon as slots are first-come, first-served!</p>
        <p>Best regards,<br>Badminton Booking Team</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Waitlist notification sent to:', userEmail);
  } catch (error) {
    console.error('Email sending error:', error);
  }
};

module.exports = { sendWaitlistNotification };
