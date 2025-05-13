"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FriendsList } from "./friends-list"
import { ExpenseForm } from "./expense-form"
import { ExpensesList } from "./expenses-list"
import { SettlementSummary } from "./settlement-summary"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CategoryManager } from "./category-manager"
import { HistoryManager } from "./history-manager"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"
import { SaveIcon, HistoryIcon, Trash2Icon } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
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

export type Friend = {
  id: string
  name: string
  isVegetarian: boolean
  isDrinker: boolean
}

export type Category = {
  id: string
  name: string
  description: string
  color: string
}

export type Expense = {
  id: string
  description: string
  amount: number
  paidBy: string
  category: string
  participants: string[]
  date: Date
}

export type TripData = {
  id: string
  name: string
  date: string
  friends: Friend[]
  expenses: Expense[]
  categories: Category[]
  currency: string
}

export const TripExpenseCalculator = () => {
  const [friends, setFriends] = useState<Friend[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [activeTab, setActiveTab] = useState("friends")
  const [currency, setCurrency] = useState<string>("INR")
  const [tripName, setTripName] = useState<string>("")
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)
  const [history, setHistory] = useState<TripData[]>([])
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "food-veg",
      name: "Vegetarian Food",
      description: "Food suitable for vegetarians",
      color: "green",
    },
    {
      id: "food-non-veg",
      name: "Non-Vegetarian Food",
      description: "Food containing meat",
      color: "red",
    },
    {
      id: "drinks",
      name: "Alcoholic Drinks",
      description: "Alcoholic beverages",
      color: "amber",
    },
    {
      id: "shared-expenses",
      name: "Shared Expenses",
      description: "Expenses that are shared between friends",
      color: "slate",
    },
  ])

  const { toast } = useToast()
  const isMobile = useMobile()

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedFriends = localStorage.getItem("tripCalculator_friends")
    const savedExpenses = localStorage.getItem("tripCalculator_expenses")
    const savedCurrency = localStorage.getItem("tripCalculator_currency")
    const savedCategories = localStorage.getItem("tripCalculator_categories")
    const savedHistory = localStorage.getItem("tripCalculator_history")

    if (savedFriends) {
      setFriends(JSON.parse(savedFriends))
    }

    if (savedExpenses) {
      setExpenses(
        JSON.parse(savedExpenses).map((expense: any) => ({
          ...expense,
          date: new Date(expense.date),
        })),
      )
    }

    if (savedCurrency) {
      setCurrency(savedCurrency)
    }

    if (savedCategories) {
      setCategories(JSON.parse(savedCategories))
    }

    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("tripCalculator_friends", JSON.stringify(friends))
  }, [friends])

  useEffect(() => {
    localStorage.setItem("tripCalculator_expenses", JSON.stringify(expenses))
  }, [expenses])

  useEffect(() => {
    localStorage.setItem("tripCalculator_currency", currency)
  }, [currency])

  useEffect(() => {
    localStorage.setItem("tripCalculator_categories", JSON.stringify(categories))
  }, [categories])

  useEffect(() => {
    localStorage.setItem("tripCalculator_history", JSON.stringify(history))
  }, [history])

  const addFriend = (friend: Friend) => {
    setFriends([...friends, friend])
  }

  const updateFriend = (updatedFriend: Friend) => {
    setFriends(friends.map((friend) => (friend.id === updatedFriend.id ? updatedFriend : friend)))
  }

  const removeFriend = (id: string) => {
    setFriends(friends.filter((friend) => friend.id !== id))
    // Also remove this friend from all expenses' participants
    setExpenses(
      expenses.map((expense) => ({
        ...expense,
        participants: expense.participants.filter((participantId) => participantId !== id),
        // If the friend who paid is removed, set paidBy to empty
        paidBy: expense.paidBy === id ? "" : expense.paidBy,
      })),
    )
  }

  const addExpense = (expense: Expense) => {
    setExpenses([...expenses, expense])
  }

  const updateExpense = (updatedExpense: Expense) => {
    setExpenses(expenses.map((expense) => (expense.id === updatedExpense.id ? updatedExpense : expense)))
  }

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id))
  }

  const addCategory = (category: Category) => {
    setCategories([...categories, category])
  }

  const updateCategory = (updatedCategory: Category) => {
    setCategories(categories.map((cat) => (cat.id === updatedCategory.id ? updatedCategory : cat)))
  }

  const removeCategory = (id: string) => {
    setCategories(categories.filter((cat) => cat.id !== id))
  }

  const saveCurrentTrip = () => {
    if (!tripName.trim()) {
      toast({
        title: "Trip name required",
        description: "Please enter a name for this trip",
        variant: "destructive",
      })
      return
    }

    // Create a new trip data object
    const newTrip: TripData = {
      id: Date.now().toString(),
      name: tripName,
      date: new Date().toISOString(),
      friends,
      expenses: expenses.map((expense) => ({
        ...expense,
        date: new Date(expense.date),
      })),
      categories,
      currency,
    }

    // Add to history, keeping only the most recent 5
    const updatedHistory = [newTrip, ...history].slice(0, 5)
    setHistory(updatedHistory)

    setIsSaveDialogOpen(false)
    setTripName("")

    toast({
      title: "Trip saved",
      description: `"${tripName}" has been saved to history`,
    })
  }

  const loadTrip = (trip: TripData) => {
    setFriends(trip.friends)
    setExpenses(
      trip.expenses.map((expense) => ({
        ...expense,
        date: new Date(expense.date),
      })),
    )
    setCategories(trip.categories)
    setCurrency(trip.currency)

    toast({
      title: "Trip loaded",
      description: `"${trip.name}" has been loaded`,
    })

    setActiveTab("friends")
  }

  const clearCurrentTripData = () => {
    // Save the history data
    const savedHistory = localStorage.getItem("tripCalculator_history");

    // Clear all localStorage keys
    localStorage.clear();

    // Restore only the history data
    if (savedHistory) {
      localStorage.setItem("tripCalculator_history", savedHistory);
    }

    // Show toast notification
    toast({
      title: "Data cleared",
      description: "All trip data has been cleared (except for trip history)",
    });

    // Refresh the page
    setTimeout(() => {
      window.location.reload();
    }, 1000); // Small delay to show the toast
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-teal-700 text-white rounded-t-lg p-3 sm:p-6">
        <CardTitle className="text-lg sm:text-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <span>Trip Expense Manager</span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-teal-600 border-teal-500 hover:bg-teal-500 h-8 px-2 flex-1 sm:flex-none"
                >
                  <SaveIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="text-xs sm:text-sm">Save Trip</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95%] max-w-md mx-auto">
                <DialogHeader>
                  <DialogTitle>Save Current Trip</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <Input placeholder="Enter trip name" value={tripName} onChange={(e) => setTripName(e.target.value)} />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" size={isMobile ? "sm" : "default"}>Cancel</Button>
                  </DialogClose>
                  <Button onClick={saveCurrentTrip} size={isMobile ? "sm" : "default"}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-teal-600 border-teal-500 hover:bg-teal-500 h-8 px-2 flex-1 sm:flex-none"
                >
                  <Trash2Icon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="text-xs sm:text-sm">Clear All</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="w-[95%] max-w-md mx-auto">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will clear all your trip data including friends, expenses, and categories.
                    Only your trip history will be preserved.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    className="h-8 sm:h-10 text-xs sm:text-sm"
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={clearCurrentTripData}
                    className="h-8 sm:h-10 text-xs sm:text-sm bg-red-600 hover:bg-red-700"
                  >
                    Clear All Data
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-[100px] bg-teal-600 border-teal-500 h-8 text-xs sm:text-sm">
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
                <SelectItem value="INR">INR (₹)</SelectItem>
                <SelectItem value="JPY">JPY (¥)</SelectItem>
                <SelectItem value="CAD">CAD ($)</SelectItem>
                <SelectItem value="AUD">AUD ($)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 sm:grid-cols-6 w-full h-auto p-2 rounded-none">
            <TabsTrigger value="friends" className="text-xs sm:text-sm py-2">Friends</TabsTrigger>
            <TabsTrigger value="categories" className="text-xs sm:text-sm py-2">Categories</TabsTrigger>
            <TabsTrigger value="expenses" className="text-xs sm:text-sm py-2">Add Expense</TabsTrigger>
            <TabsTrigger value="list" className="text-xs sm:text-sm py-2">All Expenses</TabsTrigger>
            <TabsTrigger value="settlement" className="text-xs sm:text-sm py-2">Settlement</TabsTrigger>
            <TabsTrigger value="history" className="text-xs sm:text-sm py-2 flex items-center justify-center">
              <HistoryIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span>History</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="friends" className="p-3 sm:p-4">
            <FriendsList
              friends={friends}
              onAddFriend={addFriend}
              onUpdateFriend={updateFriend}
              onRemoveFriend={removeFriend}
            />
            {friends.length > 0 && (
              <div className="mt-4 flex justify-end">
                <Button size={isMobile ? "sm" : "default"} onClick={() => setActiveTab("expenses")}>
                  Next: Add Expenses
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="categories" className="p-3 sm:p-4">
            <CategoryManager
              categories={categories}
              onAddCategory={addCategory}
              onUpdateCategory={updateCategory}
              onRemoveCategory={removeCategory}
            />
          </TabsContent>

          <TabsContent value="expenses" className="p-3 sm:p-4">
            <ExpenseForm friends={friends} categories={categories} onAddExpense={addExpense} />
            {expenses.length > 0 && (
              <div className="mt-4 flex justify-end space-x-2">
                <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={() => setActiveTab("list")}>
                  View All Expenses
                </Button>
                <Button size={isMobile ? "sm" : "default"} onClick={() => setActiveTab("settlement")}>
                  Calculate Settlement
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="list" className="p-3 sm:p-4">
            <ExpensesList
              expenses={expenses}
              friends={friends}
              categories={categories}
              currency={currency}
              onUpdateExpense={updateExpense}
              onRemoveExpense={removeExpense}
            />
            {expenses.length > 0 && (
              <div className="mt-4 flex justify-end">
                <Button size={isMobile ? "sm" : "default"} onClick={() => setActiveTab("settlement")}>
                  Calculate Settlement
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="settlement" className="p-3 sm:p-4">
            <SettlementSummary friends={friends} expenses={expenses} currency={currency} />
          </TabsContent>

          <TabsContent value="history" className="p-3 sm:p-4">
            <HistoryManager history={history} onLoadTrip={loadTrip} onClearTrip={clearCurrentTripData} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
