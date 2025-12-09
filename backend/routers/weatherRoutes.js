const express = require('express');
const axios = require('axios');
const router = express.Router();

// Weather endpoint - OpenWeatherMap API
router.get('/:country', async (req, res) => {
  try {
    const { country } = req.params;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ 
        error: 'OpenWeather API key not configured' 
      });
    }

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(country)}&units=metric&appid=${apiKey}`;
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
    
    res.json({
      location: req.params.country,
      temperature: 25,
      feelsLike: 27,
      description: 'Weather data unavailable',
      humidity: 65,
      windSpeed: 5,
      icon: '01d'
    });
  }
});

module.exports = router;
