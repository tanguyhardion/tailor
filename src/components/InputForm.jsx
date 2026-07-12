import { useState } from 'react'

export default function InputForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    location: '',
    date: '',
    startTime: '09:00',
    endTime: '17:00',
    occasion: 'casual',
  })

  const occasions = ['casual', 'work', 'date', 'party', 'dinner', 'sports', 'outdoor']

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.location || !formData.date) {
      alert('Please fill in location and date')
      return
    }
    onSubmit(formData)
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6">What's the Plan?</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Location
          </label>
          <input
            type="text"
            name="location"
            placeholder="e.g., New York, London, Tokyo"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Time Range */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Start Time
            </label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              End Time
            </label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Occasion */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Occasion
          </label>
          <select
            name="occasion"
            value={formData.occasion}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            {occasions.map(occ => (
              <option key={occ} value={occ}>
                {occ.charAt(0).toUpperCase() + occ.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
        >
          {loading ? 'Generating...' : 'Get Outfit Ideas'}
        </button>
      </form>
    </div>
  )
}
