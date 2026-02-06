import { useEffect, useState } from 'react';

export default function useDraft<T>(key: string, initial: T) {
   const [value, setValue] = useState<T>(() => {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initial;
   });

   useEffect(() => {
      localStorage.setItem(key, JSON.stringify(value));
   }, [key, value]);

   const clear = () => localStorage.removeItem(key);

   return { value, setValue, clear };
}
