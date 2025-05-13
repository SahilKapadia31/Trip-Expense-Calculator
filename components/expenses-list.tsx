"use client"

import { useState } from "react"
import type { Friend, Expense, Category } from "./trip-expense-calculator"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { format } from "date-fns"
import { Trash2, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useMobile } from "@/hooks/use-mobile"

interface ExpensesListProps {
  expenses: Expense[]
  friends: Friend[]
  categories: Category[]
  currency: string
  onUpdateExpense: (expense: Expense) => void
  onRemoveExpense: (id: string) => void
}

export const ExpensesList = ({
  expenses,
  friends,
  categories,
  currency,
  onUpdateExpense,
  onRemoveExpense,
}: ExpensesListProps) => {
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)
  const isMobile = useMobile()

  const getFriendName = (id: string) => {
    const friend = friends.find((f) => f.id === id)
    return friend ? friend.name : "Unknown"
  }

  const getCategoryLabel = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    return category ? category.name : categoryId
  }

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    return category ? category.color : "gray"
  }

  const getColorHex = (colorName: string): string => {
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
    return colorMap[colorName] || "#3b82f6";
  }

  const getBadgeStyle = (categoryId: string) => {
    const colorName = getCategoryColor(categoryId);
    const bgColor = `${getColorHex(colorName)}22`;
    const textColor = getColorHex(colorName);

    return {
      backgroundColor: bgColor,
      color: textColor,
      borderColor: `${textColor}44`
    };
  }

  const getCurrencySymbol = (currency: string) => {
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

  const currencySymbol = getCurrencySymbol(currency)

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg sm:text-xl font-semibold">All Expenses</h2>
        <div className="text-right">
          <p className="text-xs sm:text-sm text-gray-500">Total Expenses</p>
          <p className="text-lg sm:text-2xl font-bold text-teal-700">
            {currencySymbol}
            {totalAmount.toFixed(2)}
          </p>
        </div>
      </div>

      {expenses.length === 0 ? (
        <Card>
          <CardContent className="p-4 sm:p-6 text-center">
            <p className="text-gray-500 italic text-sm">No expenses added yet.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {isMobile ? (
            // Mobile view - cards instead of table
            <div className="space-y-2">
              {expenses.map((expense) => (
                <Card key={expense.id} className="overflow-hidden">
                  <CardContent className="p-2 sm:p-3">
                    <div className="flex justify-between items-start mb-1 sm:mb-2">
                      <div>
                        <h3 className="font-medium text-sm">{expense.description}</h3>
                        <p className="text-xs text-gray-500">{format(expense.date, "MMM d, yyyy")}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">
                          {currencySymbol}
                          {expense.amount.toFixed(2)}
                        </p>
                        <Badge
                          variant="outline"
                          className="text-xs px-1 py-0"
                          style={getBadgeStyle(expense.category)}
                        >
                          {getCategoryLabel(expense.category)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <span className="text-gray-500">Paid by:</span> {getFriendName(expense.paidBy)}
                      </div>
                      <div className="flex items-center">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 px-1 sm:px-2">
                              <Info className="h-3 w-3 mr-0.5 sm:mr-1" />
                              <span className="text-xs">{expense.participants.length}</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="w-[90%] max-w-md mx-auto">
                            <DialogHeader>
                              <DialogTitle>Participants</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-1 mt-2">
                              {expense.participants.map((participantId) => (
                                <div key={participantId} className="text-xs sm:text-sm">
                                  {getFriendName(participantId)}
                                </div>
                              ))}
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => onRemoveExpense(expense.id)}
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // Desktop view - table
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Paid By</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className="whitespace-nowrap">{format(expense.date, "MMM d, yyyy")}</TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          style={getBadgeStyle(expense.category)}
                        >
                          {getCategoryLabel(expense.category)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {currencySymbol}
                        {expense.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>{getFriendName(expense.paidBy)}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6">
                              <Info className="h-3 w-3 mr-1" />
                              {expense.participants.length}
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Participants</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-2 mt-2">
                              {expense.participants.map((participantId) => (
                                <div key={participantId} className="text-sm">
                                  {getFriendName(participantId)}
                                </div>
                              ))}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => onRemoveExpense(expense.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}
    </div>
  )
}
