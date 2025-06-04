"use client"

import { useState } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers"
import { Menu, Search, Filter, Calendar, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SortableActivityCard } from "./components/sortable-activity-card"
import { ActivityCard } from "./components/activity-card"
import { InteractiveMap } from "./components/interactive-map"
import { AnimatePresence, motion } from "framer-motion"

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
  coordinates: [number, number] // [latitude, longitude]
}

interface Day {
  id: string
  title: string
  date: string
  activities: Activity[]
}

const mockItinerary: Day[] = [
  {
    id: "day-1",
    title: "Day 1",
    date: "June 15, 2024",
    activities: [
      {
        id: "activity-1",
        title: "India Gate",
        description:
          "India Gate is a war memorial located in New Delhi, along the Rajpath. It is dedicated to the 70,000 soldiers, both Indian and British.",
        rating: 4.5,
        reviewCount: "201,124",
        location: "New Delhi",
        image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=300&fit=crop",
        category: "Monument",
        isLiked: false,
        isBookmarked: false,
        coordinates: [28.6129, 77.2295],
      },
      {
        id: "activity-2",
        title: "Red Fort",
        description:
          "The Red Fort is a historical fort in the old Delhi area, on the banks of Yamuna river, which served as the main residence of the Mughal Emperors.",
        rating: 4.3,
        reviewCount: "186,256",
        location: "Old Delhi",
        image: "https://cdn.britannica.com/20/189820-050-D650A54D/Red-Fort-Old-Delhi-India.jpg",
        category: "Historical",
        isLiked: true,
        isBookmarked: false,
        coordinates: [28.6562, 77.241],
      },
      {
        id: "activity-3",
        title: "Qutub Minar",
        description:
          "Qutub Minar is a minaret and victory tower located in the Qutub complex, a UNESCO World Heritage Site in Delhi's Mehrauli area.",
        rating: 4.2,
        reviewCount: "151,089",
        location: "Mehrauli",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Qutb_Minar_2022.jpg/1200px-Qutb_Minar_2022.jpg",
        category: "UNESCO Site",
        isLiked: false,
        isBookmarked: true,
        coordinates: [28.5245, 77.1855],
      },
    ],
  },
  {
    id: "day-2",
    title: "Day 2",
    date: "June 16, 2024",
    activities: [
      {
        id: "activity-4",
        title: "Lotus Temple",
        description:
          "Located in the national capital of New Delhi, the Lotus Temple is an edifice dedicated to the Baháʼí faith.",
        rating: 4.6,
        reviewCount: "97,772",
        location: "New Delhi",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
        category: "Religious",
        isLiked: false,
        isBookmarked: false,
        coordinates: [28.5535, 77.2588],
      },
      {
        id: "activity-5",
        title: "Humayun's Tomb",
        description: "Humayun's tomb is the final resting place of the Mughal Emperor Humayun in Delhi, India.",
        rating: 4.4,
        reviewCount: "86,024",
        location: "Delhi",
        image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=300&fit=crop",
        category: "Tomb",
        isLiked: false,
        isBookmarked: false,
        coordinates: [28.5933, 77.2507],
      },
      {
        id: "activity-6",
        title: "Akshardham Temple",
        description: "Swaminarayan Akshardham is a Hindu temple and spiritual-cultural campus in Delhi, India.",
        rating: 4.7,
        reviewCount: "124,567",
        location: "East Delhi",
        image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=300&fit=crop",
        category: "Temple",
        isLiked: true,
        isBookmarked: true,
        coordinates: [28.6127, 77.2773],
      },
    ],
  },
]

export default function ItineraryPlanner() {
  const [itinerary, setItinerary] = useState<Day[]>(mockItinerary)
  const [activeDay, setActiveDay] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeDayId, setActiveDayId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Reduced distance for easier activation
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragStart = (event: any) => {
    const { active } = event
    const dayId = active.data.current?.dayId
    setActiveDay(dayId)
    setActiveId(active.id as string)
    setActiveDayId(dayId)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveDay(null)
    setActiveId(null)
    setActiveDayId(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    if (activeId === overId) return

    const dayId = active.data.current?.dayId
    if (!dayId) return

    setItinerary((prev) => {
      return prev.map((day) => {
        if (day.id !== dayId) return day

        const oldIndex = day.activities.findIndex((activity) => activity.id === activeId)
        const newIndex = day.activities.findIndex((activity) => activity.id === overId)

        return {
          ...day,
          activities: arrayMove(day.activities, oldIndex, newIndex),
        }
      })
    })
  }

  const toggleLike = (activityId: string, dayId: string) => {
    setItinerary((prev) =>
      prev.map((day) =>
        day.id === dayId
          ? {
              ...day,
              activities: day.activities.map((activity) =>
                activity.id === activityId ? { ...activity, isLiked: !activity.isLiked } : activity,
              ),
            }
          : day,
      ),
    )
  }

  const toggleBookmark = (activityId: string, dayId: string) => {
    setItinerary((prev) =>
      prev.map((day) =>
        day.id === dayId
          ? {
              ...day,
              activities: day.activities.map((activity) =>
                activity.id === activityId ? { ...activity, isBookmarked: !activity.isBookmarked } : activity,
              ),
            }
          : day,
      ),
    )
  }

  // Get all activities for map
  const allActivities = itinerary.flatMap((day) => day.activities)

  // Find the active activity for the drag overlay
  const activeActivity = activeId
    ? itinerary.find((day) => day.id === activeDayId)?.activities.find((activity) => activity.id === activeId) || null
    : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      {/* Desktop Header */}
      <div className="hidden lg:block bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Y2Z TRAVEL
              </h1>
              <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>June 15-16, 2024</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>2 Travelers</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>New Delhi, India</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden bg-gradient-to-r from-pink-500 to-purple-600 text-white sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Menu className="w-6 h-6" />
            <h1 className="text-lg font-bold">Y2Z TRAVEL</h1>
            <div className="w-6 h-6" />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/70"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Desktop: Side by side layout, Mobile: Stacked */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Itinerary Section */}
          <div className="lg:col-span-8">
            <div className="mb-6 lg:mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Your Itinerary</h2>
              <p className="text-gray-600">Click and drag anywhere on a card to reorder your activities</p>
            </div>

            <div className="space-y-6 lg:space-y-8">
              {itinerary.map((day, dayIndex) => (
                <motion.div
                  key={day.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: dayIndex * 0.1 }}
                  className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  {/* Day Header */}
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 lg:p-6">
                    <h3 className="text-lg lg:text-xl font-bold">{day.title}</h3>
                    <p className="text-purple-100 text-sm lg:text-base">{day.date}</p>
                  </div>

                  {/* Activities */}
                  <div className="p-4 lg:p-6">
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
                    >
                      <SortableContext
                        items={day.activities.map((activity) => activity.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-3 lg:space-y-4">
                          <AnimatePresence>
                            {day.activities.map((activity, index) => (
                              <SortableActivityCard
                                key={activity.id}
                                activity={activity}
                                dayId={day.id}
                                index={index}
                                isActive={activeDay === day.id}
                                onToggleLike={toggleLike}
                                onToggleBookmark={toggleBookmark}
                                onActivityClick={setSelectedActivity}
                              />
                            ))}
                          </AnimatePresence>
                        </div>
                      </SortableContext>

                      <DragOverlay>
                        {activeActivity ? (
                          <div className="opacity-95 w-full max-w-full">
                            <ActivityCard
                              activity={activeActivity}
                              onToggleLike={() => {}}
                              onToggleBookmark={() => {}}
                              onActivityClick={() => {}}
                              isDragging={true}
                            />
                          </div>
                        ) : null}
                      </DragOverlay>
                    </DndContext>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar - Only visible on desktop */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              {/* Trip Summary */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Trip Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Activities</span>
                    <span className="font-medium">
                      {itinerary.reduce((total, day) => total + day.activities.length, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">{itinerary.length} Days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Liked Activities</span>
                    <span className="font-medium">
                      {itinerary.reduce(
                        (total, day) => total + day.activities.filter((activity) => activity.isLiked).length,
                        0,
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Interactive Map */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Map View</h3>
                <InteractiveMap
                  activities={allActivities}
                  selectedActivity={selectedActivity}
                  onActivitySelect={setSelectedActivity}
                />
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    Save Itinerary
                  </Button>
                  <Button variant="outline" className="w-full">
                    Share Trip
                  </Button>
                  <Button variant="outline" className="w-full">
                    Export PDF
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Map Section */}
        <div className="lg:hidden mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Map View</h3>
          <InteractiveMap
            activities={allActivities}
            selectedActivity={selectedActivity}
            onActivitySelect={setSelectedActivity}
          />
        </div>

        {/* Mobile Quick Actions */}
        <div className="lg:hidden mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="grid grid-cols-2 gap-3">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              Save Itinerary
            </Button>
            <Button variant="outline">Share Trip</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
