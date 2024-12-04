const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/usermodel'); // Import User model
const Url = require('../models/urlModel'); // Import Url model

router.get('/', (req, res) => {
    // Check if a message is passed through query params
    const message = req.query.message || null;
    res.render('index', { title: 'URL Management App', message }); 
});

//  login form
 router.get('/login', (req, res) => {
    res.render('login'); 
 });

//  registration form
router.get('/register', (req, res) => {
    res.render('register'); 
});
// router.get('/', isAuthenticated, function(req, res) {
//     const username = req.session.username || null;
//     res.render("login", { username: username });
//   });


//  // Define the isAuthenticated middleware
//  const isAuthenticated = (req, res, next) => {
//      // Check if the user is authenticated
//     if (req.session && req.session.userEmail) {
//       // User is authenticated, proceed to the next middleware
//       return next();
//      }
  
//     // User is not authenticated, redirect to the login page
//     res.redirect('/login');
//   };
//  //Define the isAuthenticated middleware

//  form submission
router.post('/submit', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (user && user.password === password) {
            
            res.redirect(`/welcome?username=${username}`); 
        } else {
            res.send('Invalid username or password. Please try again.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error.');
    }
});


//  user registration
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
          return res.status(400).send('User already exists.');
      }

     
      const newUser = new User({ username, password });
      await newUser.save();

      res.redirect('/?message=User created successfully. You can log in now.');  // Redirect to login page
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error.');
  }
});




//  welcome page with stored URLs
router.get('/welcome', async (req, res) => {
    const username = req.query.username;
    const page = parseInt(req.query.page) || 1; 
    const limit = 3;
    const skip = (page - 1) * limit; 

    try {
        const userUrls = await Url.find({ username }).skip(skip).limit(limit);
        const totalUrls = await Url.countDocuments({ username }); // Get total count of URLs
        const totalPages = Math.ceil(totalUrls / limit); // Calculate total pages

        res.render('welcome', { username, userUrls, currentPage: page, totalPages });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error.');
    }
});



router.post('/submit-url', async (req, res) => {
    const { title, url, username } = req.body;

    try {
        const existingUrls = await Url.find({ username });
        if (existingUrls.length >= 5) {
            return res.status(400).send('You can only add up to 5 URLs.');
        }

        // Create a new URL with the title, original URL, and username
        const newUrl = new Url({ title, url, username });
        await newUrl.save();

        // Redirect to welcome page to show updated list
        res.redirect(`/welcome?username=${username}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error.');
    }
});
//new addeed
router.get('/:shortUrl', async (req, res) => {
    const { shortUrl } = req.params;

    try {
        const urlEntry = await Url.findOne({ shortUrl });
        if (urlEntry) {
            res.redirect(urlEntry.url); // Redirect to the original URL
        } else {
            res.status(404).send('URL not found.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error.');
    }
});



// Handle delete URL
router.post('/delete-url', async (req, res) => {
    const { id, username } = req.body;

    try {
        await Url.findByIdAndDelete(id);
        res.redirect(`/welcome?username=${username}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error.');
    }
});
router.post('/edit-url', async (req, res) => {
    const { id, title, url, username } = req.body; // Capture username
    console.log(username);

    // Render the edit page with the existing details and username
    res.render('edit', { id, title, url, username }); // Pass username here
});

router.post('/update-url', async (req, res) => {
    const { id, title, url } = req.body;

    try {
        await Url.findByIdAndUpdate(id, { title, url });
        res.redirect(`/welcome?username=${req.body.username}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error.');
    }
});


module.exports = router;
      







