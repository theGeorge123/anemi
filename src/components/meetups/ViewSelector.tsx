"use client"

interface ViewSelectorProps {
  selectedView: 'map' | 'list' | null
  onViewSelect: (view: 'map' | 'list') => void
}

export function ViewSelector({ selectedView, onViewSelect }: ViewSelectorProps) {
  const viewOptions = [
    {
      id: 'map',
      title: '🗺️ Op de kaart',
      description: 'Bekijk cafes op een interactieve kaart',
      icon: '🗺️',
      features: ['Visuele locatie', 'Makkelijke navigatie', 'Overzicht van de buurt']
    },
    {
      id: 'list',
      title: '📋 In een lijst',
      description: 'Bekijk alle cafes in een overzichtelijke lijst',
      icon: '📋',
      features: ['Gedetailleerde info', 'Eenvoudig vergelijken', 'Snelle selectie']
    }
  ]

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">🔍 Hoe wil je cafes bekijken?</h3>
        <p className="text-gray-600">Kies je voorkeur voor het ontdekken van cafes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {viewOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onViewSelect(option.id as 'map' | 'list')}
            className={`p-6 text-center border rounded-lg transition-all hover:scale-105 ${
              selectedView === option.id
                ? 'bg-amber-100 border-amber-500 text-amber-700 shadow-md'
                : 'bg-white border-gray-200 hover:border-amber-300 hover:shadow-sm'
            }`}
          >
            <div className="text-4xl mb-3">{option.icon}</div>
            <div className="font-semibold text-lg mb-2">{option.title}</div>
            <div className="text-sm text-gray-600 mb-4">{option.description}</div>
            
            <div className="text-left space-y-1">
              {option.features.map((feature, index) => (
                <div key={index} className="text-xs text-gray-500 flex items-center">
                  <span className="text-green-500 mr-1">✓</span>
                  {feature}
                </div>
              ))}
            </div>
          </button>
        ))}
      </div>

      {selectedView && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Gekozen:</span> {selectedView === 'map' ? 'Kaart weergave' : 'Lijst weergave'}
          </p>
        </div>
      )}
    </div>
  )
} 