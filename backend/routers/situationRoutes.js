const express = require('express');
const router = express.Router();

// Country Situation endpoint
router.get('/:country', async (req, res) => {
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
      },
      'france': {
        safetyLevel: 'safe',
        overview: 'France is a popular tourist destination with good safety standards.',
        security: 'Stable - Watch for pickpockets in tourist areas',
        health: 'Excellent - High-quality healthcare system',
        travelStatus: 'Fully open to tourists',
        note: 'Be aware of your surroundings in crowded places'
      },
      'australia': {
        safetyLevel: 'safe',
        overview: 'Australia is very safe for international travelers.',
        security: 'Very stable - Low crime rate',
        health: 'Excellent - Modern medical facilities',
        travelStatus: 'Open with visa requirements',
        note: 'Be cautious of wildlife and extreme weather'
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

module.exports = router;
