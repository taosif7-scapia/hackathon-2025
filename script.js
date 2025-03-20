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
            tripDetails: `${document.getElementById("startDate").value} to ${document.getElementById("endDate").value}`,
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
        tripDetails: `${document.getElementById("startDate").value} to ${document.getElementById("endDate").value}`,
        travelers: document.getElementById("travelers").value,
        preferences: document.getElementById("preferences").value,
        budget: document.getElementById("budget").value
    };

    console.log("Submitting:", formData);

    try {
        const response = await fetch("https://3o9fqxdqy6.execute-api.ap-south-1.amazonaws.com/api/brochure/v1/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        console.log(result);

        // Redirect after successful submission
        window.location.href = "/itinerary";
    } catch (error) {
        console.error("Submission failed:", error);
    }
});

// Initialize first step
showStep(currentStep);
