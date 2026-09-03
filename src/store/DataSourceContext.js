import { createContext, useContext, useState, useCallback } from 'react';
import config from 'config';

const DataSourceContext = createContext();

/**
 * Provides a global source selector (equity / crypto / kraken-futures) for the dashboard.
 *
 * Three-process architecture:
 *   equity         → port 8080
 *   crypto         → port 8081  (Coinbase)
 *   kraken-futures → port 8082  (Kraken Futures)
 *
 * isCrypto is true for BOTH crypto and kraken-futures so that all views that
 * guard on isCrypto continue to work without modification.
 * isKrakenFutures is true only for the kraken-futures source.
 *
 * Any component can read the current source and build API URLs via:
 *   const { source, isCrypto, isKrakenFutures, setSource, apiUrl } = useDataSource();
 */
export const DataSourceProvider = ({ children }) => {
    const [source, setSource] = useState('equity');

    const isCrypto = source === 'crypto' || source === 'kraken-futures';
    const isKrakenFutures = source === 'kraken-futures';

    const toggleSource = useCallback(() => {
        setSource((prev) => (prev === 'equity' ? 'crypto' : 'equity'));
    }, []);

    /** Returns the full URL by prepending the correct backend base URL */
    const apiUrl = useCallback(
        (path) => {
            let base;
            if (source === 'kraken-futures') {
                base = config.krakenFuturesBaseApi;
            } else if (source === 'crypto') {
                base = config.cryptoBaseApi;
            } else {
                base = config.baseApi;
            }
            return base + path;
        },
        [source]
    );

    return (
        <DataSourceContext.Provider value={{ source, isCrypto, isKrakenFutures, toggleSource, setSource, apiUrl }}>
            {children}
        </DataSourceContext.Provider>
    );
};

export const useDataSource = () => {
    const ctx = useContext(DataSourceContext);
    if (!ctx) throw new Error('useDataSource must be used within DataSourceProvider');
    return ctx;
};
