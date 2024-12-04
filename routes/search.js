 var express = require('express');

 const Url = require('../models/urlModel');
 var router = express.Router();

router.get('/search', async (req, res) => {
     const { query, username } = req.query;
  
     try {
         console.log(`Searching for: ${query}`);
         const userUrls = await Url.find({ username });
        const filteredUrls = userUrls.filter(url =>
             url.title.includes(query) || url.url.includes(query)
         );
  
        console.log(`Found URLs: ${filteredUrls.length}`);
       res.json(filteredUrls);
    } catch (error) {
        console.error(error);
         res.status(500).send('Internal server error.');
    }
   });

 module.exports = router;


