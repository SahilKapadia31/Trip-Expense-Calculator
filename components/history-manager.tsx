"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { format } from "date-fns"
import { Clock, Upload, AlertTriangle, Trash, Trash2 } from "lucide-react"
import type { TripData } from "./trip-expense-calculator"
import { Badge } from "@/components/ui/badge"
import { useMobile } from "@/hooks/use-mobile"

interface HistoryManagerProps {
  history: TripData[]
  onLoadTrip: (trip: TripData) => void
  onClearTrip: () => void
  onDeleteTrip?: (tripId: string) => void
  onClearAllHistory?: () => void
}

export const HistoryManager = ({
  history,
  onLoadTrip,
  onClearTrip,
  onDeleteTrip = () => { },
  onClearAllHistory = () => { }
}: HistoryManagerProps) => {
  const [confirmLoadId, setConfirmLoadId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [confirmClearAll, setConfirmClearAll] = useState(false)
  const isMobile = useMobile()

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy h:mm a")
    } catch (e) {
      return "Unknown date"
    }
  }

  const getCurrencySymbol = (currency: string): string => {
    switch (currency) {
      case "USD":
        return "$"
      case "EUR":
        return "€"
      case "GBP":
        return "£"
      case "INR":
        return "₹"
      case "JPY":
        return "¥"
      case "CAD":
        return "$"
      case "AUD":
        return "$"
      default:
        return "₹"
    }
  }

  const handleLoadTrip = (trip: TripData) => {
    onLoadTrip(trip)
    setConfirmLoadId(null)
  }

  const handleDeleteTrip = (tripId: string) => {
    onDeleteTrip(tripId)
    setConfirmDeleteId(null)
  }

  const handleClearAllHistory = () => {
    onClearAllHistory()
    setConfirmClearAll(false)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center sm:gap-0">
        <h2 className="flex items-center text-lg font-semibold sm:text-xl">
          <Clock className="w-4 h-4 mr-2 sm:h-5 sm:w-5" />
          Trip History
        </h2>
        <div className="flex gap-2">
          <AlertDialog open={confirmClearAll} onOpenChange={setConfirmClearAll}>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs sm:text-sm">
                <Trash2 className="w-3 h-3 mr-1 sm:h-4 sm:w-4 sm:mr-2" />
                Clear History
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="w-[90%] max-w-md mx-auto">
              <AlertDialogHeader>
                <AlertDialogTitle>Clear all history?</AlertDialogTitle>
                <AlertDialogDescription className="text-xs sm:text-sm">
                  This will permanently delete all saved trips. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="h-8 text-xs sm:text-sm sm:h-10">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearAllHistory} className="h-8 text-xs sm:text-sm sm:h-10">
                  Clear All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs sm:text-sm">
                <AlertTriangle className="w-3 h-3 mr-1 sm:h-4 sm:w-4 sm:mr-2" />
                New Trip
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="w-[90%] max-w-md mx-auto">
              <AlertDialogHeader>
                <AlertDialogTitle>Start a new trip?</AlertDialogTitle>
                <AlertDialogDescription className="text-xs sm:text-sm">
                  This will clear all current data. Make sure to save your current trip first if you want to keep it.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="h-8 text-xs sm:text-sm sm:h-10">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onClearTrip} className="h-8 text-xs sm:text-sm sm:h-10">
                  Clear and Start New
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {history.length === 0 ? (
        <Card>
          <CardContent className="p-4 text-center sm:p-6">
            <p className="text-sm italic text-gray-500">No saved trips yet. Save your current trip to see it here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2 sm:space-y-4">
          {history.map((trip) => (
            <Card key={trip.id} className="overflow-hidden">
              <CardHeader className="p-3 pb-1 sm:p-4 sm:pb-2">
                <CardTitle className="flex items-center justify-between text-base sm:text-lg">
                  <span className="line-clamp-1">{trip.name}</span>
                  <Badge variant="outline" className="px-1 py-0 ml-2 text-xs sm:px-2">
                    {trip.currency} {getCurrencySymbol(trip.currency)}
                  </Badge>
                </CardTitle>
                <p className="text-xs text-gray-500 sm:text-sm">{formatDate(trip.date)}</p>
              </CardHeader>
              <CardContent className="px-3 pt-0 pb-1 sm:px-4 sm:pb-2">
                <div className="grid grid-cols-2 gap-1 text-xs sm:gap-2 sm:text-sm">
                  <div>
                    <span className="text-gray-500">Friends:</span> {trip.friends.length}
                  </div>
                  <div>
                    <span className="text-gray-500">Expenses:</span> {trip.expenses.length}
                  </div>
                  {!isMobile && (
                    <div>
                      <span className="text-gray-500">Categories:</span> {trip.categories.length}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 p-3 pt-1 sm:p-4 sm:pt-2">
                <AlertDialog open={confirmDeleteId === trip.id} onOpenChange={(open) => !open && setConfirmDeleteId(null)}>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setConfirmDeleteId(trip.id)}
                      className="text-xs h-7"
                    >
                      <Trash className="w-3 h-3 mr-1 sm:h-4 sm:w-4 sm:mr-2" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="w-[90%] max-w-md mx-auto">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this trip?</AlertDialogTitle>
                      <AlertDialogDescription className="text-xs sm:text-sm">
                        This will permanently delete the trip "{trip.name}". This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="h-8 text-xs sm:text-sm sm:h-10">Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteTrip(trip.id)}
                        className="h-8 text-xs sm:text-sm sm:h-10"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <AlertDialog open={confirmLoadId === trip.id} onOpenChange={(open) => !open && setConfirmLoadId(null)}>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setConfirmLoadId(trip.id)}
                      className="text-xs h-7"
                    >
                      <Upload className="w-3 h-3 mr-1 sm:h-4 sm:w-4 sm:mr-2" />
                      Load
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="w-[90%] max-w-md mx-auto">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Load this trip?</AlertDialogTitle>
                      <AlertDialogDescription className="text-xs sm:text-sm">
                        This will replace your current data with the saved trip "{trip.name}". Make sure to save your
                        current trip first if you want to keep it.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="h-8 text-xs sm:text-sm sm:h-10">Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleLoadTrip(trip)}
                        className="h-8 text-xs sm:text-sm sm:h-10"
                      >
                        Load Trip
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
