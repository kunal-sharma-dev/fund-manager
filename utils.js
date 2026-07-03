/**
 * StorageManager - Handles all localStorage operations
 */
class StorageManager {
    constructor() {
        this.PREFIX = 'fem_';
        this.KEYS = {
            USERS: this.PREFIX + 'users',
            CURRENT_USER: this.PREFIX + 'currentUser',
            TRANSACTIONS: this.PREFIX + 'transactions',
            BUDGETS: this.PREFIX + 'budgets',
            SAVINGS: this.PREFIX + 'savings',
            THEME: this.PREFIX + 'theme'
        };
    }

    /**
     * Save data to localStorage
     * @param {string} key 
     * @param {any} data 
     */
    save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    }

    /**
     * Load data from localStorage
     * @param {string} key 
     * @returns {any|null}
     */
    load(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return null;
        }
    }

    /**
     * Remove item from localStorage
     * @param {string} key 
     */
    remove(key) {
        localStorage.removeItem(key);
    }

    /**
     * Check if key exists in localStorage
     * @param {string} key 
     * @returns {boolean}
     */
    exists(key) {
        return localStorage.getItem(key) !== null;
    }

    /**
     * Export all app data as JSON string
     * @returns {string}
     */
    exportAllData() {
        const exportData = {};
        for (const [keyName, storageKey] of Object.entries(this.KEYS)) {
            exportData[keyName] = this.load(storageKey);
        }
        return JSON.stringify(exportData, null, 2);
    }

    /**
     * Clear all app data
     */
    clearAll() {
        for (const key of Object.values(this.KEYS)) {
            this.remove(key);
        }
    }
}

const storage = new StorageManager();
