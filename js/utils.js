/**
 * Utility functions and constants
 */

// Categories Data
const CATEGORIES = [
    { name: 'Food & Dining', icon: '🍔', color: '#f97316' },
    { name: 'Travel', icon: '✈️', color: '#0ea5e9' },
    { name: 'Shopping', icon: '🛍️', color: '#a855f7' },
    { name: 'Bills & Utilities', icon: '📄', color: '#ef4444' },
    { name: 'Entertainment', icon: '🎬', color: '#ec4899' },
    { name: 'Health', icon: '🏥', color: '#10b981' },
    { name: 'Education', icon: '📚', color: '#6366f1' },
    { name: 'Salary', icon: '💰', color: '#22c55e' },
    { name: 'Freelance', icon: '💻', color: '#14b8a6' },
    { name: 'Other', icon: '📌', color: '#64748b' }
];

const getCategoryMeta = (name) => {
    return CATEGORIES.find(c => c.name === name) || CATEGORIES[CATEGORIES.length - 1]; // Fallback to 'Other'
};

const generateId = () => {
    return typeof crypto.randomUUID === 'function' 
        ? crypto.randomUUID() 
        : 'id-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString(36);
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(amount);
};

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
};

const getMonthYear = (dateString) => {
    const date = dateString ? new Date(dateString) : new Date();
    return date.toISOString().substring(0, 7); // Returns "YYYY-MM"
};

const formatMonthYearDisplay = (monthYearString) => {
    if (!monthYearString) return '';
    const [year, month] = monthYearString.split('-');
    const date = new Date(year, parseInt(month) - 1);
    return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
};

// Debounce function for search inputs
const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(null, args);
        }, delay);
    };
};

// Toast notification function
const showToast = (message, type = 'success') => {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = '✅';
    if (type === 'error') icon = '❌';
    if (type === 'warning') icon = '⚠️';

    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-message">${message}</span>
        <span class="toast-close">&times;</span>
    `;

    container.appendChild(toast);

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        toast.style.animation = 'fadeOut 0.3s forwards';
        setTimeout(() => toast.remove(), 300);
    });

    // Auto remove after 3 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.animation = 'fadeOut 0.3s forwards';
            setTimeout(() => toast.remove(), 300);
        }
    }, 3000);
};

// Animate numbers counting up
const animateCounter = (element, targetValue, duration = 1000) => {
    if (!element) return;
    
    // Simple handling to not animate formatted strings yet, just sets the value
    // In a real robust app you'd parse out the numbers and currency symbol
    element.textContent = formatCurrency(targetValue);
};

const createElementFromHTML = (htmlString) => {
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
};
