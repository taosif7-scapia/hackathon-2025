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
            role: "system",
            content: `I need you to output to me a travel itinerary. It should be in the exact format specified below. Output should not contain any other text. Travel itinerary format is given as JSON as follows:
            {
                "tripDetails": {
                    "destination": "",
                    "regions": [],
                    "tripName": "",
                    "startDate": "",
                    "endDate": "",
                    "duration": "",
                    "travelers": [
                        {
                            "name": "",
                            "relationship": ""
                        }
                    ],
                    "tripType": "",
                    "tripStyle": ""
                },
                "overview": {
                    "description": "",
                    "weatherInfo": {
                        "seasonDescription": "",
                        "temperatureRange": "",
                        "climateNotes": "",
                        "weatherConsiderations": ""
                    },
                    "keyHighlights": []
                },
                "dailyItinerary": [
                    {
                        "day": 0,
                        "title": "",
                        "location": "",
                        "locationMapUrl": "",
                        "transportation": {
                            "mode": "",
                            "duration": "",
                            "distance": "",
                            "notes": ""
                        },
                        "description": "",
                        "activities": [],
                        "specialHighlight": {
                            "title": "",
                            "description": ""
                        },
                        "accommodationOptions": [
                            {
                                "name": "",
                                "description": "",
                                "amenities": [],
                                "priceRange": "",
                                "bestFor": ""
                            }
                        ],
                        "foodSpots": [
                            {
                                "name": "",
                                "type": "",
                                "specialty": "",
                                "priceRange": "",
                                "mealTime": "",
                                "notes": ""
                            }
                        ]
                    }
                ],
                "keyExperiences": [
                    {
                        "title": "",
                        "icon": "",
                        "category": "",
                        "description": "",
                        "details": [
                            {
                                "type": "",
                                "info": ""
                            }
                        ],
                        "locations": []
                    }
                ],
                "practicalInfo": {
                    "transportation": [
                        {
                            "type": "",
                            "details": "",
                            "costRange": ""
                        }
                    ],
                    "weather": [
                        {
                            "period": "",
                            "conditions": "",
                            "considerations": ""
                        }
                    ],
                    "diningRecommendations": [
                        {
                            "type": "",
                            "recommendations": "",
                            "notes": ""
                        }
                    ],
                    "packingEssentials": [
                        {
                            "category": "",
                            "items": "",
                            "notes": ""
                        }
                    ],
                    "localTips": [
                        {
                            "category": "",
                            "tip": ""
                        }
                    ],
                    "healthAndSafety": [
                        {
                            "category": "",
                            "information": ""
                        }
                    ],
                    "connectivity": {
                        "internetAccess": "",
                        "localSim": "",
                        "usefulApps": []
                    },
                    "moneyMatters": {
                        "currency": "",
                        "paymentMethods": "",
                        "budgetingTips": "",
                        "tipping": ""
                    }
                }
            }`
        },
        {
            role: "user",
            content: `Generate a travel itinerary based on the following details: ${JSON.stringify(formData)}`
        },
        {
            role: "system",
            content: "Now please generate itinerary in requested format. Output should not contain any other text. Itinerary should be adjusted for number of days according to the travel dates provided in the input. So number of items in the dailyItinerary key list should be equal to number of days of travel. Please make sure all keys are present and have non null values, so deserialization doesn't break"
        }
    ];

    const requestBody = {
        model: "gpt-3.5-turbo", // Change to "gpt-4-turbo" if needed
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
        console.log(result);

        // Display the response from ChatGPT
        document.getElementById("jsonOutput").textContent = JSON.stringify(result, null, 2);

        // Redirect after successful submission
        // window.location.href = "/itinerary";
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
