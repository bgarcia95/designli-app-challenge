import React, {createContext, useState, useEffect, ReactNode} from 'react';
import {StorageAdapter} from '../helpers/storage-adapter';
import {useAuth0} from 'react-native-auth0';

interface Stock {
  id: string;
  name: string;
  priceToWatch: number;
  displaySymbol?: string;
}

export interface AppContextProps {
  stocks: Stock[];
  addStock: (stock: Stock) => void;
  removeStock: (id: string) => void;
  updateStocks: (stocks: Stock[]) => void;
  clearSession: () => void;
  user: any;
}

export const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const {clearSession, user} = useAuth0();

  useEffect(() => {
    const loadStocks = async () => {
      try {
        const storedStocks = await StorageAdapter.getItem('stocks');
        if (storedStocks) {
          setStocks(JSON.parse(storedStocks));
        }
      } catch (error) {
        console.error('Failed to load stocks from async storage', error);
      }
    };

    loadStocks();
  }, []);

  const addStock = React.useCallback(
    async (stock: Stock): Promise<void> => {
      try {
        const updatedStocks = [...stocks, stock];
        setStocks(updatedStocks);
        await StorageAdapter.setItem('stocks', JSON.stringify(updatedStocks));
      } catch (error) {
        console.error('Failed to add stock to async storage', error);
      }
    },
    [stocks],
  );

  const removeStock = React.useCallback(
    async (id: string): Promise<void> => {
      try {
        const updatedStocks = stocks.filter(stock => stock.id !== id);
        setStocks(updatedStocks);
        await StorageAdapter.setItem('stocks', JSON.stringify(updatedStocks));
      } catch (error) {
        console.error('Failed to remove stock from async storage', error);
      }
    },
    [stocks],
  );

  const updateStocks = React.useCallback(
    async (newStocks: Stock[]): Promise<void> => {
      try {
        setStocks(newStocks);
        await StorageAdapter.setItem('stocks', JSON.stringify(newStocks));
      } catch (error) {
        console.error('Failed to update stocks in async storage', error);
      }
    },
    [],
  );

  const contextValue = React.useMemo(
    () => ({stocks, addStock, removeStock, updateStocks, clearSession, user}),
    [stocks, addStock, removeStock, updateStocks, clearSession, user],
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
