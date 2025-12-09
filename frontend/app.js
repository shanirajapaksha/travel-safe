// API base URL
const API_BASE = 'http://localhost:5000/api';

// DOM Elements
const searchBtn = document.getElementById('search-btn');
const countryInput = document.getElementById('country-input');
const logoutBtn = document.getElementById('logout-btn');
const userChip = document.getElementById('user-chip');
const userNameEl = document.getElementById('user-name');
const userAvatar = document.getElementById('user-avatar');

// Result elements
const advisoryScore = document.getElementById('advisory-score');
const advisoryText = document.getElementById('advisory-text');

const covidConfirmed = document.getElementById('covid-confirmed');
const covidActive = document.getElementById('covid-active');
const covidDeaths = document.getElementById('covid-deaths');
const covidVaccinated = document.getElementById('covid-vaccinated');

const weatherSummary = document.getElementById('weather-summary');
const weatherTemp = document.getElementById('weather-temp');
const weatherFeels = document.getElementById('weather-feels');
const weatherIcon = document.getElementById('weather-icon');

const countryFlag = document.getElementById('country-flag');
const countryRegion = document.getElementById('country-region');
const countryCurrency = document.getElementById('country-currency');
const countryPopulation = document.getElementById('country-population');

const newsContainer = document.getElementById('news-container');
const newsTitle = document.getElementById('news-title');
const situationSection = document.getElementById('situation-section');
const situationContent = document.getElementById('situation-content');

// Auth helpers
function loadUser() {
  const raw = localStorage.getItem('ts_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse user', err);
    return null;
  }
}

function updateUserUI(user) {
  if (!userChip || !logoutBtn) return;
  userChip.classList.remove('hidden');
  userNameEl.textContent = user?.name || 'Guest';
  if (user?.picture) {
    userAvatar.src = user.picture;
    userAvatar.style.display = 'block';
  } else {
    userAvatar.style.display = 'none';
  }
}

function requireLogin() {
  const user = loadUser();
  if (!user) {
    window.location.href = 'login.html';
    return null;
  }
  updateUserUI(user);
  return user;
}

// Event listeners
searchBtn.addEventListener('click', handleSearch);
countryInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    handleSearch();
  }
});

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('ts_user');
    window.location.href = 'login.html';
  });
}

// Main search handler
async function handleSearch() {
  const country = countryInput.value.trim();
  
  if (!country) {
    alert('Please enter a country name');
    return;
  }

  searchBtn.disabled = true;
  searchBtn.textContent = 'Loading...';

  try {
    // First validate the country exists
    const countryValidation = await fetch(`${API_BASE}/country/${encodeURIComponent(country)}`);
    
    if (!countryValidation.ok) {
      alert(`Country "${country}" not found. Please try another name or check the spelling.`);
      searchBtn.disabled = false;
      searchBtn.textContent = 'Search';
      return;
    }

    // Fetch all data in parallel
    await Promise.all([
      fetchWeatherData(country),
      fetchCovidData(country),
      fetchCountryInfo(country),
      fetchAdvisoryData(country),
      fetchCountryNews(country),
      fetchCountrySituation(country)
    ]);
  } catch (error) {
    console.error('Search error:', error);
    
    // Check if it's a network error (backend not running)
    if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
      alert('⚠️ Cannot connect to backend server!\n\n' +
            'Please make sure the backend is running:\n' +
            '1. Open Terminal\n' +
            '2. Run: cd backend\n' +
            '3. Run: npm start\n\n' +
            'See START_HERE.txt for detailed instructions.');
    } else {
      alert('Error searching. Please try again.');
    }
  } finally {
    searchBtn.disabled = false;
    searchBtn.textContent = 'Search';
  }
}

// Fetch weather data
async function fetchWeatherData(country) {
  try {
    const response = await fetch(`${API_BASE}/weather/${encodeURIComponent(country)}`);
    
    if (!response.ok) {
      throw new Error('Weather data not available');
    }

    const data = await response.json();
    
    // Update UI
    weatherSummary.textContent = `${data.location}: ${data.description}`;
    weatherTemp.textContent = `${data.temperature}°C`;
    weatherFeels.textContent = `${data.feelsLike}°C`;
    
    // Display weather icon from OpenWeatherMap
    if (data.icon) {
      weatherIcon.src = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;
      weatherIcon.style.display = 'block';
      weatherIcon.alt = data.description;
    }
  } catch (error) {
    console.error('Weather fetch error:', error);
    weatherSummary.textContent = 'Weather data unavailable';
    weatherTemp.textContent = '—';
    weatherFeels.textContent = '—';
    weatherIcon.style.display = 'none';
  }
}

// Fetch COVID-19 data
async function fetchCovidData(country) {
  try {
    const response = await fetch(`${API_BASE}/covid/${encodeURIComponent(country)}`);
    
    if (!response.ok) {
      throw new Error('COVID data not available');
    }

    const data = await response.json();
    
    // Update UI
    covidConfirmed.textContent = data.confirmed?.toLocaleString() || '—';
    covidActive.textContent = data.active?.toLocaleString() || '—';
    covidDeaths.textContent = data.deaths?.toLocaleString() || '—';
    covidVaccinated.textContent = data.vaccinated?.toLocaleString() || '—';
  } catch (error) {
    console.error('COVID fetch error:', error);
    covidConfirmed.textContent = '—';
    covidActive.textContent = '—';
    covidDeaths.textContent = '—';
    covidVaccinated.textContent = '—';
  }
}

// Fetch country info
async function fetchCountryInfo(country) {
  try {
    const response = await fetch(`${API_BASE}/country/${encodeURIComponent(country)}`);
    
    if (!response.ok) {
      throw new Error('Country data not available');
    }

    const data = await response.json();
    
    // Update UI
    countryFlag.src = data.flag;
    countryFlag.alt = `${data.name} flag`;
    countryFlag.hidden = false;
    countryRegion.textContent = `${data.region} - ${data.subregion}`;
    countryCurrency.textContent = data.currency;
    countryPopulation.textContent = data.population?.toLocaleString() || '—';
  } catch (error) {
    console.error('Country fetch error:', error);
    countryFlag.hidden = true;
    countryRegion.textContent = '—';
    countryCurrency.textContent = '—';
    countryPopulation.textContent = '—';
  }
}

// Fetch travel advisory data
async function fetchAdvisoryData(country) {
  try {
    const response = await fetch(`${API_BASE}/advisory/${encodeURIComponent(country)}`);
    
    if (!response.ok) {
      throw new Error('Advisory data not available');
    }

    const data = await response.json();
    
    // Extract advisory score
    const countryKeys = Object.keys(data.data || {});
    if (countryKeys.length > 0) {
      const advisory = data.data[countryKeys[0]].advisory;
      advisoryScore.textContent = advisory.score || '—';
      advisoryText.textContent = advisory.message || 'No advisory information';
    } else {
      advisoryScore.textContent = '—';
      advisoryText.textContent = 'No advisory data available';
    }
  } catch (error) {
    console.error('Advisory fetch error:', error);
    advisoryScore.textContent = '—';
    advisoryText.textContent = 'Advisory data unavailable';
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  const user = requireLogin();
  console.log('TravelSafe app initialized', user ? `for ${user.name}` : '');
});

// Fetch country-specific news
async function fetchCountryNews(country) {
  try {
    const response = await fetch(`${API_BASE}/country-news/${encodeURIComponent(country)}`);
    if (!response.ok) throw new Error('Failed to fetch news');
    
    const data = await response.json();
    const articles = data.articles || [];
    
    newsTitle.textContent = `News from ${country}`;
    
    if (articles.length === 0) {
      newsContainer.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 20px;">No news available for ${country}.</p>`;
      return;
    }
    
    // Display articles with images
    newsContainer.innerHTML = articles.map((article, idx) => `
      <div class="news-item" onclick="window.open('${article.url || '#'}', '_blank')">
        ${article.image ? `<img src="${article.image}" alt="News image" class="news-image" onerror="this.style.display='none'">` : ''}
        ${article.video ? `<div class="news-video-placeholder"><i class="fas fa-play-circle"></i> Video</div>` : ''}
        <h3>${article.title || 'Untitled'}</h3>
        <p>${(article.description || 'No description').substring(0, 80)}...</p>
        <div style="font-size: 0.75rem; color: var(--text-muted);">
          ${article.source?.name ? `<span class="news-source">${article.source.name}</span>` : ''}
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('News fetch error:', error);
    newsContainer.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 20px;">Unable to load news for ${country}.</p>`;
  }
}

// Fetch country situation
async function fetchCountrySituation(country) {
  try {
    const response = await fetch(`${API_BASE}/country-situation/${encodeURIComponent(country)}`);
    if (!response.ok) throw new Error('Failed to fetch situation');
  
    const data = await response.json();
  
    situationSection.classList.remove('hidden');
  
    const safetyLevel = data.safetyLevel || 'moderate';
    const badgeClass = safetyLevel === 'safe' ? 'safe' : safetyLevel === 'caution' ? 'caution' : 'moderate';
  
    situationContent.innerHTML = `
      <div class="situation-badge ${badgeClass}">
        <i class="fas fa-${safetyLevel === 'safe' ? 'check-circle' : safetyLevel === 'caution' ? 'exclamation-circle' : 'info-circle'}"></i>
        ${safetyLevel.charAt(0).toUpperCase() + safetyLevel.slice(1)}
      </div>
      <p><strong>${data.overview || 'Country Information'}</strong></p>
      <p><i class="fas fa-shield-alt"></i> <strong>Security:</strong> ${data.security || 'Stable'}</p>
      <p><i class="fas fa-hospital"></i> <strong>Health:</strong> ${data.health || 'Good'}</p>
      <p><i class="fas fa-plane"></i> <strong>Travel Status:</strong> ${data.travelStatus || 'Open'}</p>
      <p><i class="fas fa-info-circle"></i> <strong>Note:</strong> ${data.note || 'Standard travel precautions apply'}</p>
    `;
  } catch (error) {
    console.error('Situation fetch error:', error);
    situationSection.classList.add('hidden');
  }
}
