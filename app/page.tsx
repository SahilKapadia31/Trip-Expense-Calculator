import { TripExpenseCalculator } from "@/components/trip-expense-calculator"

export default function Home() {
  return (
    // Developer:Sahil Kapadia
    <main className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-teal-50 to-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-teal-800 mb-2">Trip Expense Calculator</h1>
        <h1 className="text-3xl md:text-4xl hidden font-bold text-teal-800 mb-2">Developer:Sahil Kapadia</h1>
        <p className="text-gray-600 mb-8">Split expenses fairly based on individual preferences</p>
        <TripExpenseCalculator />
      </div>
    </main>
  )
}
