const express = require('express');
const axios = require('axios');
const router = express.Router();

// Travel Advisory endpoint
router.get('/:country', async (req, res) => {
  try {
    const { country } = req.params;
    
    const countryInfoUrl = `https://restcountries.com/v3.1/name/${encodeURIComponent(country)}?fullText=false`;
    const countryInfoResponse = await axios.get(countryInfoUrl);
    const countryCode = countryInfoResponse.data[0].cca2;
    
    const advisoryUrl = `http://www.travel-advisory.info/api?countrycode=${countryCode}`;
    const response = await axios.get(advisoryUrl, { 
      timeout: 5000,
      headers: { 'User-Agent': 'TravelSafe/1.0' }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Advisory API error:', error.message);
    
    res.json({
      data: {
        [req.params.country]: {
          advisory: {
            score: 3.5,
            message: 'Advisory data unavailable - Exercise normal precautions'
          }
        }
      }
    });
  }
});

module.exports = router;
