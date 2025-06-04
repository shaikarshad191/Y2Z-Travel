"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Heart, Bookmark, MoreHorizontal, GripVertical } from "lucide-react"
import { motion } from "framer-motion"

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

interface SortableActivityCardProps {
  activity: Activity
  dayId: string
  index: number
  isActive: boolean
  onToggleLike: (activityId: string, dayId: string) => void
  onToggleBookmark: (activityId: string, dayId: string) => void
  onActivityClick: (activity: Activity) => void
}

const categoryColors = {
  Monument: "bg-blue-100 text-blue-800",
  Historical: "bg-orange-100 text-orange-800",
  "UNESCO Site": "bg-green-100 text-green-800",
  Religious: "bg-purple-100 text-purple-800",
  Tomb: "bg-red-100 text-red-800",
  Temple: "bg-pink-100 text-pink-800",
}

export function SortableActivityCard({
  activity,
  dayId,
  index,
  isActive,
  onToggleLike,
  onToggleBookmark,
  onActivityClick,
}: SortableActivityCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: activity.id,
    data: {
      dayId: dayId,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 250ms cubic-bezier(0.2, 0, 0, 1)",
    zIndex: isDragging ? 50 : 0,
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.05 }}
      className={`group ${isDragging ? "z-50" : ""}`}
      {...attributes}
      {...listeners}
    >
      <Card
        className={`
          transition-all duration-200 border border-gray-200 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing
          ${
            isDragging
              ? "shadow-xl ring-2 ring-purple-300 bg-white scale-[1.02]"
              : "hover:shadow-md hover:border-purple-200 hover:scale-[1.01]"
          }
          ${isActive && !isDragging ? "ring-1 ring-purple-200" : ""}
        `}
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
              {/* Drag Handle Indicator */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none">
                <GripVertical className="w-5 h-5 text-white/0 group-hover:text-white/80 transition-colors drop-shadow-lg" />
              </div>
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-auto pointer-events-auto"
                  onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="w-4 h-4 text-gray-400" />
                </Button>
              </div>

              <p className="text-gray-600 text-xs lg:text-sm leading-relaxed mb-3 line-clamp-2 pointer-events-none">
                {activity.description}
              </p>

              <div className="flex items-center justify-between mb-2">
                <Badge
                  variant="secondary"
                  className={`${categoryColors[activity.category as keyof typeof categoryColors]} text-xs pointer-events-none`}
                >
                  {activity.category}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-gray-500 pointer-events-none">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{activity.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-auto pointer-events-auto"
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      onToggleLike(activity.id, dayId)
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
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
                    className="p-1 h-auto pointer-events-auto"
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      onToggleBookmark(activity.id, dayId)
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
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

          {/* Drag Indicator */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-1 shadow-sm">
              <GripVertical className="w-3 h-3 text-gray-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
