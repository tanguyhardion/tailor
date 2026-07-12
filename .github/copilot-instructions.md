# Tailor - Outfit Recommendation Engine

**Project**: Modern web app for personalized outfit recommendations
**Tech Stack**: React 18, Vite, Tailwind CSS, OpenWeatherMap API
**Status**: Fully scaffolded and ready for development

## Project Overview

Tailor helps users decide what to wear by:
1. Collecting location, date, time, and occasion
2. Fetching weather for that location/time
3. Generating 3-5 outfit suggestions from an extensive wardrobe database
4. Considering weather, occasion, time of day, layering, and color harmony

## Architecture

### Frontend Components
- `InputForm` - User input collection
- `WeatherDisplay` - Weather information presentation
- `OutfitCard` - Individual outfit display
- `OutfitList` - Outfit recommendations grid

### Business Logic
- `recommendationEngine.js` - Core recommendation algorithm with 4 outfit variations
- `weatherService.js` - Weather API integration (mock data for demo)

### Data
- `wardrobe.json` - Relational database of men's clothing items (50+ items, 8 watches)

## Key Features

✅ Weather-based recommendations
✅ Occasion-specific styling
✅ Smart layering logic
✅ Color harmony matching
✅ Time-aware suggestions
✅ Modular, extensible code
✅ Beautiful modern UI
✅ GitHub Pages deployment ready

## Data Model

### Clothing Items Include:
- Category (shirt, polo, t-shirt, overshirt, sweater, jacket, trousers, jeans, chinos, shorts, shoes)
- Color, material, fit
- Temperature range
- Occasions (work, casual, date, party, dinner, sports, outdoor)
- Time of day preferences
- Layering compatibility
- Color harmony rules

### Outfit Structure:
```
{
  top,
  layer (optional),
  bottom,
  shoes,
  watch (Dress, Everyday, Chronograph, or Dive),
  reason,
  tags
}
```

## Installation & Development

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## Customization Paths

1. **Expand Wardrobe** - Add more items to `src/data/wardrobe.json`
2. **Adjust Algorithm** - Modify `src/lib/recommendationEngine.js`
3. **Add Weather Data** - Connect OpenWeatherMap API in `weatherService.js`
4. **Style Updates** - Tailwind config in `tailwind.config.js`
5. **Database Migration** - Ready for future relational DB migration

## GitHub Pages Deployment

- Configured in `vite.config.js` with base path `/tailor/`
- Automatic deployment via GitHub Actions on push to `main`
- Workflow: `.github/workflows/deploy.yml`

## Future Enhancements

- User wardrobe management
- Persistent recommendations history
- Mobile app
- AI-powered styling
- E-commerce integration
- Social features
