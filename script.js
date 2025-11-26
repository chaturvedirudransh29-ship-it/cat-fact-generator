// 1. Define the new API endpoint (Bored API)
const API_URL = 'https://www.boredapi.com/api/activity';
const CACHE_KEY = 'lastActivity';

// 2. Select the HTML elements
const factDisplay = document.getElementById('fact-display');
const factButton = document.getElementById('fact-button');
const themeButton = document.getElementById('theme-button');

// --- THEME SWITCHER LOGIC ---
function loadTheme() {
    // Check local storage for the user's preferred theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
}

function toggleTheme() {
    // Toggles the 'dark-mode' class on the body element
    document.body.classList.toggle('dark-mode');

    // Save the new state to local storage
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
}

// --- DATA FETCHING AND CACHING LOGIC ---

// Function to display an activity and save it to cache
function displayAndCache(activity) {
    factDisplay.textContent = activity;
    // Save the successful result to local storage for caching
    localStorage.setItem(CACHE_KEY, activity);
}

async function fetchNewActivity() {
    factDisplay.textContent = "Fetching a new idea..."; 
    factButton.disabled = true; 

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        
        // **Modification 1: Data Parsing** - The Bored API uses 'activity' not 'fact'
        if (data.activity) {
            displayAndCache(data.activity);
        } else {
            // Handle cases where the API might return an error structure
             factDisplay.textContent = "Error: Could not retrieve activity. Try again.";
        }
        
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        factDisplay.textContent = "Error: Could not retrieve activity. Check your console for details.";
    } finally {
        factButton.disabled = false;
    }
}

// --- INITIALIZATION ---

// Load theme preference on page load
loadTheme();

// **Modification 3: Caching (Check for saved data on startup)**
const cachedActivity = localStorage.getItem(CACHE_KEY);

if (cachedActivity) {
    // If cache exists, display it instantly (fast load time)
    factDisplay.textContent = `[Cached] Last activity was: ${cachedActivity}`;
    
    // Fetch a new one in the background for the next click
    // Note: We don't call fetchNewActivity() immediately here, we wait for the click.
} else {
    // If no cache, fetch a fresh one
    fetchNewActivity();
}


// --- EVENT LISTENERS ---

// Attach the main function to the New Activity button
factButton.addEventListener('click', fetchNewActivity);

// Attach the toggle function to the Theme button
themeButton.addEventListener('click', toggleTheme);
