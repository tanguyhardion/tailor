import { useState, useCallback } from 'react'
import InputForm from './components/InputForm'
import WeatherDisplay from './components/WeatherDisplay'
import OutfitList from './components/OutfitList'
import { getWeather } from './lib/weatherService'
import { generateOutfitRecommendations } from './lib/recommendationEngine'

function App() {
  const [weather, setWeather] = useState(null)
  const [outfits, setOutfits] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState(null)

  const handleSubmit = useCallback(async (data) => {
    setLoading(true)
    setError(null)
    setFormData(data)
    
    try {
      // Fetch weather data
      const weatherData = await getWeather(data.location, data.date, data.startTime)
      setWeather(weatherData)

      // Generate outfit recommendations
      const recommendations = generateOutfitRecommendations(
        weatherData,
        data.occasion,
        data.startTime,
        data.endTime
      )
      setOutfits(recommendations)
    } catch (err) {
      setError(err.message || 'Failed to generate recommendations')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-2">
            ✂️ Tailor
          </h1>
          <p className="text-slate-400 text-lg">
            Perfect outfits for any occasion
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <InputForm onSubmit={handleSubmit} loading={loading} />
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6 text-red-200">
                {error}
              </div>
            )}

            {loading && (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4 mx-auto"></div>
                  <p className="text-slate-300">Generating recommendations...</p>
                </div>
              </div>
            )}

            {weather && !loading && (
              <>
                <WeatherDisplay weather={weather} />
                <OutfitList outfits={outfits} occasion={formData?.occasion} />
              </>
            )}

            {!weather && !loading && !error && (
              <div className="text-center text-slate-400 mt-16">
                <p className="text-lg">Enter your details to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
