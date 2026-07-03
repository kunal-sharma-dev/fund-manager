// imports removed

class UserManager {
    constructor() {
        this.users = storage.load(storage.KEYS.USERS) || [];
        this.currentUser = storage.load(storage.KEYS.CURRENT_USER) || null;
    }

    /**
     * Hash password (Simulated - not for production!)
     * @param {string} str 
     */
    _hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString();
    }

    _validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    /**
     * Register a new user
     */
    register(name, email, password) {
        if (!name || !email || !password) {
            throw new Error('All fields are required');
        }
        if (!this._validateEmail(email)) {
            throw new Error('Invalid email format');
        }
        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters');
        }

        const existingUser = this.users.find(u => u.email === email);
        if (existingUser) {
            throw new Error('Email already registered');
        }

        const newUser = {
            id: generateId(),
            name: name,
            email: email,
            password: this._hashString(password),
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        storage.save(storage.KEYS.USERS, this.users);
        
        // Auto login
        return this.login(email, password);
    }

    /**
     * Login existing user
     */
    login(email, password) {
        const hashedPass = this._hashString(password);
        const user = this.users.find(u => u.email === email && u.password === hashedPass);

        if (!user) {
            throw new Error('Invalid email or password');
        }

        this.currentUser = {
            id: user.id,
            name: user.name,
            email: user.email
        };

        storage.save(storage.KEYS.CURRENT_USER, this.currentUser);
        return this.currentUser;
    }

    /**
     * Logout current user
     */
    logout() {
        this.currentUser = null;
        storage.remove(storage.KEYS.CURRENT_USER);
    }

    /**
     * Get currently logged in user
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Check if user is logged in
     */
    isLoggedIn() {
        return this.currentUser !== null;
    }
}

const userManager = new UserManager();
