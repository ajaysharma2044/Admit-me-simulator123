# 🎓 Admit Me Simulator

An interactive web-based college admission predictor that helps students estimate their chances of admission to universities based on their academic profile and extracurricular activities.

## Features

- **Comprehensive Profile Evaluation**: Analyzes multiple factors including GPA, test scores, extracurriculars, essays, and more
- **Multi-Tier University Selection**: Choose between Safety, Target, or Reach schools
- **Real-time Probability Calculation**: Get instant admission probability percentages
- **Detailed Score Breakdown**: See how each component contributes to your overall score
- **Personalized Recommendations**: Receive actionable advice to improve your profile
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Beautiful UI**: Modern, gradient-based design with smooth animations

## How to Use

1. **Open the Application**: Simply open `index.html` in any modern web browser
2. **Fill in Your Profile**:
   - Enter your GPA (0.0 - 4.0)
   - Provide SAT scores (400-1600) and optionally ACT scores (1-36)
   - List your extracurricular activities and leadership positions
   - Rate your essay quality and recommendation letters (1-10)
   - Enter your volunteer hours
3. **Select University Tier**:
   - Safety: High acceptance rate schools
   - Target: Moderate acceptance rate schools
   - Reach: Low acceptance rate, highly selective schools
4. **Calculate**: Click "Calculate Admission Chances" to see your results
5. **Review Results**: Check your admission probability, score breakdown, and recommendations

## Scoring Algorithm

The simulator uses a weighted scoring system:

- **GPA** (30 points): Most important academic indicator
- **Test Scores** (25 points): SAT/ACT performance
- **Extracurricular Activities** (15 points): Breadth of involvement
- **Leadership** (10 points): Leadership roles and positions
- **Essay Quality** (10 points): Personal statement strength
- **Recommendations** (10 points): Teacher/counselor endorsements
- **Volunteer Hours** (5 points bonus): Community service involvement

The final probability is adjusted based on the university tier:
- Safety schools: 1.3x multiplier
- Target schools: 1.0x multiplier
- Reach schools: 0.6x multiplier

## Technical Details

- **Pure HTML/CSS/JavaScript**: No dependencies or frameworks required
- **Client-side Processing**: All calculations happen in your browser
- **Responsive Design**: Mobile-first approach with breakpoints
- **Modern Browser Support**: Works with Chrome, Firefox, Safari, Edge

## Educational Purpose

**Important**: This simulator is designed for educational and guidance purposes only. It does not guarantee actual admission results and should not be the sole factor in college application decisions. Actual admission processes involve many qualitative factors that cannot be fully captured in a simple algorithm.

## Files

- `index.html` - Main application structure
- `styles.css` - Styling and responsive design
- `script.js` - Admission probability calculation logic

## License

MIT License - Feel free to use and modify for educational purposes

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests to improve the simulator.

---

*For Educational Purposes Only - © 2025 Admit Me Simulator*