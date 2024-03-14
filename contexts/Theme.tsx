'use client'

import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from "react";
import { useReadLocalStorage } from 'usehooks-ts'

export type Theme = 'light' | 'dark'

type ThemeContextProps = {
   theme: Theme;
   setTheme: Dispatch<SetStateAction<Theme>>;
   isLight: boolean;
   isDark: boolean;
}

const ThemeContext = createContext<ThemeContextProps | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) =>
{
    const localStorageTheme = useReadLocalStorage<Theme>('theme') // <- Pega o valor já existente em LocalStorage
    const [theme, setTheme] = useState<Theme>(localStorageTheme ? localStorageTheme : 'light');

    return (
        <ThemeContext.Provider value={{ theme, setTheme, isLight: theme === 'light', isDark: theme === 'dark' }}>
            { children }
        </ThemeContext.Provider>
    );
};

export function useTheme()
{
   const context = useContext(ThemeContext);

   if(!context)
      throw new Error('useTheme must be used within a ThemeProvider');

   const { theme, setTheme, isLight, isDark } = context;

   return { theme, setTheme, isLight, isDark };
}