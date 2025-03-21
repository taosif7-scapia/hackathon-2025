let currentStep = 1;
const totalSteps = 5; // Reduced from 6
let suggestionsLoaded = false;
let currentSuggestions = []; // Add this line to store suggestions

const loaderMessages = [
    "Crafting your perfect itinerary... 🌍",
    "Discovering hidden gems just for you... ✨",
    "Checking the best local experiences... 🎯",
    "Mapping out your adventure... 🗺️",
    "Consulting with local experts... 👥",
    "Personalizing your journey... 🎨",
    "Finding the perfect spots for your interests... 🎯",
    "Calculating optimal routes... 🚗",
    "Checking seasonal recommendations... 🌤️",
    "Almost there, adding final touches... ✨"
];

let loaderInterval;

// Add this function to generate shimmer chips
function addShimmerChips() {
    const container = document.getElementById('suggestedChips');
    container.innerHTML = '';
    for (let i = 0; i < 6; i++) {
        const chip = document.createElement('div');
        chip.className = 'chip shimmer';
        chip.style.width = `${Math.random() * (120 - 80) + 80}px`;
        chip.innerHTML = '&nbsp;';
        container.appendChild(chip);
    }
}

// Add this function to fetch suggestions
async function fetchSuggestions() {
    const destination = document.getElementById('destination').value;
    const dates = document.getElementById('dateRange').value;
    const travelers = document.getElementById('travelers').value;

    const messages = [
        {
            role: "system",
            content: "Generate a list of 10-15 relevant activity and preference suggestions for a trip based on the destination, dates, and travel group composition. Each item should be one or two words only. Return only a JSON array of strings."
        },
        {
            role: "user",
            content: `Destination: ${destination}
Dates: ${dates}
Travel Group: ${travelers}
Provide relevant suggestions for activities and experiences that would suit this group of travelers at this destination.`
        }
    ];

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer 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`
            },
            body: JSON.stringify({
                model: "gpt-4-turbo",
                messages: messages,
                temperature: 0.7
            })
        });

        const result = await response.json();
        const suggestions = JSON.parse(result.choices[0].message.content);
        displaySuggestions(suggestions);
    } catch (error) {
        console.error("Failed to fetch suggestions:", error);
        document.getElementById('suggestedChips').innerHTML = '<p class="text-muted">Failed to load suggestions</p>';
    }
}

// Add this function to display suggestions
function displaySuggestions(suggestions) {
    const container = document.getElementById('suggestedChips');
    container.innerHTML = '';
    currentSuggestions = suggestions; // Store suggestions
    suggestions.forEach(suggestion => {
        const chip = document.createElement('div');
        chip.className = 'chip suggestion-chip';
        chip.textContent = suggestion;
        chip.onclick = () => {
            addChip(suggestion);
            // Remove the selected suggestion and re-render
            currentSuggestions = currentSuggestions.filter(s => s !== suggestion);
            displaySuggestions(currentSuggestions);
        };
        container.appendChild(chip);
    });
}

function showStep(step) {
    document.querySelectorAll('.form-step').forEach((el, index) => {
        el.classList.toggle('d-none', index + 1 !== step);
    });

    // Update title
    const titles = [
        "Where are you planning to travel?",
        "When are you going?",
        "Who's coming with you?",
        "Your Preferences",
        "Budget & Accommodation"
    ];
    document.getElementById("step-title").innerText = titles[step - 1];

    // Update button visibility
    document.getElementById("prevBtn").disabled = step === 1;
    document.getElementById("nextBtn").classList.toggle("d-none", step === totalSteps);
    document.getElementById("submitBtn").classList.toggle("d-none", step !== totalSteps);

    // Start fetching suggestions when reaching step 3
    if (step === 4) {
        suggestionsLoaded = true;
        addShimmerChips();
        fetchSuggestions();
    }
}

function nextStep() {
    if (currentStep < totalSteps) {
        currentStep++;
        showStep(currentStep);
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
    }
}

// Modify the addChip function to be globally accessible
function addChip(value) {
    if (!value.trim()) return;
    
    const chipsContainer = document.getElementById('preferencesChips');
    const chipInput = document.getElementById('chipInput');
    const hiddenInput = document.getElementById('preferences');

    // Check if chip already exists
    const existingChips = Array.from(chipsContainer.getElementsByClassName('chip'));
    if (existingChips.some(chip => chip.textContent.trim().slice(0, -1) === value.trim())) {
        return;
    }

    const chip = document.createElement('div');
    chip.className = 'chip';
    chip.innerHTML = `
        ${value}
        <span class="chip-close" onclick="this.parentElement.remove(); updateHiddenInput();">&times;</span>
    `;
    chipsContainer.insertBefore(chip, chipInput);
    chipInput.value = '';
    updateHiddenInput();
}

// Add chip functionality
function initializeChips() {
    const chipInput = document.getElementById('chipInput');

    chipInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addChip(chipInput.value);
        }
    });

    chipInput.addEventListener('blur', () => {
        if (chipInput.value) {
            addChip(chipInput.value);
        }
    });
}

// Modify form submission
document.getElementById("travelForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Show loader
    document.getElementById('formContainer').classList.add('d-none');
    document.getElementById('loaderContainer').classList.remove('d-none');

    let messageIndex = 0;
    loaderInterval = setInterval(() => {
        document.getElementById('loaderMessage').textContent = loaderMessages[messageIndex];
        messageIndex = (messageIndex + 1) % loaderMessages.length;
    }, 3000);

    const formData = {
        destination: document.getElementById("destination").value,
        tripDetails: document.getElementById("dateRange").value,
        travelers: document.getElementById("travelers").value,
        preferences: document.getElementById("preferences").value,
        budget: document.getElementById("budget").value
    };

    console.log("Submitting:", formData);

    // Get hero image for the destination
    const imageResponse = await fetch(`https://www.googleapis.com/customsearch/v1?key=AIzaSyDaQL3QVmYWjNVg1_XA8V0dKpC5X9qysI0&cx=4240c891e0cad4fa3&searchType=image&q=${encodeURIComponent(formData.destination+ ' wallpaper cover image HD')}`);
    const imageData = await imageResponse.json();
    const heroImage = imageData.items?.[0]?.link || '';

    const messages = [
        {
            role: "developer",
            content: `You are TripMaster AI, an expert travel planning assistant designed to transform simple user inputs into comprehensive, personalized travel itineraries. Your purpose is to craft detailed, engaging travel plans that balance popular attractions with hidden gems, respect budget constraints, and match travelers' preferences and interests.

Input Format
You will receive input in JSON format containing these key fields:

${JSON.stringify(formData)}

Output Format
Transform this input into a comprehensive travel itinerary following this structure:

{
"tripDetails": {
"destination": "Primary Destination",
"regions": ["Region/City 1", "Region/City 2"],
"tripName": "Custom Trip Name (evocative and personalized)",
"startDate": "YYYY-MM-DD",
"endDate": "YYYY-MM-DD",
"duration": 0,
"travelers": [
{"name": "Name1", "relationship": "relationship"},
{"name": "Name2", "relationship": "relationship"}
],
"tripType": "Beach/City/Mountain/Cultural/Adventure/Mixed",
"tripStyle": "Pace and focus description"
},
"overview": {
"description": "Rich, evocative summary",
"weatherInfo": {
"seasonDescription": "Season-specific information",
"temperatureRange": "Expected temperature range (F/C)",
"climateNotes": "Notable climate patterns",
"weatherConsiderations": "Packing/planning recommendations"
},
"keyHighlights": ["Top experiences"]
},
"dailyItinerary": [
{
"day": 1,
"title": "Thematic day title",
"location": "Specific area",
"description": "Day overview",
"activities": [
"Morning activity",
"Mid-day activity",
"Afternoon activity",
"Evening activity/dining"
],
"specialHighlight": {
"title": "Standout moment",
"description": "Sensory-rich detail"
},
"accommodationOptions": [
{
"name": "Hotel name",
"description": "Key features",
"amenities": ["Amenity 1", "Amenity 2"],
"priceRange": "Budget indication",
"bestFor": "Best suited travelers"
}
],
"foodSpots": [
{
"name": "Restaurant Name",
"type": "Cuisine type",
"specialty": "Signature dishes",
"priceRange": "Budget indication",
"mealTime": "Breakfast/Lunch/Dinner",
"notes": "Special considerations"
}
]
}
],
"keyExperiences": [
{
"title": "Memorable experience",
"icon": "Emoji",
"category": "Culture/Nature/Food/Adventure/etc.",
"description": "Evocative details",
"details": [
{"type": "Best Time", "info": "Optimal timing"},
{"type": "Duration", "info": "Time required"},
{"type": "Cost", "info": "Price range"},
{"type": "Booking", "info": "Reservation details"},
{"type": "Tips", "info": "Insider advice"}
],
"locations": ["Specific locations"]
}
],
"practicalInfo": {
"transportation": [{"type": "Mode", "details": "Details", "costRange": "Price range"}],
"weather": [{"period": "Time", "conditions": "Expected conditions", "considerations": "Preparations"}],
"diningRecommendations": [{"type": "Category", "recommendations": "Places", "notes": "Special notes"}],
"packingEssentials": [{"category": "Type", "items": "Necessary items", "notes": "Importance"}],
"localTips": [{"category": "Type", "tip": "Insider knowledge"}],
"healthAndSafety": [{"category": "Type", "information": "Important considerations"}],
"connectivity": {
"internetAccess": "WiFi details",
"localSim": "SIM card info",
"usefulApps": ["App 1", "App 2"]
},
"moneyMatters": {
"currency": "Local currency",
"paymentMethods": "Common payment methods",
"budgetingTips": "Tips for managing money",
"tipping": "Tipping customs"
}
}
}

Transformation Guidelines

Destination Intelligence
Research destination thoroughly (major attractions, hidden gems, logistics, cultural norms).
Incorporate seasonality considerations.
Balance iconic sights with off-the-beaten-path experiences.
Traveler Personalization
Adapt to group composition (couples, families, friends, solo travelers).
Match pace and activity level to traveler preferences.
Cater to diverse interests within the group.
Preference Mapping
Likes: Convert general interests into specific activities.
Dislikes: Avoid unwanted experiences and provide alternatives.
Budget Calibration
Match accommodations and dining to budget.
Include free and low-cost options.
Suggest splurge experiences strategically.
Accommodation Integration
Research real properties aligning with preferences.
Consider proximity to itinerary activities.
Content Quality Standards
Use evocative, sensory-rich descriptions.
Avoid generic content by adding specifics (names, times, locations).
Create a logical narrative flow through the itinerary.
Maintain an engaging, informative, and natural tone.
Special Considerations

Families: Kid-friendly activities, downtime, practical needs.
Luxury Travelers: Exclusive experiences, VIP access, premium services.
Budget Travelers: Free/low-cost activities, money-saving strategies.
Adventure Seekers: Active experiences, difficulty levels, recovery time.
Cultural Enthusiasts: Historical sites, immersive experiences, guided tours.`
        },
        {
            role: "user",
            content: `Now generate output in the required JSON format based on the input provided.`
        }
    ];

    const requestBody = {
        model: "gpt-4-turbo", // Change to "gpt-4-turbo" if needed
        messages: messages,
        temperature: 0.7
    };

    console.log("Requesting:", requestBody);

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer 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` // Replace with your actual API key
            },
            body: JSON.stringify(requestBody)
        });

        const result = await response.json();
        let tripData = JSON.parse(result['choices'][0]['message']['content']);
        tripData['tripDetails']['heroImage'] = heroImage;
        localStorage.setItem("tripData", JSON.stringify(tripData));


        clearInterval(loaderInterval);
        window.location.href = "/trip-details.html";
    } catch (error) {
        clearInterval(loaderInterval);
        console.error("Submission failed:", error);
        // Show error message to user
        document.getElementById('formContainer').classList.remove('d-none');
        document.getElementById('loaderContainer').classList.add('d-none');
    }
});

// Initialize first step and chips
document.addEventListener('DOMContentLoaded', () => {
    showStep(currentStep);
    initializeChips();
});

// Move to next step on Enter key press
document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        nextStep();
    }
});
