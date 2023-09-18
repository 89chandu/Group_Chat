const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set the views directory and view engine (EJS in this case)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); // You can use a different view engine if preferred

// Store messages in an array (for simplicity; in production, you'd use a database)
const messages = [];

// Store connected users and their usernames
const users = {};

// Serve static files (CSS, JavaScript, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Set up a route to serve the HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// API endpoint to log in with a username
app.post('/login', (req, res) => {
  const { username } = req.body;
  if (username) {
    // Store the username in the users object with the user's IP address as the key
    users[req.ip] = username;
    res.sendStatus(200);
  } else {
    res.status(400).send('Username is required');
  }
});

// API endpoint to send a user-specific message
app.post('/send', (req, res) => {
  const { message } = req.body;
  const username = users[req.ip];
  if (message && username) {
    const userMessage = `${username}: ${message}`;
    messages.push(userMessage);
    res.sendStatus(200);
  } else {
    res.status(400).send('Username and message are required');
  }
});

// API endpoint to fetch messages
app.get('/messages', (req, res) => {
  res.json(messages);
});

// Set up a route to serve the Contact Us page
app.get('/contactus', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'contactus.html'));
});

// Handle the Contact Us form submission
app.post('/success', (req, res) => {
  const { name, email } = req.body;
  if (name && email) {
    // You can perform additional actions here, such as sending an email
    res.send('Form successfully filled');
  } else {
    res.status(400).send('Name and email are required');
  }
});

// Handle 404 errors with a custom "Page not found" view
app.use((req, res) => {
  res.status(404).render('not-found'); // Render the not-found view
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
