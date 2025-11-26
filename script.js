// --- API Endpoints and Constants ---
const ACTIVITY_API_URL = 'https://www.boredapi.com/api/activity';
const FACT_API_URL = 'https://catfact.ninja/fact';
const CACHE_KEY_ACTIVITY = 'lastActivity';
const CACHE_KEY_FACT = 'lastFact';

// --- Select HTML Elements ---
const activityDisplay = document.getElementById('activity-display');
const factDisplay = document.getElementById('fact-display');
const mainButton = document.getElementById('main-button');
const themeButton = document.getElementById('theme-button');

// --- THEME SWITCHER LOGIC (NO CHANGE) ---
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
}

// --- DATA FETCHING & DISPLAY FUNCTIONS ---

/**
 * Handles fetching, parsing, caching, and displaying data for ONE API.
 * @param {string} url - The API URL.
 * @param {string} key - The cache key.
 * @param {HTMLElement} displayElement - The HTML element to update.
 * @param {string} dataKey - The key in the JSON response (e.g., 'activity' or 'fact').
 */
async function fetchAndDisplay(url, key, displayElement, dataKey) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const content = data[dataKey]; // Get the data using the dynamic key
        
        displayElement.textContent = content;
        localStorage.setItem(key, content); // Cache the result
    } catch (error) {
        console.error(`Fetch failed for ${dataKey}:`, error);
        displayElement.textContent = `Error loading ${dataKey}.`;
    }
}


/**
 * Main function using Promise.all() to fetch both data sources concurrently.
 */
async function fetchBothIdeas() {
    mainButton.disabled = true; 
    activityDisplay.textContent = "Fetching...";
    factDisplay.textContent = "Fetching...";

    // 1. Create a Promise for each request
    const activityPromise = fetchAndDisplay(
        ACTIVITY_API_URL, 
        CACHE_KEY_ACTIVITY, 
        activityDisplay, 
        'activity' // Key for Bored API
    );
    
    const factPromise = fetchAndDisplay(
        FACT_API_URL, 
        CACHE_KEY_FACT, 
        factDisplay, 
        'fact' // Key for Cat Facts API
    );
    
    try {
        // 2. Wait for BOTH promises to resolve successfully
        await Promise.all([activityPromise, factPromise]);
        
    } catch (error) {
        // If either fetch fails, the Promise.all() will be rejected
        console.error("One or more requests failed:", error);
    } finally {
        mainButton.disabled = false;
    }
}


// --- INITIALIZATION AND CACHING ---

function loadInitialContent() {
    loadTheme();
    
    // Check and load cached Activity
    const cachedActivity = localStorage.getItem(CACHE_KEY_ACTIVITY);
    if (cachedActivity) {
        activityDisplay.textContent = `[Cached] Activity: ${cachedActivity}`;
    }

    // Check and load cached Fact
    const cachedFact = localStorage.getItem(CACHE_KEY_FACT);
    if (cachedFact) {
        factDisplay.textContent = `[Cached] Fact: ${cachedFact}`;
    }
    
    // Fetch fresh content immediately
    fetchBothIdeas(); 
}


// --- EVENT LISTENERS ---

mainButton.addEventListener('click', fetchBothIdeas);
themeButton.addEventListener('click', toggleTheme);

// Start the application
loadInitialContent();
