import { useEffect, useState } from "react"
import axios from "axios"
import { Token } from "../interfaces/token-interface"

export function useTokenPricesQuery() {
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    axios.get("https://interview.switcheo.com/prices.json")
      .then(res => {
        // Deduplicate by currency, keep latest
        const arr = res.data as Token[]
        const map = new Map<string, number>()
        arr.forEach(item => {
          map.set(item.currency, item.price)
        })
        setTokens(Array.from(map.entries()).map(([currency, price]) => ({ currency, price })))
        setError(null)
      })
      .catch(() => setError("Failed to fetch token prices"))
      .finally(() => setLoading(false))
  }, [])

  return { tokens, loading, error }
} 