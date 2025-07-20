import React, { useMemo } from 'react';

interface WalletBalance {
    currency: string;
    amount: number;
    blockchain: string;
  }
  interface FormattedWalletBalance {
    currency: string;
    amount: number;
    formatted: string;
    blockchain: string;
  }
  
  interface BoxProps {
    children?: any;
    [key: string]: any;
  }

  interface Props extends BoxProps {
    children?: any;
  }

  const classes = {
    row: 'wallet-row'
  };

const getPriority = (blockchain: string): number => {
  switch (blockchain) {
    case 'Osmosis': return 100;
    case 'Ethereum': return 50;
    case 'Arbitrum': return 30;
    case 'Zilliqa': return 20;
    case 'Neo': return 20;
    default: return -99;
  }
}

const WalletPage: React.FC<Props> = (props: Props) => { 
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // Sort and filter the balances
  const sortedBalances = useMemo(() => {
    const filteredBalances = balances.filter((balance: WalletBalance) => {
      const priority = getPriority(balance.blockchain);
      
      if (priority > -99 && balance.amount <= 0) {
        return true;
      }
      return false;
    });

    return filteredBalances.sort((first: WalletBalance, second: WalletBalance) => {
      const firstPriority = getPriority(first.blockchain);
      const secondPriority = getPriority(second.blockchain);
      
      if (firstPriority > secondPriority) {
        return -1; 
      } else if (secondPriority > firstPriority) {
        return 1; 
      }
      return 0;  
    });
  }, [balances, prices]);

  const rows = sortedBalances.map((balance: FormattedWalletBalance) => {
    const usdValue = prices[balance.currency] * balance.amount;
        const uniqueKey = `${balance.blockchain}-${balance.currency}`;
    
    return (
      <WalletRow 
        className={classes.row}
        key={uniqueKey}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    );
  });

  // Return the component
  return (
    <div {...rest}>
      {children}
      {rows}
    </div>
  );
};