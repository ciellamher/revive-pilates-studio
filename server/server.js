import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: '100kb' }));

// Auth Secrets
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key';

// Mock DB for user accounts (for demo purposes)
let users = [
  { name: 'Graciella Jimenez', email: 'graciellamher@gmail.com', pkg: '10-Class Reformer', credits: 4 },
  { name: 'John Doe', email: 'john@example.com', pkg: '5-Class Mat', credits: 1 },
  { name: 'Jane Smith', email: 'jane@example.com', pkg: 'Drop-in', credits: 0 },
  { name: 'Chelsea Ann', email: 'chelsea@example.com', pkg: '10-Class Reformer', credits: 8 },
  { name: 'Bea Carlos', email: 'bea@example.com', pkg: '5-Class Mat', credits: 5 },
];

app.get('/api/users', (req, res) => {
  res.json({ users });
});

// Mock DB for classes (shared state for demo purposes)
let classes = [];

app.get('/api/classes', (req, res) => {
  res.json({ classes });
});

app.post('/api/classes', (req, res) => {
  const newClass = { id: Date.now().toString(), ...req.body };
  classes.push(newClass);
  res.status(201).json(newClass);
});

app.patch('/api/classes/:id', (req, res) => {
  const { id } = req.params;
  const index = classes.findIndex(c => c.id === id);
  if (index !== -1) {
    classes[index] = { ...classes[index], ...req.body };
    res.json(classes[index]);
  } else {
    res.status(404).json({ error: 'Class not found' });
  }
});

// Mock DB for bookings
let bookings = [];

app.get('/api/bookings', (req, res) => {
  res.json({ bookings });
});

app.post('/api/bookings', (req, res) => {
  const newBooking = { id: `BK-${Math.floor(Math.random() * 9000) + 1000}`, status: 'pending', ...req.body };
  bookings.push(newBooking);
  res.status(201).json(newBooking);
});

app.patch('/api/bookings/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const booking = bookings.find(b => b.id === id);
  if (booking) {
    booking.status = status;
    res.json(booking);
  } else {
    res.status(404).json({ error: 'Booking not found' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  // Generate a JWT token valid for 15 minutes
  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '15m' });
  const magicLink = `http://localhost:5173/verify?token=${token}`;

  try {
    // We use ethereal email for local development testing
    let testAccount = await nodemailer.createTestAccount();
    
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, 
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    let info = await transporter.sendMail({
      from: '"Revive Pilates Studio" <noreply@revivestudio.com>',
      to: email,
      subject: "Your Login Link",
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Sign in to Revive Pilates</h2>
          <p>Click the link below to securely sign in to your account. This link expires in 15 minutes.</p>
          <a href="${magicLink}" style="display: inline-block; padding: 12px 24px; background: #4A1D1D; color: white; text-decoration: none; border-radius: 20px; margin-top: 10px;">Sign In</a>
        </div>
      `,
    });

    console.log("Email sent! Preview URL: %s", nodemailer.getTestMessageUrl(info));
    
    // We also return the preview URL in development so the frontend can display it if we want
    res.json({ message: 'A login link has been sent to your email!', previewUrl: nodemailer.getTestMessageUrl(info) });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send link' });
  }
});

// Endpoint to verify the token and return the user profile
app.get('/api/auth/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid or expired link' });
    
    res.json({
      user: {
        email: decoded.email,
        isAdmin: decoded.email.toLowerCase() === 'gdjimenez@student.hau.edu.ph'
      }
    });
  });
});

app.use((request, response) => {
  response.status(404).json({ error: 'No such route' })
})

app.use((error, request, response, next) => {
  console.error(error)
  response.status(500).json({ error: 'Something went wrong on the server' })
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`)
});
