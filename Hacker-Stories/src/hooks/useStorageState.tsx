import { useState, useEffect } from "react";

export const useStorageState = (key: string, initialState: string) => {
    const [searchTerm, setSearchTerm] = useState(
      localStorage.getItem(key) || initialState
    );
  
    useEffect(() => {
      localStorage.setItem(key, searchTerm);
    }, [searchTerm, key]);
  
    return { searchTerm, setSearchTerm };
  };