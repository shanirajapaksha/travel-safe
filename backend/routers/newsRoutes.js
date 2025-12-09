const express = require('express');
const axios = require('axios');
const router = express.Router();

// General news endpoint
router.get('/', async (req, res) => {
  try {
    const newsUrl = 'https://newsapi.org/v2/everything?q=travel+tourism+vacation&sortBy=publishedAt&language=en&pageSize=10';
    const response = await axios.get(newsUrl, { 
      timeout: 5000,
      headers: {
        'User-Agent': 'TravelSafe/1.0'
      }
    });
    
    res.json({
      articles: response.data.articles || []
    });
  } catch (error) {
    console.error('News API error:', error.message);
    
    res.json({
      articles: [
        {
          title: "Top 10 Budget Travel Destinations 2025",
          description: "Discover the most affordable travel destinations around the world this year.",
          source: { name: "Travel Blog" },
          publishedAt: new Date().toISOString(),
          url: "#"
        }
      ]
    });
  }
});

// Country-specific news endpoint
router.get('/:country', async (req, res) => {
  try {
    const { country } = req.params;
    
    const newsUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(country)}%20travel%20OR%20${encodeURIComponent(country)}%20tourism&sortBy=publishedAt&language=en&pageSize=15`;
    const response = await axios.get(newsUrl, { 
      timeout: 5000,
      headers: {
        'User-Agent': 'TravelSafe/1.0'
      }
    });
    
    res.json({
      articles: response.data.articles || []
    });
  } catch (error) {
    console.error('Country News API error:', error.message);
    
    const { country } = req.params;
    res.json({
      articles: [
        {
          title: `Travel Tips for ${country}`,
          description: `Essential travel tips and recommendations for visiting ${country}.`,
          source: { name: "Travel Guide" },
          image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&h=200&fit=crop',
          url: "#"
        },
        {
          title: `Local Customs and Culture in ${country}`,
          description: `Learn about the local customs, traditions, and culture of ${country}.`,
          source: { name: "Cultural Exchange" },
          image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&h=200&fit=crop',
          url: "#"
        },
        {
          title: `Best Time to Visit ${country}`,
          description: `Discover the best seasons and times to visit ${country} for an optimal experience.`,
          source: { name: "Travel Planning" },
          image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=300&h=200&fit=crop',
          url: "#"
        },
        {
          title: `Food and Cuisine in ${country}`,
          description: `Explore the delicious traditional dishes and culinary experience in ${country}.`,
          source: { name: "Food & Travel" },
          image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=300&h=200&fit=crop',
          url: "#"
        },
        {
          title: `Transportation Guide for ${country}`,
          description: `Complete guide to public transport and traveling around ${country}.`,
          source: { name: "Travel Tips" },
          video: true,
          url: "#"
        },
        {
          title: `Budget Travel in ${country}`,
          description: `Money-saving tips and budget travel recommendations for ${country}.`,
          source: { name: "Budget Travel" },
          image: 'https://images.unsplash.com/photo-1500577745216-b40cdebc7b4a?w=300&h=200&fit=crop',
          url: "#"
        }
      ]
    });
  }
});

module.exports = router;
