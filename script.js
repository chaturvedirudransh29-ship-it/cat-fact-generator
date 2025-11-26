// --- API Endpoints and Constants ---
const FACT_API_URL = 'https://catfact.ninja/fact';
const CACHE_KEY_FACT = 'lastFact';

// --- Select HTML Elements ---
const factDisplay = document.getElementById('fact-display');
const mainButton = document.getElementById('main-button');
const themeButton = document.getElementById('theme-button');

// --- THEME SWITCHER LOGIC (REUSED) ---
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

// --- DATA FETCHING & DISPLAY (SIMPLIFIED) ---

function displayAndCache(fact) {
    factDisplay.textContent = fact;
    localStorage.setItem(CACHE_KEY_FACT, fact);
}

async function fetchNewFact() {
    factDisplay.textContent = "Fetching a purr-fect fact..."; 
    mainButton.disabled = true; 

    try {
        const response = await fetch(FACT_API_URL);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        
        // Use the 'fact' key from the Cat Facts API
        if (data.fact) {
            displayAndCache(data.fact);
        } else {
             factDisplay.textContent = "Error: Could not retrieve fact. Try again.";
        }
        
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        factDisplay.textContent = "Error: Could not retrieve fact. Check your console for details.";
    } finally {
        mainButton.disabled = false;
    }
}

// --- INITIALIZATION AND CACHING ---

function loadInitialContent() {
    loadTheme();
    
    // Check and load cached Fact
    const cachedFact = localStorage.getItem(CACHE_KEY_FACT);
    if (cachedFact) {
        factDisplay.textContent = `[Cached] Last fact was: ${cachedFact}`;
    }
    
    fetchNewFact(); 
}


// --- EVENT LISTENERS ---

mainButton.addEventListener('click', fetchNewFact);
themeButton.addEventListener('click', toggleTheme);

// Start the application
loadInitialContent();
