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

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Adjust the origin to match your frontend URL
  credentials: true,
}));

app.use(session({
  secret: 'chamodi1998_$$$',
  resave: false,
  saveUninitialized: false, // Set to false to only save sessions with data
  store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/sessions' }), // Adjust the MongoDB URL if needed
  cookie: { secure: false, httpOnly: true, maxAge: 60 * 60 * 1000 } // 1 hour session
}));

// Connect to the database
connectDB();

// Generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP via email using Bravo API
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
      'api-key': 'api'
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
  console.log("login ok");
  const { email, password } = req.body;
  console.log("user type password = "+password);


  

 
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("user type hashed password = "+hashedPassword);

  try {
	 // Check if the user exists
  const existingEmail = await User.findOne({ email });
  

  const isPasswordValid = await bcrypt.compare(password, existingEmail.password);

  if (isPasswordValid) {
    res.status(201).json({ message: 'User exists' });
  }else{
	res.status(401).json({ message: 'User email or password wrong' });  
  }
  
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
});



//book select unselect from user
app.put('/books/:id/select', async (req, res) => {
  const { id } = req.params;
  
  try {
      const book = await Book.findById(id);
      
      if (!book) {
          return res.status(404).json({ message: 'Book not found' });
      }

      if (book.copies > 0) {
          book.copies -= 1;
          if (book.copies === 0) {
              book.status = 'unavailable';
          }
          await book.save();
          return res.json(book);
      } else {
          return res.status(400).json({ message: 'No copies available' });
      }
  } catch (error) {
      res.status(500).json({ message: 'Server error', error });
  }
});



//
app.put('/books/:id/unselect', async (req, res) => {
    const { id } = req.params;
    
    try {
        const book = await Book.findById(id);
        
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        book.copies += 1;
        if (book.status === 'unavailable') {
            book.status = 'available';
        }
        await book.save();
        return res.json(book);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});





// Verify OTP route
app.post('/verify-otp', async (req, res) => {
  const { otp } = req.body;
  console.log("Verification OTP Session ID:", req.session.id);
  console.log("Session OTP during verification:", req.session.otp);
  console.log("Received OTP:", otp);

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
