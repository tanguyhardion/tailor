import wardrobe from '../data/wardrobe.json'

/**
 * Recommendation Engine
 * Generates outfit recommendations based on weather, occasion, and time of day
 */

const OUTFIT_COUNT = 4 // Number of outfits to recommend

/**
 * Main function to generate outfit recommendations
 */
export function generateOutfitRecommendations(weather, occasion, startTime, endTime) {
  const outfits = []
  
  // Get filtered items based on weather and occasion
  const availableItems = filterItemsByContext(weather, occasion, startTime, endTime)
  
  // Generate diverse outfits
  const outfitVariations = [
    generateOutfitVariation1(availableItems, weather, occasion, startTime),
    generateOutfitVariation2(availableItems, weather, occasion, startTime),
    generateOutfitVariation3(availableItems, weather, occasion, startTime),
    generateOutfitVariation4(availableItems, weather, occasion, startTime),
  ]
  
  return outfitVariations.filter(outfit => outfit !== null)
}

/**
 * Filter clothing items based on weather, occasion, and time of day
 */
function filterItemsByContext(weather, occasion, startTime, endTime) {
  const hour = parseInt(startTime.split(':')[0])
  const timeOfDay = getTimeOfDay(hour)
  
  return {
    tops: wardrobe.items
      .filter(item => ['shirt', 'polo', 'tshirt'].includes(item.category))
      .filter(item => item.occasions.includes(occasion))
      .filter(item => item.timeOfDay.includes(timeOfDay))
      .filter(item => isTemperatureAppropriate(item, weather)),
    
    layers: wardrobe.items
      .filter(item => ['overshirt', 'sweater', 'jacket'].includes(item.category))
      .filter(item => item.occasions.includes(occasion) || item.occasions.includes('casual'))
      .filter(item => isTemperatureAppropriate(item, weather)),
    
    bottoms: wardrobe.items
      .filter(item => ['trousers', 'jeans', 'chinos', 'shorts'].includes(item.category))
      .filter(item => {
        // Shorts only for warm weather
        if (item.category === 'shorts' && weather.temperature < 18) return false
        return item.occasions.includes(occasion) || item.occasions.includes('casual')
      })
      .filter(item => isTemperatureAppropriate(item, weather)),
    
    shoes: wardrobe.items
      .filter(item => item.category === 'shoes')
      .filter(item => item.occasions.includes(occasion) || item.occasions.includes('casual'))
      .filter(item => isTemperatureAppropriate(item, weather)),
    
    watches: wardrobe.watches
      .filter(watch => watch.occasions.includes(occasion) || watch.occasions.includes('casual'))
  }
}

/**
 * Check if item temperature range matches weather
 */
function isTemperatureAppropriate(item, weather) {
  const [minTemp, maxTemp] = item.temperatureRange
  return weather.temperature >= minTemp && weather.temperature <= maxTemp
}

/**
 * Get time of day (morning, afternoon, evening, night)
 */
function getTimeOfDay(hour) {
  if (hour >= 5 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 18) return 'afternoon'
  if (hour >= 18 && hour < 21) return 'evening'
  return 'night'
}

/**
 * Get color harmony suggestions based on an item color
 */
function getHarmoniousItems(items, baseColor) {
  return items.filter(item => {
    if (!baseColor) return true
    if (item.colorHarmony.includes('any')) return true
    return item.colorHarmony.includes(item.color) || item.colorHarmony.includes(baseColor)
  })
}

/**
 * Variation 1: Professional/Formal look
 */
function generateOutfitVariation1(available, weather, occasion, startTime) {
  if (!available.tops.length || !available.bottoms.length || !available.shoes.length) {
    return null
  }

  const top = selectBestItem(
    available.tops.filter(item => ['shirt', 'polo'].includes(item.category)),
    weather
  )
  
  if (!top) return null

  const bottom = selectBestItem(
    available.bottoms.filter(item => ['trousers', 'chinos'].includes(item.category)),
    weather
  )
  
  if (!bottom) return null

  let layer = null
  if (weather.temperature < 15) {
    const compatibleLayers = available.layers.filter(item =>
      item.layeringCompatibility.canWearOver.some(cat =>
        top.category.includes(cat) || cat.includes(top.category)
      )
    )
    layer = selectBestItem(compatibleLayers, weather)
  }

  const shoes = selectBestItem(
    available.shoes.filter(item => item.type === 'formal' || item.type === 'casual'),
    weather
  )

  const watch = selectBestItem(
    available.watches.filter(w => w.type === 'Dress' || w.type === 'Everyday'),
    weather
  )

  if (!shoes || !watch) return null

  return {
    top,
    layer,
    bottom,
    shoes,
    watch: { type: watch.type, color: watch.color },
    temperatureRange: calculateOutfitTemperatureRange(top, layer, bottom),
    reason: generateOutfitReason('professional', weather, top, layer, bottom, shoes),
    tags: ['Professional', 'Timeless', 'Versatile']
  }
}

/**
 * Variation 2: Casual/Relaxed look
 */
function generateOutfitVariation2(available, weather, occasion, startTime) {
  if (!available.tops.length || !available.bottoms.length || !available.shoes.length) {
    return null
  }

  const top = selectBestItem(
    available.tops.filter(item => ['tshirt', 'polo'].includes(item.category)),
    weather
  )
  
  if (!top) return null

  const bottom = selectBestItem(
    available.bottoms.filter(item => ['jeans', 'chinos', 'shorts'].includes(item.category)),
    weather
  )
  
  if (!bottom) return null

  let layer = null
  if (weather.temperature < 18) {
    const compatibleLayers = available.layers.filter(item =>
      ['overshirt', 'sweater'].includes(item.category)
    )
    layer = selectBestItem(compatibleLayers, weather)
  }

  const shoes = selectBestItem(
    available.shoes.filter(item => item.type === 'casual'),
    weather
  )

  const watch = selectBestItem(
    available.watches.filter(w => w.type === 'Everyday' || w.type === 'Chronograph'),
    weather
  )

  if (!shoes || !watch) return null

  return {
    top,
    layer,
    bottom,
    shoes,
    watch: { type: watch.type, color: watch.color },
    temperatureRange: calculateOutfitTemperatureRange(top, layer, bottom),
    reason: generateOutfitReason('casual', weather, top, layer, bottom, shoes),
    tags: ['Casual', 'Comfortable', 'Effortless']
  }
}

/**
 * Variation 3: Layered/Weather-Appropriate look
 */
function generateOutfitVariation3(available, weather, occasion, startTime) {
  if (!available.layers.length) return null

  const layer = selectBestItem(available.layers, weather)
  if (!layer) return null

  // Find compatible tops for this layer
  const compatibleTops = available.tops.filter(item =>
    layer.layeringCompatibility.canWearOver.some(cat =>
      item.category.includes(cat) || cat.includes(item.category)
    )
  )

  if (!compatibleTops.length) return null
  const top = selectBestItem(compatibleTops, weather)

  const bottom = selectBestItem(available.bottoms, weather)
  if (!bottom) return null

  const shoes = selectBestItem(available.shoes, weather)
  if (!shoes) return null

  const watch = selectBestItem(available.watches, weather)
  if (!watch) return null

  return {
    top,
    layer,
    bottom,
    shoes,
    watch: { type: watch.type, color: watch.color },
    temperatureRange: calculateOutfitTemperatureRange(top, layer, bottom),
    reason: generateOutfitReason('layered', weather, top, layer, bottom, shoes),
    tags: ['Layered', 'Adaptable', 'Weather-Ready']
  }
}

/**
 * Variation 4: Statement/Adventurous look
 */
function generateOutfitVariation4(available, weather, occasion, startTime) {
  if (!available.tops.length || !available.bottoms.length || !available.shoes.length) {
    return null
  }

  // Pick items with different color schemes
  const tops = available.tops.sort(() => Math.random() - 0.5)
  const top = tops[0]
  if (!top) return null

  const bottoms = available.bottoms.sort(() => Math.random() - 0.5)
  const bottom = bottoms[0]
  if (!bottom) return null

  let layer = null
  if (weather.temperature < 16) {
    const compatibleLayers = available.layers.filter(item =>
      item.layeringCompatibility.canWearOver.some(cat =>
        top.category.includes(cat) || cat.includes(top.category)
      )
    )
    layer = selectBestItem(compatibleLayers, weather)
  }

  const shoes = selectBestItem(available.shoes, weather)
  const watch = selectBestItem(available.watches, weather)

  if (!shoes || !watch) return null

  return {
    top,
    layer,
    bottom,
    shoes,
    watch: { type: watch.type, color: watch.color },
    temperatureRange: calculateOutfitTemperatureRange(top, layer, bottom),
    reason: generateOutfitReason('statement', weather, top, layer, bottom, shoes),
    tags: ['Distinctive', 'Confident', 'Stylish']
  }
}

/**
 * Select the best item from a list based on temperature appropriateness
 */
function selectBestItem(items, weather) {
  if (!items.length) return null

  // Score items based on temperature fit
  const scored = items.map(item => {
    const [minTemp, maxTemp] = item.temperatureRange
    const optimalTemp = (minTemp + maxTemp) / 2
    const score = 100 - Math.abs(weather.temperature - optimalTemp)
    return { item, score }
  })

  // Sort by score and return the best one
  scored.sort((a, b) => b.score - a.score)
  return scored[0].item
}

/**
 * Calculate the effective temperature range of an outfit
 */
function calculateOutfitTemperatureRange(top, layer, bottom) {
  const ranges = [top.temperatureRange]
  if (layer) ranges.push(layer.temperatureRange)
  ranges.push(bottom.temperatureRange)

  const minTemp = Math.max(...ranges.map(r => r[0]))
  const maxTemp = Math.min(...ranges.map(r => r[1]))

  return [minTemp, maxTemp]
}

/**
 * Generate a reason why this outfit was selected
 */
function generateOutfitReason(style, weather, top, layer, bottom, shoes) {
  const reasons = {
    professional: [
      `Perfect for ${weather.condition.toLowerCase()} weather. The ${top.color} ${top.description.toLowerCase()} paired with ${bottom.color} ${bottom.category} creates a polished, work-appropriate look.`,
      `This combination works well in ${weather.condition.toLowerCase()} conditions. The ${top.description.toLowerCase()} is complemented by ${bottom.color} ${bottom.category} for a sharp appearance.`,
      `Ideal for professional settings in ${weather.condition.toLowerCase()} weather. The neutral ${top.color} top and structured bottom provide a refined silhouette.`,
    ],
    casual: [
      `Perfect for a relaxed day in ${weather.condition.toLowerCase()} weather. The ${top.color} ${top.description.toLowerCase()} pairs effortlessly with ${bottom.color} ${bottom.category}.`,
      `Great for casual outings when it's ${weather.condition.toLowerCase()}. The comfort of this combination makes it perfect for ${bottom.category}.`,
      `Laid-back and easy to wear in ${weather.condition.toLowerCase()} conditions. ${top.color.charAt(0).toUpperCase() + top.color.slice(1)} with ${bottom.color} is a timeless casual combo.`,
    ],
    layered: [
      `Smart layering for the ${weather.condition.toLowerCase()} weather. The ${layer.description.toLowerCase()} over the ${top.description.toLowerCase()} provides warmth and style in temperatures around ${weather.temperature}°C.`,
      `The ${layer.color} ${layer.description.toLowerCase()} adds versatility. Wear it open or closed depending on how the ${weather.condition.toLowerCase()} weather changes.`,
      `This layered approach is perfect for ${weather.condition.toLowerCase()} conditions. You can adapt by removing the ${layer.description.toLowerCase()} if you get warm.`,
    ],
    statement: [
      `Bold and confident for ${weather.condition.toLowerCase()} weather. The ${top.description.toLowerCase()} combined with ${bottom.color} ${bottom.category} shows personality.`,
      `Make a statement in ${weather.condition.toLowerCase()} conditions. This unexpected pairing of ${top.color} and ${bottom.color} is eye-catching yet wearable.`,
      `Stand out in ${weather.condition.toLowerCase()} weather with this distinctive combination. The ${top.color} top brings attention to this well-coordinated outfit.`,
    ],
  }

  const reasonList = reasons[style] || reasons.casual
  return reasonList[Math.floor(Math.random() * reasonList.length)]
}
