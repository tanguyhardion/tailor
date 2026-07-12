import wardrobeData from '../data/wardrobe.json' with { type: 'json' };

// Helper: Determine times of day from hour range
export function getTimesOfDay(startHour, endHour) {
  const times = [];
  // Ensure hours are in 0-23 range
  const start = startHour % 24;
  const end = endHour % 24;

  const checkHour = (h) => {
    if (h >= 6 && h < 12) return "morning";
    if (h >= 12 && h < 18) return "afternoon";
    if (h >= 18 && h < 22) return "evening";
    return "night";
  };

  // If start <= end, loop normally
  if (start <= end) {
    for (let h = start; h <= end; h++) {
      const t = checkHour(h);
      if (!times.includes(t)) times.push(t);
    }
  } else {
    // Over midnight
    for (let h = start; h < 24; h++) {
      const t = checkHour(h);
      if (!times.includes(t)) times.push(t);
    }
    for (let h = 0; h <= end; h++) {
      const t = checkHour(h);
      if (!times.includes(t)) times.push(t);
    }
  }

  return times;
}

// Select watch based on outfit styling and occasion
export function recommendWatch(outfit, occasion, rainProbability) {
  // Estimate formalness of outfit on a scale of 0 to 8
  let formalness = 0;
  
  // Top
  if (outfit.top.category_id === 2) formalness += 2; // shirt
  else if (outfit.top.category_id === 3) formalness += 1; // polo
  
  // Bottom
  if (outfit.bottom.name.includes("wool trousers")) formalness += 3;
  else if (outfit.bottom.name.includes("chinos")) formalness += 2;
  else if (outfit.bottom.name.includes("jeans")) formalness += 0;
  
  // Shoes
  if (outfit.shoes.name.includes("Oxford")) formalness += 3;
  else if (outfit.shoes.name.includes("Loafers") || outfit.shoes.name.includes("Chelsea")) formalness += 2;
  else formalness += 0; // Sneakers

  // If raining, or casual occasion, dive watch is a strong match
  if (rainProbability > 40 || occasion === "casual") {
    return {
      type: "Dive Watch"
    };
  }

  // Formal dinner/work
  if (formalness >= 6 || occasion === "dinner") {
    return {
      type: "Dress Watch"
    };
  }

  // Smart casual work or date
  if (occasion === "work" || (formalness >= 3 && formalness < 6)) {
    return {
      type: "Everyday Watch"
    };
  }

  // Date, Party, or stylish casual
  return {
    type: "Chronograph"
  };
}


// Core Recommender Function
export function getOutfitRecommendations(weather, occasion, startHour, endHour) {
  const categories = wardrobeData.categories;
  const colors = wardrobeData.colors;
  const materials = wardrobeData.materials;
  const fits = wardrobeData.fits;
  const items = wardrobeData.items;

  const timesOfDay = getTimesOfDay(startHour, endHour);
  const temp = weather.temperature;
  const rainProb = weather.rainProbability;

  // Resolve item colors, categories, and materials for convenience
  const hydItems = items.map(item => {
    const cat = categories.find(c => c.id === item.category_id);
    const col = colors.find(c => c.id === item.color_id);
    const mat = materials.find(m => m.id === item.material_id);
    const fit = fits.find(f => f.id === item.fit_id);
    return {
      ...item,
      categoryName: cat ? cat.name : "",
      categoryType: cat ? cat.type : "",
      color: col,
      material: mat,
      fit: fit
    };
  });

  // Split items into category pools
  const topsPool = hydItems.filter(i => i.categoryType === "top");
  const bottomsPool = hydItems.filter(i => i.categoryType === "bottom");
  const shoesPool = hydItems.filter(i => i.categoryType === "shoes");
  const layersPool = hydItems.filter(i => i.categoryType === "layer");

  // Determine target CLO based on temperature
  // CLO is insulation rating.
  let targetClo = 0.55; // Default mild
  if (temp >= 26) targetClo = 0.35; // Hot
  else if (temp >= 20 && temp < 26) targetClo = 0.50; // Warm
  else if (temp >= 14 && temp < 20) targetClo = 0.75; // Mild/Cool
  else if (temp >= 8 && temp < 14) targetClo = 1.05; // Cool/Cold
  else targetClo = 1.35; // Cold

  const scoredOutfits = [];

  // Generate combinations
  for (const top of topsPool) {
    for (const bottom of bottomsPool) {
      for (const shoes of shoesPool) {
        // We can either have no layer, or one layer
        const layerOptions = [null, ...layersPool];

        for (const layer of layerOptions) {
          let score = 100; // Base score
          const reasons = [];

          // 1. Warmth (CLO) Score
          // Outfit CLO is sum of pieces. Layering traps air, so we apply 1.1x factor for layers.
          const topClo = top.clo_value;
          const bottomClo = bottom.clo_value;
          const shoesClo = shoes.clo_value;
          const layerClo = layer ? layer.clo_value * 1.1 : 0;
          const totalClo = topClo + bottomClo + shoesClo + layerClo;

          const cloDiff = Math.abs(totalClo - targetClo);
          // Deduct points for deviance from target CLO
          const tempDeduction = Math.round(cloDiff * 150);
          score -= tempDeduction;

          // Special rules for layering based on temp
          if (temp >= 25 && layer) {
            // Heat: layer is penalized heavily
            score -= 50;
          }
          if (temp < 12 && !layer) {
            // Cold: no layer is penalized heavily
            score -= 50;
          }

          // 2. Rain Score
          if (rainProb > 40) {
            // Suede is bad in rain
            if (shoes.material.name === "suede") {
              score -= 45;
            }
            // Oxford leather dress shoes or sneakers? Oxford/boots are good. Chelsea boots are best.
            if (shoes.categoryName === "shoes" && shoes.name.includes("Chelsea")) {
              score += 15;
            }
            // Need water-resistant layer if raining
            if (layer) {
              if (layer.name.includes("water-resistant") || layer.name.includes("waxed")) {
                score += 30;
              } else {
                score -= 10; // Cotton/wool gets wet
              }
            } else {
              score -= 20; // No layer in rain is bad
            }
          }

          // 3. Occasion Compatibility
          // Top
          if (top.suitable_occasions.includes(occasion)) score += 15;
          else score -= 35;

          // Bottom
          if (bottom.suitable_occasions.includes(occasion)) score += 15;
          else score -= 35;

          // Shoes
          if (shoes.suitable_occasions.includes(occasion)) score += 15;
          else score -= 35;

          // Layer (if exists)
          if (layer) {
            if (layer.suitable_occasions.includes(occasion)) score += 15;
            else score -= 35;
          }

          // 4. Time of Day Score
          // Check if items support the target times of day
          let timeMatch = true;
          for (const t of timesOfDay) {
            if (!top.suitable_times.includes(t)) timeMatch = false;
            if (!bottom.suitable_times.includes(t)) timeMatch = false;
            if (!shoes.suitable_times.includes(t)) timeMatch = false;
            if (layer && !layer.suitable_times.includes(t)) timeMatch = false;
          }
          if (timeMatch) score += 10;
          else score -= 10;

          // 5. Styling & Material compatibility
          // Polos cannot be layered under jackets/sweaters in this engine
          if (top.categoryName === "polo" && layer) {
            score -= 60;
          }

          // Linen shirt under wool coat or trench coat is bad styling (winter coat over summer linen)
          if (top.material.name === "linen" && layer && (layer.material.name === "wool" || layer.name.includes("trench"))) {
            score -= 40;
          }

          // Flannel shirt shouldn't go under a thin overshirt
          if (top.material.name === "flannel" && layer && layer.categoryName === "overshirt") {
            score -= 30;
          }

          // Oxford dress shoes with t-shirt or relaxed jeans is a clash
          if (shoes.name.includes("dress shoes")) {
            if (top.categoryName === "t-shirt") score -= 45;
            if (bottom.name.includes("relaxed-fit")) score -= 40;
          }

          // 6. Color Harmony Score
          const topCol = top.color;
          const bottomCol = bottom.color;
          const layerColObj = layer ? layer.color : null;

          // Avoid same color top and bottom (unless both black or both beige linen)
          if (topCol.id === bottomCol.id) {
            if (topCol.name === "black") {
              score += 10; // Sleek all-black
            } else if (topCol.name === "beige" && top.material.name === "linen" && bottom.material.name === "linen") {
              score += 15; // Luxury summer resort look
            } else {
              score -= 35; // Clash
            }
          } else {
            // Contrast bonus (e.g. Light top, Dark bottom)
            if (
              (topCol.group === "neutral_light" && bottomCol.group === "neutral_dark") ||
              (topCol.group === "accent" && bottomCol.group === "neutral_dark")
            ) {
              score += 15;
            }
            // Classic menswear color combinations
            // Olive + Beige
            if ((topCol.name === "olive" && bottomCol.name === "beige") || (topCol.name === "beige" && bottomCol.name === "olive")) {
              score += 10;
            }
            // Navy + Tan/Beige
            if ((topCol.name === "navy" && (bottomCol.name === "beige" || bottomCol.name === "tan")) || 
                ((topCol.name === "beige" || topCol.name === "tan") && bottomCol.name === "navy")) {
              score += 10;
            }
            // Sky Blue + Navy
            if (topCol.name === "sky_blue" && bottomCol.name === "navy") {
              score += 15;
            }
          }

          // Layer color harmony
          if (layerColObj) {
            // Avoid layer matching top (e.g., grey t-shirt + grey sweater looks uniform)
            if (layerColObj.id === topCol.id) {
              score -= 15;
            }
            // Avoid layer matching bottom (unless black)
            if (layerColObj.id === bottomCol.id && layerColObj.name !== "black") {
              score -= 15;
            }
          }

          // Rule of Three (Max 3 distinct colors)
          const colorsInOutfit = new Set();
          colorsInOutfit.add(topCol.name);
          colorsInOutfit.add(bottomCol.name);
          colorsInOutfit.add(shoes.color.name);
          if (layerColObj) colorsInOutfit.add(layerColObj.name);

          if (colorsInOutfit.size <= 3) {
            score += 10;
          } else {
            score -= 15;
          }

          // Compile outfit object
          const outfitObj = {
            top,
            layer,
            bottom,
            shoes,
            topColor: topCol,
            bottomColor: bottomCol,
            layerColor: layerColObj,
            totalClo,
            targetClo,
            cloDiff,
            score
          };

          scoredOutfits.push(outfitObj);
        }
      }
    }
  }

  // Sort outfits by score descending
  scoredOutfits.sort((a, b) => b.score - a.score);

  // Take the top combinations and format them
  // We want to ensure variety, so we don't return 5 outfits that are almost identical (e.g. only difference is shoes)
  const uniqueRecommendations = [];
  const seenCombinations = new Set();

  for (const o of scoredOutfits) {
    // Generate a unique signature for this outfit based on top category + layer category + bottom category + shoes
    const signature = `${o.top.name}-${o.layer ? o.layer.name : 'none'}-${o.bottom.name}`;
    
    if (!seenCombinations.has(signature)) {
      seenCombinations.add(signature);
      
      const watch = recommendWatch(o, occasion, rainProb);
      
      uniqueRecommendations.push({
        top: o.top,
        layer: o.layer,
        bottom: o.bottom,
        shoes: o.shoes,
        watch,
        score: o.score,
        totalClo: o.totalClo,
        targetClo: o.targetClo
      });
    }

    if (uniqueRecommendations.length >= 5) break;
  }

  return uniqueRecommendations;
}
