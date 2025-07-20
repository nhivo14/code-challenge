import { useState, useEffect } from "react"
import { ArrowUpDown, RefreshCw } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { useTokenPricesQuery } from "../hooks/useTokenPricesQuery"
import { Token } from "../interfaces/token-interface"

const CurrencySwapForm: React.FC = () => {
  const { tokens, loading, error } = useTokenPricesQuery()
  const [fromToken, setFromToken] = useState<Token | null>(null)
  const [toToken, setToToken] = useState<Token | null>(null)
  const [fromAmount, setFromAmount] = useState<string>("1,000")
  const [toAmount, setToAmount] = useState<string>("")
  const [lastUpdated, setLastUpdated] = useState<string>("")
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    if (tokens.length > 1) {
      setFromToken(tokens[0])
      setToToken(tokens[1])
      setLastUpdated(new Date().toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }))
    }
  }, [tokens])

  useEffect(() => {
    if (fromAmount && fromToken && toToken) {
      const numericAmount = Number.parseFloat(fromAmount.replace(/,/g, ""))
      if (!isNaN(numericAmount)) {
        const convertedAmount = (numericAmount * toToken.price) / fromToken.price
        setToAmount(
          convertedAmount.toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 6,
          })
        )
      } else {
        setToAmount("")
      }
    } else {
      setToAmount("")
    }
  }, [fromAmount, fromToken, toToken])

  const handleFromAmountChange = (value: string) => {
    const numeric = value.replace(/[^0-9]/g, "")
    const formatted = numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    setFromAmount(formatted)
  }

  const handleToAmountChange = (value: string) => {
    const cleanValue = value.replace(/[^0-9,]/g, "")
    setToAmount(cleanValue)
    if (cleanValue && fromToken && toToken) {
      const numericAmount = Number.parseFloat(cleanValue.replace(/,/g, ""))
      if (!isNaN(numericAmount)) {
        const convertedAmount = (numericAmount * fromToken.price) / toToken.price
        setFromAmount(
          convertedAmount.toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 6,
          })
        )
      }
    }
  }

  const handleSwapTokens = () => {
    if (fromToken && toToken) {
      setFromToken(toToken)
      setToToken(fromToken)
      setFromAmount(toAmount)
      setToAmount(fromAmount)
    }
  }

  const handleRefreshRates = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }

  const getExchangeRate = () => {
    if (fromToken && toToken) {
      return (toToken.price / fromToken.price).toFixed(6)
    }
    return "0"
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border-0 z-10">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-semibold text-gray-800">Currency Converter</CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              Enter the amount you wish to convert and select the desired currency.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {loading && (
              <div className="text-center text-gray-500 py-8">Loading tokens...</div>
            )}
            {error && (
              <div className="text-center text-red-500 py-8">{error}</div>
            )}
            {!loading && !error && fromToken && toToken && (
              <>
                {/* From Section */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">From</label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={fromAmount}
                      onChange={(e) => handleFromAmountChange(e.target.value)}
                      placeholder="1,000"
                      className="flex-1 text-lg font-medium"
                    />
                    <Select
                      value={fromToken.currency}
                      onValueChange={(value) => {
                        const token = tokens.find((t) => t.currency === value)
                        if (token) setFromToken(token)
                      }}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-md z-50">
                        {tokens.map((token) => (
                          <SelectItem key={token.currency} value={token.currency}>
                            {token.currency}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleSwapTokens}
                    className="rounded-full border-2 hover:bg-gray-50 bg-transparent"
                  >
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </div>

                {/* To Section */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">To</label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={toAmount}
                      onChange={(e) => handleToAmountChange(e.target.value)}
                      placeholder="1,000"
                      className="flex-1 text-lg font-medium"
                    />
                    <Select
                      value={toToken.currency}
                      onValueChange={(value) => {
                        const token = tokens.find((t) => t.currency === value)
                        if (token) setToToken(token)
                      }}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-md z-50">
                        {tokens.map((token) => (
                          <SelectItem key={token.currency} value={token.currency}>
                            {token.currency}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Exchange Rate Info */}
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-sm font-medium text-gray-700">
                    1 {fromToken.currency} = {getExchangeRate()} {toToken.currency}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Mid-market exchange rate</div>
                </div>

                {/* Refresh Button */}
                <Button
                  variant="outline"
                  onClick={handleRefreshRates}
                  disabled={isRefreshing}
                  className="w-full bg-transparent"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                  {isRefreshing ? "Refreshing..." : "Refresh Rates"}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="mt-6 text-center text-sm text-gray-500 space-y-1">
          <p>Rates are updated every hour to provide the most accurate conversions.</p>
          <p>
            <span className="font-medium">Last updated:</span> {lastUpdated}
          </p>
        </div>
      </div>
    </div>
  )
}

export default CurrencySwapForm
