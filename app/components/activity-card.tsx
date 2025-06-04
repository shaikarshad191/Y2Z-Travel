"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Heart, Bookmark, MoreHorizontal } from "lucide-react"

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

interface ActivityCardProps {
  activity: Activity
  onToggleLike: (activityId: string, dayId: string) => void
  onToggleBookmark: (activityId: string, dayId: string) => void
  onActivityClick: (activity: Activity) => void
  isDragging?: boolean
}

const categoryColors = {
  Monument: "bg-blue-100 text-blue-800",
  Historical: "bg-orange-100 text-orange-800",
  "UNESCO Site": "bg-green-100 text-green-800",
  Religious: "bg-purple-100 text-purple-800",
  Tomb: "bg-red-100 text-red-800",
  Temple: "bg-pink-100 text-pink-800",
}

export function ActivityCard({
  activity,
  onToggleLike,
  onToggleBookmark,
  onActivityClick,
  isDragging = false,
}: ActivityCardProps) {
  return (
    <Card
      className={`
        transition-all duration-200 border border-gray-200 rounded-xl overflow-hidden cursor-pointer
        ${isDragging ? "shadow-xl ring-2 ring-purple-300 bg-white scale-[1.02]" : "hover:shadow-md hover:border-purple-200"}
      `}
      onClick={() => onActivityClick(activity)}
    >
      <CardContent className="p-0">
        <div className="flex">
          {/* Activity Image */}
          <div className="flex-shrink-0 relative">
            <img
              src={activity.image || "/placeholder.svg"}
              alt={activity.title}
              className="w-24 h-24 lg:w-32 lg:h-32 object-cover"
              loading="lazy"
            />
          </div>

          {/* Activity Details */}
          <div className="flex-1 p-3 lg:p-4 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-base lg:text-lg leading-tight truncate">
                  {activity.title}
                </h3>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-600">{activity.rating}</span>
                  <span className="text-xs text-gray-400">({activity.reviewCount})</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="p-1 h-auto" onClick={(e) => e.stopPropagation()}>
                <MoreHorizontal className="w-4 h-4 text-gray-400" />
              </Button>
            </div>

            <p className="text-gray-600 text-xs lg:text-sm leading-relaxed mb-3 line-clamp-2">{activity.description}</p>

            <div className="flex items-center justify-between mb-2">
              <Badge
                variant="secondary"
                className={`${categoryColors[activity.category as keyof typeof categoryColors]} text-xs`}
              >
                {activity.category}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{activity.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-auto"
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleLike(activity.id, "")
                  }}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      activity.isLiked ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-400"
                    }`}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-auto"
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleBookmark(activity.id, "")
                  }}
                >
                  <Bookmark
                    className={`w-4 h-4 ${
                      activity.isBookmarked ? "fill-blue-500 text-blue-500" : "text-gray-400 hover:text-blue-400"
                    }`}
                  />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
