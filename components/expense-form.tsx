"use client"

import type React from "react"

import { useState } from "react"
import type { Friend, Expense, Category } from "./trip-expense-calculator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Receipt } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { useMobile } from "@/hooks/use-mobile"

interface ExpenseFormProps {
  friends: Friend[]
  categories: Category[]
  onAddExpense: (expense: Expense) => void
}

export const ExpenseForm = ({ friends, categories, onAddExpense }: ExpenseFormProps) => {
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [paidBy, setPaidBy] = useState("")
  const [category, setCategory] = useState<string>(categories[0]?.id || "")
  const [participants, setParticipants] = useState<string[]>([])
  const [date, setDate] = useState<Date>(new Date())
  const [selectAll, setSelectAll] = useState(true)

  const isMobile = useMobile()

  // Add color hex function
  const getColorHex = (colorName: string): string => {
    // Map color names to hex values
    const colorMap: Record<string, string> = {
      slate: "#64748b",
      gray: "#6b7280",
      zinc: "#71717a",
      red: "#ef4444",
      orange: "#f97316",
      amber: "#f59e0b",
      yellow: "#eab308",
      lime: "#84cc16",
      green: "#22c55e",
      emerald: "#10b981",
      teal: "#14b8a6",
      cyan: "#06b6d4",
      sky: "#0ea5e9",
      blue: "#3b82f6",
      violet: "#8b5cf6",
      purple: "#a855f7",
      fuchsia: "#d946ef",
      pink: "#ec4899",
      rose: "#f43f5e"
    };
    return colorMap[colorName] || "#3b82f6"; // Default to blue
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!description.trim() || !amount || !paidBy || participants.length === 0) {
      return
    }

    onAddExpense({
      id: uuidv4(),
      description,
      amount: Number.parseFloat(amount),
      paidBy,
      category,
      participants,
      date,
    })

    // Reset form
    setDescription("")
    setAmount("")
    setPaidBy("")
    setCategory(categories[0]?.id || "")
    setParticipants([])
    setDate(new Date())
  }

  const toggleSelectAll = () => {
    if (selectAll) {
      setParticipants([])
    } else {
      setParticipants(friends.map((friend) => friend.id))
    }
    setSelectAll(!selectAll)
  }

  const toggleParticipant = (friendId: string) => {
    if (participants.includes(friendId)) {
      setParticipants(participants.filter((id) => id !== friendId))
      setSelectAll(false)
    } else {
      setParticipants([...participants, friendId])
      if (participants.length + 1 === friends.length) {
        setSelectAll(true)
      }
    }
  }

  // Filter participants based on category
  const getEligibleParticipants = () => {
    if (category === "food-veg") {
      // Both vegetarians and non-vegetarians can eat veg food
      return friends
    } else if (category === "food-non-veg") {
      // Only non-vegetarians can eat non-veg food
      return friends.filter((friend) => !friend.isVegetarian)
    } else if (category === "drinks") {
      // Only drinkers can consume alcohol
      return friends.filter((friend) => friend.isDrinker)
    } else {
      // Other categories are for everyone
      return friends
    }
  }

  const eligibleParticipants = getEligibleParticipants()

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 flex items-center">
        <Receipt className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
        Add New Expense
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="description" className="text-sm sm:text-base">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What was this expense for?"
              required
              className="h-8 sm:h-10 text-sm"
            />
          </div>

          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="amount" className="text-sm sm:text-base">Amount</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
              className="h-8 sm:h-10 text-sm"
            />
          </div>

          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="paidBy" className="text-sm sm:text-base">Paid By</Label>
            <Select value={paidBy} onValueChange={setPaidBy} required>
              <SelectTrigger id="paidBy" className="h-8 sm:h-10 text-sm">
                <SelectValue placeholder="Who paid?" />
              </SelectTrigger>
              <SelectContent>
                {friends.map((friend) => (
                  <SelectItem key={friend.id} value={friend.id}>
                    {friend.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="category" className="text-sm sm:text-base">Category</Label>
            <Select
              value={category}
              onValueChange={(value: string) => {
                setCategory(value)
                // Reset participants when category changes
                setParticipants([])
                setSelectAll(false)
              }}
            >
              <SelectTrigger id="category" className="h-8 sm:h-10 text-sm">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: getColorHex(cat.color) }}
                      ></div>
                      {cat.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="date" className="text-sm sm:text-base">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal h-8 sm:h-10 text-xs sm:text-sm"
                >
                  <CalendarIcon className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm sm:text-base">Participants</Label>
            {eligibleParticipants.length > 0 && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="selectAll"
                  checked={selectAll}
                  onCheckedChange={toggleSelectAll}
                  className="h-4 w-4 sm:h-5 sm:w-5"
                />
                <Label htmlFor="selectAll" className="text-xs sm:text-sm">
                  Select All
                </Label>
              </div>
            )}
          </div>

          {eligibleParticipants.length === 0 ? (
            <p className="text-amber-600 text-xs sm:text-sm">No eligible participants for this category based on preferences.</p>
          ) : (
            <div className="grid grid-cols-2 mt-10 sm:grid-cols-3 gap-1 sm:gap-2">
              {eligibleParticipants.map((friend) => (
                <div key={friend.id} className="flex items-center space-x-1 sm:space-x-2">
                  <Checkbox
                    id={`participant-${friend.id}`}
                    checked={participants.includes(friend.id)}
                    onCheckedChange={() => toggleParticipant(friend.id)}
                    className="h-4 w-4 sm:h-5 sm:w-5"
                  />
                  <Label
                    htmlFor={`participant-${friend.id}`}
                    className="text-sm"
                  >
                    {friend.name}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={!description.trim() || !amount || !paidBy || participants.length === 0}
          size={isMobile ? "sm" : "default"}
          className="mt-2"
        >
          Add Expense
        </Button>
      </form>
    </div>
  )
}
