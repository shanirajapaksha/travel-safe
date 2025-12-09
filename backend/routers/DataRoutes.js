const express = require('express');
const router = express.Router();

// Import individual route modules
const weatherRoutes = require('./weatherRoutes');
const covidRoutes = require('./covidRoutes');
const countryRoutes = require('./countryRoutes');
const advisoryRoutes = require('./advisoryRoutes');
const newsRoutes = require('./newsRoutes');
const situationRoutes = require('./situationRoutes');

// Mount routes
router.use('/weather', weatherRoutes);
router.use('/covid', covidRoutes);
router.use('/country', countryRoutes);
router.use('/advisory', advisoryRoutes);
router.use('/news', newsRoutes);
router.use('/country-news', newsRoutes);
router.use('/country-situation', situationRoutes);

module.exports = router;

// ====== OLD MONOLITHIC CODE BELOW - CAN BE DELETED ======
/*
const express = require('express');
const axios = require('axios');
const router = express.Router();

// Weather endpoint - OpenWeatherMap API
router.get('/weather/:country', async (req, res) => {
  try {
    const { country } = req.params;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    console.log('API Key loaded:', apiKey ? 'Yes' : 'No');
    console.log('API Key length:', apiKey?.length);

    if (!apiKey) {
      return res.status(500).json({ 
        error: 'OpenWeather API key not configured' 
      });
    }

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(country)}&units=metric&appid=${apiKey}`;
    console.log('Weather URL:', weatherUrl);
    const weatherResponse = await axios.get(weatherUrl);

    const weatherData = {
      location: weatherResponse.data.name,
      temperature: weatherResponse.data.main.temp,
      feelsLike: weatherResponse.data.main.feels_like,
      description: weatherResponse.data.weather[0].description,
      humidity: weatherResponse.data.main.humidity,
      windSpeed: weatherResponse.data.wind.speed,
      icon: weatherResponse.data.weather[0].icon
    };

    res.json(weatherData);
  } catch (error) {
    console.error('Weather API error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    res.json({
      location: req.params.country,
      temperature: 25,
      feelsLike: 27,
      description: 'Weather data unavailable - API key may need activation',
      humidity: 65,
      windSpeed: 5,
      icon: '01d'
    });
  }
});

// Travel Advisory endpoint
router.get('/advisory/:country', async (req, res) => {
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

// COVID-19 endpoint
router.get('/covid/:country', async (req, res) => {
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

// Country Info endpoint - with better error handling
router.get('/country/:country', async (req, res) => {
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

// News endpoint
router.get('/news', async (req, res) => {
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
router.get('/country-news/:country', async (req, res) => {
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

// Country Situation endpoint
router.get('/country-situation/:country', async (req, res) => {
  try {
    const { country } = req.params;
    
    const situations = {
      'sri-lanka': {
        safetyLevel: 'moderate',
        overview: 'Sri Lanka is generally safe for tourists with standard precautions.',
        security: 'Stable - Minor incidents reported in some areas',
        health: 'Good - Medical facilities available in main cities',
        travelStatus: 'Open to tourists',
        note: 'Exercise normal precautions, especially in remote areas'
      },
      'japan': {
        safetyLevel: 'safe',
        overview: 'Japan is one of the safest countries to visit.',
        security: 'Very stable - Low crime rate',
        health: 'Excellent - World-class medical facilities',
        travelStatus: 'Fully open to international tourists',
        note: 'One of the safest destinations worldwide'
      },
      'thailand': {
        safetyLevel: 'moderate',
        overview: 'Thailand is popular with tourists and generally safe.',
        security: 'Stable - Exercise caution in border regions',
        health: 'Good - Modern hospitals in Bangkok and tourist areas',
        travelStatus: 'Open to tourists',
        note: 'Avoid political gatherings and demonstrations'
      },
      'india': {
        safetyLevel: 'moderate',
        overview: 'India requires standard travel precautions.',
        security: 'Variable by region - More caution in rural areas',
        health: 'Good in major cities - Take health precautions',
        travelStatus: 'Open to tourists with standard visas',
        note: 'Stay aware of local customs and traffic safety'
      },
      'united-states': {
        safetyLevel: 'safe',
        overview: 'The United States is generally safe for international visitors.',
        security: 'Stable - Standard urban safety precautions apply',
        health: 'Excellent - Best medical facilities worldwide',
        travelStatus: 'Fully open with valid visa/ESTA',
        note: 'Follow standard city safety practices'
      }
    };
    
    const countryKey = country.toLowerCase().replace(/\s+/g, '-');
    const situation = situations[countryKey] || {
      safetyLevel: 'moderate',
      overview: `${country} information based on current travel advisories.`,
      security: 'Check latest travel advisories',
      health: 'Check vaccination requirements',
      travelStatus: 'Check visa requirements',
      note: 'Always check official travel advisories before traveling'
    };
    
    res.json(situation);
  } catch (error) {
    console.error('Situation API error:', error.message);
    res.status(500).json({
      error: 'Failed to fetch situation',
      details: error.message
    });
  }
});
*/
