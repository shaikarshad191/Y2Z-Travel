# Y2Z Travel Itinerary Planner

A beautiful, interactive itinerary planner with smooth drag-and-drop functionality for reordering activities within each day of your trip.

## Features

- **Smooth Drag & Drop**: Reorder activities within each day with fluid animations
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Beautiful UI**: Modern design with gradient backgrounds and smooth transitions
- **Activity Cards**: Rich activity information including images, ratings, prices, and locations
- **Multi-Day Support**: Organize activities across multiple days
- **Real-time Updates**: Instant visual feedback during drag operations

## Tech Stack

- **Frontend Framework**: Next.js 14 with React 18
- **Styling**: Tailwind CSS with custom gradients and animations
- **Drag & Drop**: @dnd-kit for accessible, smooth drag-and-drop interactions
- **Animations**: Framer Motion for enhanced visual effects
- **UI Components**: shadcn/ui component library
- **Icons**: Lucide React icons
- **TypeScript**: Full type safety throughout the application

## Key Implementation Details

### Drag & Drop System
- Uses @dnd-kit for robust drag-and-drop functionality
- Implements vertical sorting within each day's activities
- Smooth animations with rotation and scaling effects during drag
- Keyboard accessibility support
- Touch-friendly for mobile devices

### Animation Features
- Staggered entrance animations for cards
- Smooth transitions during reordering
- Visual feedback with shadows and scaling
- Framer Motion integration for enhanced UX

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Optimized touch targets for mobile interaction
- Flexible grid layouts that adapt to screen size
- Custom scrollbar styling

## Getting Started

1. Clone the repository
2. Install dependencies: \`npm install\`
3. Run the development server: \`npm run dev\`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

- **Drag Activities**: Click and hold the grip handle (⋮⋮) on any activity card to start dragging
- **Reorder**: Drag activities up or down within the same day to reorder them
- **Visual Feedback**: Cards will show visual feedback during drag operations
- **Mobile**: Touch and drag works seamlessly on mobile devices

## Project Structure

\`\`\`
├── app/
│   ├── page.tsx              # Main itinerary page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   └── sortable-activity-card.tsx  # Draggable activity card component
└── README.md
\`\`\`

## Challenges Solved

1. **Smooth Animations**: Implemented custom CSS transitions combined with @dnd-kit's built-in animations
2. **Mobile Responsiveness**: Optimized touch interactions and responsive layouts
3. **Performance**: Used React.memo and optimized re-renders during drag operations
4. **Accessibility**: Maintained keyboard navigation and screen reader support
5. **Visual Polish**: Added subtle animations and hover effects for enhanced UX

## Future Enhancements

- Add activity to different days
- Time conflict detection
- Integration with real travel APIs
- Collaborative planning features
- Export to calendar applications

## Demo

The application demonstrates smooth, intuitive drag-and-drop functionality that matches modern travel planning applications. Activities can be easily reordered within each day with beautiful animations and immediate visual feedback.
