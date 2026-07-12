# ✂️ Tailor - Outfit Recommendation Engine

A modern web app that helps you decide what to wear based on weather, occasion, time of day, and your wardrobe. Get personalized outfit suggestions that consider clothing compatibility, layering, and color harmony.

## Features

- **Weather-Based Recommendations**: Automatically fetches weather data for your location
- **Occasion-Specific Suggestions**: Tailored outfits for work, casual, date, party, dinner, sports, and outdoor activities
- **Time-Aware Styling**: Different recommendations for morning, afternoon, evening, and night
- **Comprehensive Wardrobe Database**: Extensive catalog of men's clothing with detailed attributes
- **Smart Layering**: Intelligently combines layers based on temperature and compatibility
- **Color Harmony**: Ensures color coordination across outfit pieces
- **Multiple Outfit Variations**: Get 4 diverse outfit suggestions to choose from
- **Beautiful UI**: Modern, responsive design with a sleek dark theme

## Project Structure

```
tailor/
├── src/
│   ├── components/        # React components
│   │   ├── InputForm.jsx      # User input form
│   │   ├── WeatherDisplay.jsx # Weather information display
│   │   ├── OutfitCard.jsx     # Individual outfit card
│   │   └── OutfitList.jsx     # List of all outfit recommendations
│   ├── lib/               # Business logic
│   │   ├── recommendationEngine.js  # Core recommendation algorithm
│   │   └── weatherService.js        # Weather API integration
│   ├── data/              # Static data
│   │   └── wardrobe.json  # Comprehensive wardrobe database
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles (Tailwind)
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Pages deployment workflow
├── index.html             # HTML template
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
└── package.json           # Dependencies and scripts
```

## Data Structure

### Wardrobe Items
Each clothing item includes:
- **Category**: shirt, polo, t-shirt, overshirt, sweater, jacket, trousers, jeans, chinos, shorts, shoes
- **Color**: Item color
- **Material**: Fabric composition
- **Fit**: regular, slim, relaxed, tailored
- **Temperature Range**: Min/max suitable temperatures
- **Occasions**: work, casual, date, party, dinner, sports, outdoor
- **Time of Day**: morning, afternoon, evening, night
- **Layering Compatibility**: What pieces can be worn over/under

### Watch Types
- **Dress**: Formal occasions
- **Everyday**: Work and casual
- **Chronograph**: Sports and active
- **Dive**: Casual and outdoor

## Recommendation Algorithm

The engine generates 4 distinct outfit variations:

1. **Professional/Formal** - Business-appropriate look
2. **Casual/Relaxed** - Comfortable everyday style
3. **Layered/Weather-Appropriate** - Smart layering for changing conditions
4. **Statement/Adventurous** - Distinctive style choice

Each recommendation considers:
- Temperature appropriateness
- Occasion suitability
- Time of day fit
- Layering compatibility
- Color harmony
- Weather conditions (rain, wind)

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/tailor.git
cd tailor
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Add OpenWeatherMap API key for real weather data:
```bash
# Create a .env file
echo "VITE_OPENWEATHER_API_KEY=your_api_key_here" > .env
```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Production Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

### Deployment

The project includes GitHub Actions workflow for automatic deployment to GitHub Pages.

1. Push to the `main` branch
2. GitHub Actions will automatically build and deploy
3. Your app will be available at `https://yourusername.github.io/tailor/`

## Weather Integration

Currently, the app uses mock weather data for demonstration. To connect real weather data:

1. Get an API key from [OpenWeatherMap](https://openweathermap.org/api)
2. Add to your `.env` file: `VITE_OPENWEATHER_API_KEY=your_key`
3. Update `weatherService.js` to call the actual API

## Customization

### Adding Items to Wardrobe
Edit `src/data/wardrobe.json`:
```json
{
  "id": "shirt-custom",
  "category": "shirt",
  "description": "Custom shirt description",
  "color": "custom color",
  "material": "fabric type",
  "fit": "cut style",
  "type": "shirt type",
  "temperatureRange": [minTemp, maxTemp],
  "occasions": ["occasion1", "occasion2"],
  "timeOfDay": ["morning", "afternoon"],
  "layeringCompatibility": {
    "canWearOver": ["category"],
    "canLayerUnder": ["category"]
  },
  "colorHarmony": ["color1", "color2"]
}
```

### Modifying Recommendation Logic
Update `src/lib/recommendationEngine.js` to adjust:
- Number of outfit variations
- Selection criteria
- Temperature calculations
- Reason generation

### Styling
- Modify `src/index.css` for global styles
- Adjust Tailwind config in `tailwind.config.js`
- Component-level styling is inline with Tailwind classes

## Future Enhancements

- [ ] User wardrobe upload and customization
- [ ] Brand and product recommendations
- [ ] Outfit history and ratings
- [ ] Social sharing
- [ ] Mobile app
- [ ] Integration with e-commerce platforms
- [ ] AI-powered style suggestions
- [ ] Capsule wardrobe builder

## Tech Stack

- **Frontend**: React 18
- **Bundler**: Vite
- **Styling**: Tailwind CSS
- **Weather**: OpenWeatherMap API
- **Deployment**: GitHub Pages
- **Build Tool**: Vite with GitHub Actions

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ✨ for thoughtful dressing
