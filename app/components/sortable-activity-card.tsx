"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
}

interface SortableActivityCardProps {
  activity: Activity
  dayId: string
  index: number
  isActive: boolean
  onToggleLike: (activityId: string, dayId: string) => void
  onToggleBookmark: (activityId: string, dayId: string) => void
}

export function SortableActivityCard({
  activity,
  dayId,
  index,
  isActive,
  onToggleLike,
  onToggleBookmark,
}: SortableActivityCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: activity.id,
    data: {
      dayId: dayId,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 200ms ease",
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
    >
      <Card
        className={`
          transition-all duration-200 hover:shadow-md border border-gray-200 rounded-xl overflow-hidden
          ${isDragging ? "shadow-2xl scale-105 rotate-1 bg-white" : "hover:scale-[1.02]"}
          ${isActive && !isDragging ? "ring-2 ring-purple-200" : ""}
        `}
      >
        <CardContent className="p-0">
          <div className="flex">
            {/* Activity Image */}
            <div className="flex-shrink-0 relative">
              <img
                src={activity.image || "/placeholder.svg?height=100&width=100"}
                alt={activity.title}
                className="w-24 h-24 object-cover"
              />
              {/* Drag Handle Overlay */}
              <div
                {...attributes}
                {...listeners}
                className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/10 transition-colors cursor-grab active:cursor-grabbing"
              >
                <GripVertical className="w-5 h-5 text-white/0 group-hover:text-white/70 transition-colors" />
              </div>
            </div>

            {/* Activity Details */}
            <div className="flex-1 p-3 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-base leading-tight truncate">{activity.title}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600">{activity.rating}</span>
                    <span className="text-xs text-gray-400">({activity.reviewCount})</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="p-1 h-auto">
                  <MoreHorizontal className="w-4 h-4 text-gray-400" />
                </Button>
              </div>

              <p className="text-gray-600 text-xs leading-relaxed mb-3 line-clamp-2">{activity.description}</p>

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
                    onClick={() => onToggleLike(activity.id, dayId)}
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
                    onClick={() => onToggleBookmark(activity.id, dayId)}
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
    </motion.div>
  )
}
