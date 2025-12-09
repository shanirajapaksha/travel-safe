const express = require('express');
const axios = require('axios');
const router = express.Router();

// COVID-19 endpoint
router.get('/:country', async (req, res) => {
  try {
    const { country } = req.params;
    const covidUrl = `https://disease.sh/v3/covid-19/countries/${encodeURIComponent(country)}?strict=false`;
    const response = await axios.get(covidUrl, { timeout: 5000 });
    
    const covidData = {
      confirmed: response.data.cases,
      active: response.data.active,
      deaths: response.data.deaths,
      recovered: response.data.recovered,
      vaccinated: response.data.population
    };
    
    res.json(covidData);
  } catch (error) {
    console.error('COVID API error:', error.message);
    
    res.json({
      confirmed: 'N/A',
      active: 'N/A',
      deaths: 'N/A',
      recovered: 'N/A',
      vaccinated: 'N/A'
    });
  }
});

module.exports = router;
