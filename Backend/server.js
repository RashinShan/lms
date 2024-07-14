const express = require('express');
const connectDB = require('./dbconnection');
const axios = require('axios');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const User = require('./models/user');
const Book = require('./models/book');
const BookIssuing = require('./models/issuedbooks');
require('dotenv').config();  // Load environment variables from .env file

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Adjust the origin to match your frontend URL
  credentials: true,
}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false, // Set to false to only save sessions with data
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }), // Adjust the MongoDB URL if needed
  cookie: { secure: false, httpOnly: true, maxAge: 60 * 60 * 1000 } // 1 hour session
}));

// Connect to the database
connectDB();

// Generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP via email using Sendinblue API
function sendOTP(email, otpCode) {
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

  const emailBody = `
    <html>
      <body>
        <p>Dear User,</p>
        <p>Your OTP code for verification is: <strong>${otpCode}</strong></p>
        <p>Please use this code to verify your account.</p>
        <p>Sent from LMS</p>
        <p>Sent on: ${currentDate} at ${currentTime}</p>
      </body>
    </html>
  `;

  return axios.post('https://api.sendinblue.com/v3/smtp/email', {
    sender: { name: 'Loyal Library Management System', email: 'lms@gmail.com' },
    to: [{ email: email }],
    subject: 'OTP Verification',
    htmlContent: emailBody
  }, {
    headers: {
      'Content-Type': 'application/json',
      'api-key': process.env.SENDINBLUE_API_KEY
    }
  });
}

// User registration route
app.post('/register', async (req, res) => {
  const { username, email, password, mobileNumber } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Store user data and OTP in session
  req.session.userData = {
    username,
    email,
    password: hashedPassword,
    mobileNumber
  };

  try {
    const otp = generateOTP();
    req.session.otp = otp;
    console.log("Registration OTP Session ID:", req.session.id);
    console.log("OTP during registration:", req.session.otp);
    await sendOTP(email, otp);

    res.status(201).json({ message: 'User registered successfully. OTP sent to your email.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create the API for login page
app.post('/Login', async (req, res) => {
  
  const { email, password } = req.body;
  req.session.email=email;


  try {
    // Check if the user exists
    const existingEmail = await User.findOne({ email });

    const isPasswordValid = await bcrypt.compare(password, existingEmail.password);

    if (isPasswordValid) {
      res.status(201).json({ message: 'User exists' });
    } else {
      res.status(401).json({ message: 'User email or password wrong' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Book select from user
// Book select route
app.put('/books/:id/select', async (req, res) => {
  const { id } = req.params;
  const userEmail = req.session.email;
  console.log(userEmail);

  try {
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const existingIssuedBook = await BookIssuing.findOne({ issuedUser: userEmail, submittedDate: null });

    if (existingIssuedBook) {
      return res.status(400).json({ message: 'User has already selected a book' });
    }

    if (book.copies > 0) {
      book.copies -= 1;
      if (book.copies === 0) {
        book.status = 'unavailable';
      }
      await book.save();

      // Create a new issued book record
      const newIssuedBook = new BookIssuing({
        bookName: book.title,
        issuedUser: userEmail,
        issuedDate: new Date(),
      });
      await newIssuedBook.save();

      return res.json(book);
    } else {
      return res.status(400).json({ message: 'No copies available' });
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Book unselect route
app.put('/books/:id/unselect', async (req, res) => {
  const { id } = req.params;
  const userEmail = req.session.email;

  try {
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const issuedBook = await BookIssuing.findOne({ bookName: book.title, issuedUser: userEmail, submittedDate: null });

    if (!issuedBook) {
      return res.status(400).json({ message: 'User has not selected this book' });
    }

    book.copies += 1;
    if (book.status === 'unavailable') {
      book.status = 'available';
    }
    await book.save();

    // Update the issued book record
    issuedBook.submittedDate = new Date();
    await issuedBook.save();

    return res.json(book);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Verify OTP route for registration
app.post('/verify-otpRegistration', async (req, res) => {
  const { otp } = req.body;
  

  if (req.session.otp === otp) {
    try {
      // Create and save the user only after OTP verification
      const user = new User(req.session.userData);
      await user.save();

      // Clear the session data
      req.session.userData = null;
      req.session.otp = null;

      res.status(200).json({ message: 'OTP verified and user registered successfully.' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.status(400).json({ message: 'Invalid OTP.' });
  }
});


//update pwd

app.put('/update-password', async (req, res) => {
  const { newPassword } = req.body;
  const email = req.session.email;

  if (!email) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await User.findOneAndUpdate({ email }, { password: hashedPassword });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

//reset pwd

app.post('/reset-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = generateOTP(); // Generate a temporary password
    //const hashedPassword = await bcrypt.hash(newPassword, 10);
    //user.password = hashedPassword;
    req.session.email = email;
    req.session.otp = otp;

    // Send the temporary password via email
    await sendOTP(email, otp);

    res.status(200).json({ message: 'otp code sent to your email' });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Verify OTP route for registration
app.post('/verify-otpResetpwd', async (req, res) => {
  const { otp } = req.body;
  

  if (req.session.otp === otp) {
    
      
      req.session.otp = null;

      res.status(200).json({ message: 'OTP verified .' });
  } else {
    res.status(400).json({ message: 'Invalid OTP.' });
  }
});

// Example route to add a book
app.post('/AddBooks', async (req, res) => {
  const { title, author, copies, status } = req.body;
  console.log("Adding book:", title);

  const existingBook = await Book.findOne({ title });
  if (existingBook) {
    return res.status(400).json({ message: 'Book already added' });
  }

  const book = new Book({
    title,
    author,
    copies,
    status,
  });

  try {
    await book.save();
    res.status(201).json({ message: 'New book added successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch all books
app.get('/books', async (req, res) => {
  try {
    const books = await Book.find({});
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add book issuing route
app.post('/bookIssuings', async (req, res) => {
  try {
    const bookIssuing = new BookIssuing(req.body);
    await bookIssuing.save();
    res.status(201).send(bookIssuing);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
