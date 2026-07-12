import OutfitCard from './OutfitCard'

export default function OutfitList({ outfits, occasion }) {
  if (!outfits || outfits.length === 0) {
    return null
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Your Outfit Ideas</h2>
        <p className="text-slate-400">
          {outfits.length} recommendation{outfits.length !== 1 ? 's' : ''} for {occasion}
        </p>
      </div>

      <div className="space-y-6">
        {outfits.map((outfit, idx) => (
          <OutfitCard key={idx} outfit={outfit} index={idx + 1} />
        ))}
      </div>
    </div>
  )
}
