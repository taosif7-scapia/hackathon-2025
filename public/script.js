let currentStep = 1;
const totalSteps = 6;

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
        "Budget & Accommodation",
        "Review & Submit"
    ];
    document.getElementById("step-title").innerText = titles[step - 1];

    // Update button visibility
    document.getElementById("prevBtn").disabled = step === 1;
    document.getElementById("nextBtn").classList.toggle("d-none", step === totalSteps);
    document.getElementById("submitBtn").classList.toggle("d-none", step !== totalSteps);

    // Show JSON summary at last step
    if (step === totalSteps) {
        const data = {
            destination: document.getElementById("destination").value,
            tripDetails: document.getElementById("dateRange").value,
            travelers: document.getElementById("travelers").value,
            preferences: document.getElementById("preferences").value,
            budget: document.getElementById("budget").value
        };
        document.getElementById("jsonOutput").textContent = JSON.stringify(data, null, 2);
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

// Handle form submission
document.getElementById("travelForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = {
        destination: document.getElementById("destination").value,
        tripDetails: document.getElementById("dateRange").value,
        travelers: document.getElementById("travelers").value,
        preferences: document.getElementById("preferences").value,
        budget: document.getElementById("budget").value
    };

    console.log("Submitting:", formData);

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
        localStorage.setItem("tripData", JSON.stringify(tripData));

        // Redirect after successful submission
        window.location.href = "/trip-details.html";
    } catch (error) {
        console.error("Submission failed:", error);
    }
});

// Initialize first step
showStep(currentStep);

// Move to next step on Enter key press
document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        nextStep();
    }
});
