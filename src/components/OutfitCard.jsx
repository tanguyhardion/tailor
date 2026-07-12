export default function OutfitCard({ outfit, index }) {
  const getCategoryEmoji = (category) => {
    const emojis = {
      shirt: '👔',
      polo: '🎽',
      tshirt: '👕',
      overshirt: '🧥',
      sweater: '🧶',
      jacket: '🧥',
      trousers: '👖',
      jeans: '👖',
      chinos: '👖',
      shorts: '🩳',
      shoes: '👞',
      sneakers: '👟',
      boots: '🥾',
      dress_shoes: '👞',
      watch: '⌚',
    }
    return emojis[category] || '👕'
  }

  const getTemperatureIndicator = (range) => {
    if (range[1] < 10) return '🥶 Cold'
    if (range[0] > 25) return '🔥 Hot'
    return '😊 Mild'
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Outfit {index}</h3>
        <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
          {getTemperatureIndicator(outfit.temperatureRange)}
        </span>
      </div>

      {/* Clothing Items */}
      <div className="space-y-3 mb-6">
        {outfit.top && (
          <div className="flex items-start gap-3 bg-slate-700/50 rounded-lg p-3 border border-slate-600">
            <span className="text-2xl">{getCategoryEmoji(outfit.top.category)}</span>
            <div className="flex-1">
              <p className="text-slate-400 text-sm">Top</p>
              <p className="text-white font-medium">{outfit.top.description}</p>
              <p className="text-slate-500 text-xs mt-1">
                {outfit.top.color} • {outfit.top.material}
              </p>
            </div>
          </div>
        )}

        {outfit.layer && (
          <div className="flex items-start gap-3 bg-slate-700/50 rounded-lg p-3 border border-slate-600">
            <span className="text-2xl">{getCategoryEmoji(outfit.layer.category)}</span>
            <div className="flex-1">
              <p className="text-slate-400 text-sm">Layer</p>
              <p className="text-white font-medium">{outfit.layer.description}</p>
              <p className="text-slate-500 text-xs mt-1">
                {outfit.layer.color} • {outfit.layer.material}
              </p>
            </div>
          </div>
        )}

        {outfit.bottom && (
          <div className="flex items-start gap-3 bg-slate-700/50 rounded-lg p-3 border border-slate-600">
            <span className="text-2xl">{getCategoryEmoji(outfit.bottom.category)}</span>
            <div className="flex-1">
              <p className="text-slate-400 text-sm">Bottom</p>
              <p className="text-white font-medium">{outfit.bottom.description}</p>
              <p className="text-slate-500 text-xs mt-1">
                {outfit.bottom.color} • {outfit.bottom.fit}
              </p>
            </div>
          </div>
        )}

        {outfit.shoes && (
          <div className="flex items-start gap-3 bg-slate-700/50 rounded-lg p-3 border border-slate-600">
            <span className="text-2xl">{getCategoryEmoji(outfit.shoes.category)}</span>
            <div className="flex-1">
              <p className="text-slate-400 text-sm">Shoes</p>
              <p className="text-white font-medium">{outfit.shoes.description}</p>
              <p className="text-slate-500 text-xs mt-1">
                {outfit.shoes.color} • {outfit.shoes.material}
              </p>
            </div>
          </div>
        )}

        {outfit.watch && (
          <div className="flex items-start gap-3 bg-slate-700/50 rounded-lg p-3 border border-slate-600">
            <span className="text-2xl">⌚</span>
            <div className="flex-1">
              <p className="text-slate-400 text-sm">Watch</p>
              <p className="text-white font-medium">{outfit.watch.type} Watch</p>
              <p className="text-slate-500 text-xs mt-1">{outfit.watch.color}</p>
            </div>
          </div>
        )}
      </div>

      {/* Reason */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <p className="text-slate-300 text-sm leading-relaxed">
          <span className="font-semibold text-blue-400">Why this outfit?</span>
          <br />
          {outfit.reason}
        </p>
      </div>

      {/* Tags */}
      <div className="mt-4 flex flex-wrap gap-2">
        {outfit.tags && outfit.tags.map((tag, idx) => (
          <span
            key={idx}
            className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full border border-slate-600"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
