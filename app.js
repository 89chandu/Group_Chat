const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Store messages in an array (for simplicity; in production, you'd use a database)
const messages = [];

// Store connected users and their usernames
const users = {};

// Serve static files (CSS, JavaScript, etc.)
app.use(express.static('public'));

// Set up a route to serve the HTML page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
