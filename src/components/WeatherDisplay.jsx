export default function WeatherDisplay({ weather }) {
  const getWeatherIcon = (condition) => {
    const conditionLower = condition.toLowerCase()
    if (conditionLower.includes('cloud')) return '☁️'
    if (conditionLower.includes('rain')) return '🌧️'
    if (conditionLower.includes('snow')) return '❄️'
    if (conditionLower.includes('wind')) return '💨'
    if (conditionLower.includes('clear') || conditionLower.includes('sunny')) return '☀️'
    if (conditionLower.includes('storm')) return '⛈️'
    return '🌤️'
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 shadow-xl mb-6">
      <h2 className="text-2xl font-bold text-white mb-6">Weather Forecast</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Main Weather Card */}
        <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg p-6 border border-slate-600">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-slate-400 text-sm mb-2">{weather.date}</p>
              <p className="text-4xl font-bold text-white">{Math.round(weather.temperature)}°C</p>
              <p className="text-slate-300 text-lg capitalize mt-2">{weather.condition}</p>
            </div>
            <div className="text-6xl">{getWeatherIcon(weather.condition)}</div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
            <p className="text-slate-400 text-sm mb-1">Feels Like</p>
            <p className="text-2xl font-bold text-white">{Math.round(weather.feelsLike)}°C</p>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
            <p className="text-slate-400 text-sm mb-1">Humidity</p>
            <p className="text-2xl font-bold text-white">{weather.humidity}%</p>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
            <p className="text-slate-400 text-sm mb-1">Wind</p>
            <p className="text-2xl font-bold text-white">{weather.windSpeed} km/h</p>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
            <p className="text-slate-400 text-sm mb-1">Rain Chance</p>
            <p className="text-2xl font-bold text-white">{weather.rainChance}%</p>
          </div>
        </div>
      </div>

      {/* Weather Advisory */}
      {weather.rainChance > 60 && (
        <div className="mt-4 bg-blue-500/20 border border-blue-500/50 rounded-lg p-3 text-blue-200 text-sm">
          💧 High chance of rain — waterproof layer recommended
        </div>
      )}
      {weather.windSpeed > 30 && (
        <div className="mt-4 bg-orange-500/20 border border-orange-500/50 rounded-lg p-3 text-orange-200 text-sm">
          💨 Strong winds expected — consider a windproof outer layer
        </div>
      )}
    </div>
  )
}
