const express = require('express');
const axios = require('axios');
const router = express.Router();

// Country Info endpoint - with better error handling
router.get('/:country', async (req, res) => {
  try {
    const { country } = req.params;
    
    let response;
    let countryUrl;
    
    try {
      countryUrl = `https://restcountries.com/v3.1/name/${encodeURIComponent(country)}?fullText=true`;
      response = await axios.get(countryUrl, { timeout: 5000 });
      console.log('Found via exact match:', response.data[0].name.common);
    } catch (error) {
      if (error.response?.status === 404) {
        try {
          countryUrl = `https://restcountries.com/v3.1/name/${encodeURIComponent(country)}?fullText=false`;
          response = await axios.get(countryUrl, { timeout: 5000 });
          console.log('Found via partial match:', response.data[0].name.common);
        } catch (innerError) {
          if (country.length <= 3) {
            try {
              countryUrl = `https://restcountries.com/v3.1/alpha/${encodeURIComponent(country)}`;
              response = await axios.get(countryUrl, { timeout: 5000 });
              console.log('Found via code:', response.data[0].name.common);
            } catch (codeError) {
              throw innerError;
            }
          } else {
            throw innerError;
          }
        }
      } else {
        throw error;
      }
    }
    
    if (Array.isArray(response.data)) {
      const searchLower = country.toLowerCase();
      const sorted = response.data.sort((a, b) => {
        const aMatch = a.name.common.toLowerCase() === searchLower ? 0 : 1;
        const bMatch = b.name.common.toLowerCase() === searchLower ? 0 : 1;
        return aMatch - bMatch;
      });
      response.data = [sorted[0]];
    }
    
    const countryData = response.data[0];
    const info = {
      name: countryData.name.common,
      flag: countryData.flags.png || '',
      region: countryData.region || 'N/A',
      subregion: countryData.subregion || 'N/A',
      population: countryData.population || 'N/A',
      currency: Object.values(countryData.currencies || {})[0]?.name || 'N/A',
      capital: countryData.capital?.[0] || 'N/A'
    };
    
    res.json(info);
  } catch (error) {
    console.error('Country API error:', error.message);
    
    res.status(404).json({
      error: 'Country not found',
      details: error.message 
    });
  }
});

module.exports = router;
