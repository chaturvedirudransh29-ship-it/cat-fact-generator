// 1. Define the API endpoint (The address where the data lives)
const API_URL = 'https://catfact.ninja/fact';

// 2. Select the HTML elements we need to manipulate
const factDisplay = document.getElementById('fact-display');
const factButton = document.getElementById('fact-button');

/**
 * 3. The asynchronous function to fetch data from the API.
 * The 'async' keyword allows us to use 'await' inside the function.
 */
async function fetchCatFact() {
    // Show a loading message while waiting for the network
    factDisplay.textContent = "Fetching a purr-fect fact..."; 
    factButton.disabled = true; // Disable button to prevent spamming the API

    try {
        // Use 'await' to pause the function until the response is received
        const response = await fetch(API_URL);

        // Check if the HTTP status code indicates success (200-299)
        if (!response.ok) {
            // Throw an error if the status is bad (e.g., 404, 500)
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Use 'await' to parse the response body as JSON
        const data = await response.json();
        // The structure of the data object is like: { fact: "...", length: 10 }

        // Update the HTML element with the actual fact text
        factDisplay.textContent = data.fact;
        
    } catch (error) {
        // This block catches any error that occurred during the fetch process
        console.error('There was a problem with the fetch operation:', error);
        factDisplay.textContent = "Error: Could not retrieve fact. Check your console for details.";
    } finally {
        // The 'finally' block runs regardless of success or failure
        factButton.disabled = false; // Re-enable the button
    }
}

// 4. Attach the function to the button click event (Event Listener)
// When the button is clicked, the fetchCatFact function runs.
factButton.addEventListener('click', fetchCatFact);

// 5. Initial call: Fetch a fact when the page first loads
fetchCatFact();