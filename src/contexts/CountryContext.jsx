import { createContext, useContext } from 'react'

export const CountryContext = createContext(null)

export function useCountryTheme() {
  return useContext(CountryContext)
}
