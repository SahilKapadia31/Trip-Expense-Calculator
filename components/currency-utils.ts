export const getCurrencySymbol = (currency: string): string => {
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

export const formatCurrency = (amount: number, currency: string): string => {
  const symbol = getCurrencySymbol(currency)

  // Format based on currency conventions
  switch (currency) {
    case "JPY":
      // JPY typically doesn't use decimal places
      return `${symbol}${Math.round(amount)}`
    case "INR":
      // INR uses lakh/crore format, but we'll keep it simple here
      return `${symbol}${amount.toFixed(2)}`
    default:
      return `${symbol}${amount.toFixed(2)}`
  }
}
