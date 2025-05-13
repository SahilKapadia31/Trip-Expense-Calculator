"use client"

import { useMemo } from "react"
import type { Friend, Expense } from "./trip-expense-calculator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowRight, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"

interface SettlementSummaryProps {
  friends: Friend[]
  expenses: Expense[]
  currency: string
}

interface Balance {
  friendId: string
  paid: number
  owes: number
  netBalance: number
}

interface Transaction {
  from: string
  to: string
  amount: number
}

export const SettlementSummary = ({ friends, expenses, currency }: SettlementSummaryProps) => {
  const isMobile = useMobile()

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

  const balances = useMemo(() => {
    // Initialize balances for each friend
    const balances: Record<string, Balance> = {}

    friends.forEach((friend) => {
      balances[friend.id] = {
        friendId: friend.id,
        paid: 0,
        owes: 0,
        netBalance: 0,
      }
    })

    // Calculate what each person paid and owes
    expenses.forEach((expense) => {
      // Add what the payer paid
      if (balances[expense.paidBy]) {
        balances[expense.paidBy].paid += expense.amount
      }

      // Calculate what each participant owes
      const participantCount = expense.participants.length
      if (participantCount > 0) {
        const amountPerPerson = expense.amount / participantCount

        expense.participants.forEach((participantId) => {
          if (balances[participantId]) {
            balances[participantId].owes += amountPerPerson
          }
        })
      }
    })

    // Calculate net balance
    Object.keys(balances).forEach((friendId) => {
      balances[friendId].netBalance = balances[friendId].paid - balances[friendId].owes
    })

    return Object.values(balances)
  }, [friends, expenses])

  const transactions = useMemo(() => {
    const transactions: Transaction[] = []

    // Create a copy of balances to work with
    const workingBalances = [...balances]

    // Sort by net balance (ascending)
    workingBalances.sort((a, b) => a.netBalance - b.netBalance)

    // Calculate transactions
    while (workingBalances.length > 1) {
      const debtor = workingBalances[0] // Person who owes money (negative balance)
      const creditor = workingBalances[workingBalances.length - 1] // Person who is owed money (positive balance)

      if (Math.abs(debtor.netBalance) < 0.01 && Math.abs(creditor.netBalance) < 0.01) {
        // Both balances are effectively zero, remove them
        workingBalances.shift()
        workingBalances.pop()
        continue
      }

      // Calculate the transaction amount
      const amount = Math.min(Math.abs(debtor.netBalance), creditor.netBalance)

      if (amount > 0.01) {
        // Only create transactions for non-zero amounts
        transactions.push({
          from: debtor.friendId,
          to: creditor.friendId,
          amount,
        })
      }

      // Update balances
      debtor.netBalance += amount
      creditor.netBalance -= amount

      // Remove settled balances
      if (Math.abs(debtor.netBalance) < 0.01) {
        workingBalances.shift()
      }

      if (Math.abs(creditor.netBalance) < 0.01) {
        workingBalances.pop()
      }
    }

    return transactions
  }, [balances])

  const getFriendName = (id: string) => {
    const friend = friends.find((f) => f.id === id)
    return friend ? friend.name : "Unknown"
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  const downloadSettlementCSV = () => {
    // Create CSV content
    let csvContent = "Friend,Paid,Owes,Net Balance\n"

    balances.forEach((balance) => {
      csvContent += `${getFriendName(balance.friendId)},${balance.paid.toFixed(2)},${balance.owes.toFixed(2)},${balance.netBalance.toFixed(2)}\n`
    })

    csvContent += "\nSettlement Plan\n"
    csvContent += "From,To,Amount\n"

    transactions.forEach((transaction) => {
      csvContent += `${getFriendName(transaction.from)},${getFriendName(transaction.to)},${transaction.amount.toFixed(2)}\n`
    })

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `trip-settlement-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const downloadSettlementJSON = () => {
    // Create JSON content
    const jsonData = {
      summary: {
        totalExpenses,
        currency,
        date: new Date().toISOString(),
      },
      balances: balances.map((balance) => ({
        name: getFriendName(balance.friendId),
        paid: balance.paid,
        owes: balance.owes,
        netBalance: balance.netBalance,
      })),
      transactions: transactions.map((transaction) => ({
        from: getFriendName(transaction.from),
        to: getFriendName(transaction.to),
        amount: transaction.amount,
      })),
      expenses: expenses.map((expense) => ({
        description: expense.description,
        amount: expense.amount,
        paidBy: getFriendName(expense.paidBy),
        date: expense.date,
        participants: expense.participants.map((id) => getFriendName(id)),
      })),
    }

    // Create a blob and download link
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `trip-settlement-${new Date().toISOString().split("T")[0]}.json`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <h2 className="text-lg sm:text-xl font-semibold">Settlement Summary</h2>
        <div className="flex space-x-2 flex-wrap w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={downloadSettlementCSV}
            className="h-8 text-xs sm:text-sm flex-1 sm:flex-auto"
          >
            <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            {isMobile ? "CSV" : "Download CSV"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadSettlementJSON}
            className="h-8 text-xs sm:text-sm flex-1 sm:flex-auto"
          >
            <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            {isMobile ? "JSON" : "Download JSON"}
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div></div>
        <div className="text-right">
          <p className="text-xs sm:text-sm text-gray-500">Total Trip Expenses</p>
          <p className="text-lg sm:text-2xl font-bold text-teal-700">
            {currencySymbol}
            {totalExpenses.toFixed(2)}
          </p>
        </div>
      </div>

      {expenses.length === 0 ? (
        <Card>
          <CardContent className="p-4 sm:p-6 text-center">
            <p className="text-gray-500 italic text-sm">No expenses to settle.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-0 pt-3 px-3 sm:p-6 sm:pb-0">
              <CardTitle className="text-base sm:text-lg">Individual Balances</CardTitle>
            </CardHeader>
            <CardContent className="p-0 sm:p-6 overflow-x-auto">
              {isMobile ? (
                <div className="space-y-3 p-3">
                  {balances.map((balance) => (
                    <div key={balance.friendId} className="border rounded-md p-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm">{getFriendName(balance.friendId)}</span>
                        <span
                          className={`text-sm font-medium ${balance.netBalance > 0 ? "text-green-600" : balance.netBalance < 0 ? "text-red-600" : ""
                            }`}
                        >
                          {balance.netBalance > 0 ? "+" : ""}
                          {currencySymbol}
                          {balance.netBalance.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Paid: {currencySymbol}{balance.paid.toFixed(2)}</span>
                        <span>Owes: {currencySymbol}{balance.owes.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Friend</TableHead>
                      <TableHead className="text-right">Paid</TableHead>
                      <TableHead className="text-right">Owes</TableHead>
                      <TableHead className="text-right">Net Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {balances.map((balance) => (
                      <TableRow key={balance.friendId}>
                        <TableCell>{getFriendName(balance.friendId)}</TableCell>
                        <TableCell className="text-right">
                          {currencySymbol}
                          {balance.paid.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          {currencySymbol}
                          {balance.owes.toFixed(2)}
                        </TableCell>
                        <TableCell
                          className={`text-right font-medium ${balance.netBalance > 0 ? "text-green-600" : balance.netBalance < 0 ? "text-red-600" : ""
                            }`}
                        >
                          {balance.netBalance > 0 ? "+" : ""}
                          {currencySymbol}
                          {balance.netBalance.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-0 pt-3 px-3 sm:p-6 sm:pb-0">
              <CardTitle className="text-base sm:text-lg">Settlement Plan</CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              {transactions.length === 0 ? (
                <p className="text-center text-gray-500 italic text-sm">Everyone is settled up!</p>
              ) : isMobile ? (
                <div className="space-y-3">
                  {transactions.map((transaction, index) => (
                    <div key={index} className="p-2 sm:p-3 border rounded-lg">
                      <div className="text-xs sm:text-sm text-center mb-1">
                        <span className="font-medium">{getFriendName(transaction.from)}</span>
                        <span className="text-gray-500"> pays </span>
                        <span className="font-medium">{getFriendName(transaction.to)}</span>
                      </div>
                      <div className="flex justify-center items-center">
                        <span className="font-bold text-teal-700 text-sm sm:text-base">
                          {currencySymbol}
                          {transaction.amount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="font-medium">{getFriendName(transaction.from)}</div>
                      <div className="flex items-center text-gray-500">
                        <ArrowRight className="mx-2 h-4 w-4" />
                        <span className="font-bold text-teal-700">
                          {currencySymbol}
                          {transaction.amount.toFixed(2)}
                        </span>
                        <ArrowRight className="mx-2 h-4 w-4" />
                      </div>
                      <div className="font-medium">{getFriendName(transaction.to)}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
