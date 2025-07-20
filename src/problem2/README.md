# Currency Swap Form (Beginner Version)

## Introduction
This is a simple app that lets you swap between different tokens/coins (like ETH, USDC, BLUR, ...) using real prices from an API. The UI is modern, easy to use, and the code is clear for anyone learning React + TypeScript.

**UI inspired by [Creative Tim Tailwind Password Input](https://www.creative-tim.com/twcomponents/component/password-input)**

## Main Features
- Select which token to swap from (From) and which to receive (To)
- Enter the amount to swap, the app will automatically calculate the result
- Swap button to switch From/To tokens
- Refresh Rates button to get the latest prices
- Shows the real exchange rate

## Technologies Used
- React + TypeScript
- Tailwind CSS
- Vite
- API: https://interview.switcheo.com/prices.json

## How to Install and Run
1. Open your terminal and go to the project folder:
   ```bash
   cd src/problem2
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the app:
   ```bash
   npm run dev
   ```
4. Open your browser and go to: [http://localhost:3000](http://localhost:3000)

## How to Use
- Select tokens in the two dropdowns (From/To)
- Enter the amount you want to swap in the top input
- See the result in the bottom input
- Click the swap button to switch the tokens
- Click "Refresh Rates" to update prices

## Simple Project Structure
- `src/components/currency-swap-form.tsx`: Main swap form UI and logic
- `src/hooks/useTokenPricesQuery.ts`: Hook to fetch token prices from API
- `src/interfaces/token-interface.ts`: Defines the Token type
 