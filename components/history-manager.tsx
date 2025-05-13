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
import { Clock, Upload, AlertTriangle } from "lucide-react"
import type { TripData } from "./trip-expense-calculator"
import { Badge } from "@/components/ui/badge"
import { useMobile } from "@/hooks/use-mobile"

interface HistoryManagerProps {
  history: TripData[]
  onLoadTrip: (trip: TripData) => void
  onClearTrip: () => void
}

export const HistoryManager = ({ history, onLoadTrip, onClearTrip }: HistoryManagerProps) => {
  const [confirmLoadId, setConfirmLoadId] = useState<string | null>(null)
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

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <h2 className="text-lg sm:text-xl font-semibold flex items-center">
          <Clock className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          Trip History
        </h2>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs sm:text-sm h-8">
              <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
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
              <AlertDialogCancel className="text-xs sm:text-sm h-8 sm:h-10">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onClearTrip} className="text-xs sm:text-sm h-8 sm:h-10">
                Clear and Start New
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {history.length === 0 ? (
        <Card>
          <CardContent className="p-4 sm:p-6 text-center">
            <p className="text-gray-500 italic text-sm">No saved trips yet. Save your current trip to see it here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2 sm:space-y-4">
          {history.map((trip) => (
            <Card key={trip.id} className="overflow-hidden">
              <CardHeader className="p-3 pb-1 sm:p-4 sm:pb-2">
                <CardTitle className="text-base sm:text-lg flex justify-between items-center">
                  <span className="line-clamp-1">{trip.name}</span>
                  <Badge variant="outline" className="ml-2 text-xs px-1 sm:px-2 py-0">
                    {trip.currency} {getCurrencySymbol(trip.currency)}
                  </Badge>
                </CardTitle>
                <p className="text-xs sm:text-sm text-gray-500">{formatDate(trip.date)}</p>
              </CardHeader>
              <CardContent className="px-3 pt-0 pb-1 sm:px-4 sm:pb-2">
                <div className="grid grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm">
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
              <CardFooter className="p-3 pt-1 sm:p-4 sm:pt-2 flex justify-end">
                <AlertDialog open={confirmLoadId === trip.id} onOpenChange={(open) => !open && setConfirmLoadId(null)}>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setConfirmLoadId(trip.id)}
                      className="h-7 text-xs"
                    >
                      <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
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
                      <AlertDialogCancel className="text-xs sm:text-sm h-8 sm:h-10">Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleLoadTrip(trip)}
                        className="text-xs sm:text-sm h-8 sm:h-10"
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
