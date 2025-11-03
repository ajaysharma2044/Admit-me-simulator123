// Admission Simulator Logic

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('admissionForm');
    const results = document.getElementById('results');
    const resetBtn = document.getElementById('resetBtn');
    
    // Range input value display
    const essayQuality = document.getElementById('essayQuality');
    const essayValue = document.getElementById('essayValue');
    const recommendations = document.getElementById('recommendations');
    const recValue = document.getElementById('recValue');
    
    // Update range values in real-time
    essayQuality.addEventListener('input', function() {
        essayValue.textContent = this.value;
    });
    
    recommendations.addEventListener('input', function() {
        recValue.textContent = this.value;
    });
    
    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            const formData = getFormData();
            const prediction = calculateAdmissionProbability(formData);
            displayResults(prediction);
        }
    });
    
    // Reset button handler
    resetBtn.addEventListener('click', function() {
        results.classList.add('hidden');
        form.reset();
        essayValue.textContent = '5';
        recValue.textContent = '5';
        clearErrors();
    });
    
    // Form validation
    function validateForm() {
        clearErrors();
        let isValid = true;
        
        const gpa = parseFloat(document.getElementById('gpa').value);
        const satScore = parseInt(document.getElementById('satScore').value);
        const actScore = document.getElementById('actScore').value;
        const extracurriculars = parseInt(document.getElementById('extracurriculars').value);
        const leadership = parseInt(document.getElementById('leadership').value);
        const volunteerHours = parseInt(document.getElementById('volunteerHours').value);
        const tier = document.getElementById('universityTier').value;
        
        // GPA validation
        if (isNaN(gpa) || gpa < 0 || gpa > 4) {
            showError('gpaError', 'GPA must be between 0.0 and 4.0');
            isValid = false;
        }
        
        // SAT validation
        if (isNaN(satScore) || satScore < 400 || satScore > 1600) {
            showError('satError', 'SAT score must be between 400 and 1600');
            isValid = false;
        }
        
        // ACT validation (optional)
        if (actScore && (parseInt(actScore) < 1 || parseInt(actScore) > 36)) {
            showError('actError', 'ACT score must be between 1 and 36');
            isValid = false;
        }
        
        // Extracurriculars validation
        if (isNaN(extracurriculars) || extracurriculars < 0) {
            showError('extraError', 'Please enter a valid number');
            isValid = false;
        }
        
        // Leadership validation
        if (isNaN(leadership) || leadership < 0) {
            showError('leadershipError', 'Please enter a valid number');
            isValid = false;
        }
        
        // Volunteer hours validation
        if (isNaN(volunteerHours) || volunteerHours < 0) {
            showError('volunteerError', 'Please enter a valid number');
            isValid = false;
        }
        
        // Tier validation
        if (!tier) {
            showError('tierError', 'Please select a university tier');
            isValid = false;
        }
        
        return isValid;
    }
    
    function showError(elementId, message) {
        document.getElementById(elementId).textContent = message;
    }
    
    function clearErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
        });
    }
    
    function getFormData() {
        return {
            gpa: parseFloat(document.getElementById('gpa').value),
            satScore: parseInt(document.getElementById('satScore').value),
            actScore: document.getElementById('actScore').value ? parseInt(document.getElementById('actScore').value) : null,
            extracurriculars: parseInt(document.getElementById('extracurriculars').value),
            leadership: parseInt(document.getElementById('leadership').value),
            essayQuality: parseInt(document.getElementById('essayQuality').value),
            recommendations: parseInt(document.getElementById('recommendations').value),
            volunteerHours: parseInt(document.getElementById('volunteerHours').value),
            universityTier: document.getElementById('universityTier').value
        };
    }
    
    function calculateAdmissionProbability(data) {
        let baseScore = 0;
        let maxScore = 100;
        
        // GPA scoring (30 points max)
        const gpaScore = (data.gpa / 4.0) * 30;
        baseScore += gpaScore;
        
        // SAT/ACT scoring (25 points max)
        let testScore = 0;
        if (data.actScore) {
            // Convert ACT to equivalent weighting
            testScore = (data.actScore / 36) * 25;
        } else {
            testScore = ((data.satScore - 400) / 1200) * 25;
        }
        baseScore += testScore;
        
        // Extracurriculars (15 points max)
        const extraScore = Math.min(data.extracurriculars * 1.5, 15);
        baseScore += extraScore;
        
        // Leadership (10 points max)
        const leadershipScore = Math.min(data.leadership * 2, 10);
        baseScore += leadershipScore;
        
        // Essay quality (10 points max)
        const essayScore = data.essayQuality;
        baseScore += essayScore;
        
        // Recommendations (10 points max)
        const recScore = data.recommendations;
        baseScore += recScore;
        
        // Volunteer hours (bonus, max 5 points)
        const volunteerScore = Math.min(data.volunteerHours / 100, 5);
        baseScore += volunteerScore;
        
        // Adjust based on university tier
        let tierMultiplier = 1;
        let tierThreshold = 0;
        
        switch(data.universityTier) {
            case 'safety':
                tierMultiplier = 1.3;
                tierThreshold = 50;
                break;
            case 'target':
                tierMultiplier = 1.0;
                tierThreshold = 65;
                break;
            case 'reach':
                tierMultiplier = 0.6;
                tierThreshold = 80;
                break;
        }
        
        // Calculate final probability
        let probability = (baseScore / maxScore) * 100 * tierMultiplier;
        probability = Math.min(Math.max(probability, 0), 100); // Clamp between 0-100
        
        // Generate breakdown
        const breakdown = {
            gpa: gpaScore.toFixed(1),
            test: testScore.toFixed(1),
            extracurriculars: extraScore.toFixed(1),
            leadership: leadershipScore.toFixed(1),
            essay: essayScore.toFixed(1),
            recommendations: recScore.toFixed(1),
            volunteer: volunteerScore.toFixed(1)
        };
        
        // Generate recommendations
        const recommendationsList = generateRecommendations(data, probability);
        
        return {
            probability: probability.toFixed(1),
            tier: data.universityTier,
            breakdown: breakdown,
            recommendations: recommendationsList
        };
    }
    
    function generateRecommendations(data, probability) {
        const recommendations = [];
        
        if (data.gpa < 3.5) {
            recommendations.push('Focus on improving your GPA - it\'s one of the most important factors');
        }
        
        if (data.satScore < 1200) {
            recommendations.push('Consider retaking the SAT/ACT to improve your test scores');
        }
        
        if (data.extracurriculars < 3) {
            recommendations.push('Get involved in more extracurricular activities that align with your interests');
        }
        
        if (data.leadership === 0) {
            recommendations.push('Seek leadership positions in your activities to stand out');
        }
        
        if (data.essayQuality < 7) {
            recommendations.push('Spend more time crafting a compelling personal essay');
        }
        
        if (data.recommendations < 7) {
            recommendations.push('Build stronger relationships with teachers for better recommendation letters');
        }
        
        if (data.volunteerHours < 50) {
            recommendations.push('Increase your community service involvement');
        }
        
        if (probability >= 70) {
            recommendations.push('You have a strong profile! Consider applying to reach schools as well');
        } else if (probability >= 40) {
            recommendations.push('Keep working on your profile and maintain your current achievements');
        } else {
            recommendations.push('Focus on safety schools while working to improve your overall profile');
        }
        
        if (data.universityTier === 'reach' && probability < 30) {
            recommendations.push('Consider adding more target and safety schools to your list');
        }
        
        return recommendations;
    }
    
    function displayResults(prediction) {
        const probabilityValue = document.getElementById('probabilityValue');
        const resultTitle = document.getElementById('resultTitle');
        const resultMessage = document.getElementById('resultMessage');
        const breakdownList = document.getElementById('breakdownList');
        const recommendationsList = document.getElementById('recommendationsList');
        
        // Set probability
        probabilityValue.textContent = prediction.probability + '%';
        
        // Set result title and message based on probability
        const prob = parseFloat(prediction.probability);
        let title, message, color;
        
        if (prob >= 70) {
            title = 'Excellent Chances!';
            message = 'You have a strong profile for this ' + prediction.tier + ' school. Your application is very competitive!';
            color = '#27ae60';
        } else if (prob >= 50) {
            title = 'Good Chances';
            message = 'You have a solid chance of admission to this ' + prediction.tier + ' school. Keep up the good work!';
            color = '#f39c12';
        } else if (prob >= 30) {
            title = 'Moderate Chances';
            message = 'You have a fair shot, but this ' + prediction.tier + ' school is competitive. Focus on improving your profile.';
            color = '#e67e22';
        } else {
            title = 'Challenging Prospects';
            message = 'Admission to this ' + prediction.tier + ' school will be difficult. Consider this a reach school and focus on improving.';
            color = '#e74c3c';
        }
        
        resultTitle.textContent = title;
        resultMessage.textContent = message;
        probabilityValue.style.color = color;
        
        // Display breakdown
        breakdownList.innerHTML = '';
        breakdownList.innerHTML += `<li><strong>GPA Score:</strong> ${prediction.breakdown.gpa}/30</li>`;
        breakdownList.innerHTML += `<li><strong>Test Score:</strong> ${prediction.breakdown.test}/25</li>`;
        breakdownList.innerHTML += `<li><strong>Extracurriculars:</strong> ${prediction.breakdown.extracurriculars}/15</li>`;
        breakdownList.innerHTML += `<li><strong>Leadership:</strong> ${prediction.breakdown.leadership}/10</li>`;
        breakdownList.innerHTML += `<li><strong>Essay Quality:</strong> ${prediction.breakdown.essay}/10</li>`;
        breakdownList.innerHTML += `<li><strong>Recommendations:</strong> ${prediction.breakdown.recommendations}/10</li>`;
        breakdownList.innerHTML += `<li><strong>Volunteer Work:</strong> ${prediction.breakdown.volunteer}/5</li>`;
        
        // Display recommendations
        recommendationsList.innerHTML = '';
        prediction.recommendations.forEach(rec => {
            recommendationsList.innerHTML += `<li>${rec}</li>`;
        });
        
        // Show results
        results.classList.remove('hidden');
        results.scrollIntoView({ behavior: 'smooth' });
    }
});
