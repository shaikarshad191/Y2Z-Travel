"use client"

import { useState, useEffect } from "react"
import { MapPin, Navigation, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Activity {
  id: string
  title: string
  description: string
  rating: number
  reviewCount: string
  location: string
  image: string
  category: string
  isLiked: boolean
  isBookmarked: boolean
  coordinates: [number, number]
}

interface InteractiveMapProps {
  activities: Activity[]
  selectedActivity: Activity | null
  onActivitySelect: (activity: Activity) => void
}

export function InteractiveMap({ activities, selectedActivity, onActivitySelect }: InteractiveMapProps) {
  const [mapCenter, setMapCenter] = useState<[number, number]>([28.6139, 77.209]) // Delhi center
  const [zoomLevel, setZoomLevel] = useState(11)

  // Calculate bounds to fit all activities
  const calculateBounds = () => {
    if (activities.length === 0) return

    const lats = activities.map((a) => a.coordinates[0])
    const lngs = activities.map((a) => a.coordinates[1])

    const minLat = Math.min(...lats)
    const maxLat = Math.max(...lats)
    const minLng = Math.min(...lngs)
    const maxLng = Math.max(...lngs)

    const centerLat = (minLat + maxLat) / 2
    const centerLng = (minLng + maxLng) / 2

    setMapCenter([centerLat, centerLng])
  }

  useEffect(() => {
    calculateBounds()
  }, [activities])

  // Convert coordinates to SVG positions
  const coordinateToSVG = (lat: number, lng: number) => {
    const svgWidth = 400
    const svgHeight = 300

    // Simple projection (not geographically accurate but good for demo)
    const x = ((lng - (mapCenter[1] - 0.1)) / 0.2) * svgWidth
    const y = ((mapCenter[0] + 0.1 - lat) / 0.2) * svgHeight

    return { x: Math.max(20, Math.min(svgWidth - 20, x)), y: Math.max(20, Math.min(svgHeight - 20, y)) }
  }

  const handleZoomIn = () => setZoomLevel(Math.min(zoomLevel + 1, 15))
  const handleZoomOut = () => setZoomLevel(Math.max(zoomLevel - 1, 8))

  return (
    <div className="relative">
      {/* Map Container */}
      <div className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-xl overflow-hidden border border-gray-200">
        <svg
          viewBox="0 0 400 300"
          className="w-full h-64 lg:h-80"
          style={{
            background: `
              radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 70% 80%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
              linear-gradient(135deg, #f0f9ff 0%, #ecfdf5 100%)
            `,
          }}
        >
          {/* Background grid */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="0.5" opacity="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Roads/paths */}
          <path
            d="M 50 150 Q 200 100 350 150 Q 300 200 200 250 Q 100 200 50 150"
            fill="none"
            stroke="#d1d5db"
            strokeWidth="3"
            opacity="0.6"
          />
          <path d="M 100 50 Q 200 150 300 250" fill="none" stroke="#d1d5db" strokeWidth="2" opacity="0.4" />

          {/* Activity markers */}
          {activities.map((activity, index) => {
            const { x, y } = coordinateToSVG(activity.coordinates[0], activity.coordinates[1])
            const isSelected = selectedActivity?.id === activity.id

            return (
              <g key={activity.id}>
                {/* Marker shadow */}
                <circle
                  cx={x + 1}
                  cy={y + 1}
                  r={isSelected ? "12" : "8"}
                  fill="rgba(0,0,0,0.2)"
                  className="transition-all duration-200"
                />
                {/* Marker */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? "12" : "8"}
                  fill={isSelected ? "#8b5cf6" : "#3b82f6"}
                  stroke="white"
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-200 hover:scale-110"
                  onClick={() => onActivitySelect(activity)}
                />
                {/* Marker icon */}
                <text
                  x={x}
                  y={y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="8"
                  fontWeight="bold"
                  className="pointer-events-none"
                >
                  {index + 1}
                </text>
                {/* Activity label */}
                {isSelected && (
                  <g>
                    <rect
                      x={x - 40}
                      y={y - 35}
                      width="80"
                      height="20"
                      rx="10"
                      fill="white"
                      stroke="#8b5cf6"
                      strokeWidth="1"
                      className="drop-shadow-sm"
                    />
                    <text
                      x={x}
                      y={y - 25}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#374151"
                      fontSize="10"
                      fontWeight="500"
                      className="pointer-events-none"
                    >
                      {activity.title.length > 12 ? activity.title.substring(0, 12) + "..." : activity.title}
                    </text>
                  </g>
                )}
              </g>
            )
          })}

          {/* Route lines between activities */}
          {activities.length > 1 &&
            activities.slice(0, -1).map((activity, index) => {
              const start = coordinateToSVG(activity.coordinates[0], activity.coordinates[1])
              const end = coordinateToSVG(activities[index + 1].coordinates[0], activities[index + 1].coordinates[1])

              return (
                <line
                  key={`route-${index}`}
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke="#8b5cf6"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  opacity="0.6"
                />
              )
            })}
        </svg>

        {/* Map controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button size="sm" variant="secondary" onClick={handleZoomIn} className="w-8 h-8 p-0">
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="secondary" onClick={handleZoomOut} className="w-8 h-8 p-0">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="secondary" onClick={calculateBounds} className="w-8 h-8 p-0">
            <Navigation className="w-4 h-4" />
          </Button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-xs">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Activity Location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span>Selected</span>
          </div>
        </div>
      </div>

      {/* Selected Activity Info */}
      {selectedActivity && (
        <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
          <div className="flex items-start gap-3">
            <img
              src={selectedActivity.image || "/placeholder.svg"}
              alt={selectedActivity.title}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{selectedActivity.title}</h4>
              <div className="flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3 text-gray-500" />
                <span className="text-sm text-gray-600">{selectedActivity.location}</span>
              </div>
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">{selectedActivity.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
