import { createContext } from "react";

export type LoadingContextTypes = {
    loading: boolean;
    setLoading: (loading: boolean) => void;
}
export const LoadingContext = createContext<LoadingContextTypes | null>(null);