"use client";

import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import { startOfMonth, endOfMonth, format } from "date-fns";

interface FilterContextType {
    startDate: Date | undefined;
    endDate: Date | undefined;
    setRange: (start: Date | undefined, end: Date | undefined) => void;
    currentPeriod: string;
    setCurrentPeriod: (period: string) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: React.ReactNode }) {
    // Initial state: deferred to useEffect to avoid prerender/hydration issues with new Date()
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [currentPeriod, setCurrentPeriod] = useState<string>("");

    useEffect(() => {
        setStartDate(startOfMonth(new Date()));
        setEndDate(endOfMonth(new Date()));
        setCurrentPeriod(format(new Date(), "yyyy-MM"));
    }, []);

    const setRange = (start: Date | undefined, end: Date | undefined) => {
        setStartDate(start);
        setEndDate(end);
    };

    const value = useMemo(() => ({
        startDate,
        endDate,
        setRange,
        currentPeriod,
        setCurrentPeriod
    }), [startDate, endDate, currentPeriod]);

    return (
        <FilterContext.Provider value={value}>
            {children}
        </FilterContext.Provider>
    );
}

export function useFilter() {
    const context = useContext(FilterContext);
    if (context === undefined) {
        throw new Error("useFilter must be used within a FilterProvider");
    }
    return context;
}
