// config.js
// This file acts as our configuration (.env equivalent) since a pure HTML
// app opened directly via the file:// protocol in a browser cannot securely read hidden .env files.

const CONFIG = {
    // Admin credentials
    ADMIN_USERNAME: 'admin',
    ADMIN_PASSWORD: 'admin123',
    ADMIN_NAME: 'Michael Johnson',

    // Test user credentials
    USER_USERNAME: 'user',
    USER_PASSWORD: 'user123',
    USER_NAME: 'Emily Davis'
};

// --- Database / Initial State Payload ---
// Initial sample data to simulate a backend response
const SAMPLE_PROVIDERS = [
    {
        id: 'p1',
        providerName: 'Sarah Miller',
        kitchenName: "Sarah's Home Kitchen",
        phone: '555-234-8890',
        menuLunch: ['Grilled Chicken', 'Rice', 'Salad', 'Bread'],
        menuDinner: ['Pasta', 'Garlic Bread', 'Soup'],
        status: 'approved'
    },
    {
        id: 'p2',
        providerName: 'Robert Wilson',
        kitchenName: "Wilson Family Meals",
        phone: '555-981-4421',
        menuLunch: ['Turkey Sandwich', 'Chips', 'Fruit'],
        menuDinner: ['Baked Chicken', 'Mashed Potatoes', 'Vegetables'],
        status: 'approved'
    }
];

const SAMPLE_ORDERS = [
    {
        id: 'o1',
        username: 'user',
        customerName: 'Emily Davis',
        phone: '555-111-2222',
        providerId: 'p1',
        providerName: "Sarah's Home Kitchen",
        mealType: 'Lunch',
        quantity: 2,
        date: new Date().toISOString(),
        status: 'Pending'
    },
    {
        id: 'o2',
        username: 'user',
        customerName: 'John Smith',
        phone: '555-333-4444',
        providerId: 'p2',
        providerName: "Wilson Family Meals",
        mealType: 'Dinner',
        quantity: 1,
        date: new Date().toISOString(),
        status: 'Pending'
    }
];

const SAMPLE_REQUESTS = [
    {
        id: 'r1',
        username: 'user',
        providerName: 'Lisa Brown',
        kitchenName: "Lisa's Fresh Meals",
        phone: '555-765-3322',
        sampleMenu: "Lunch:\n- Chicken Wrap\n- Salad\n\nDinner:\n- Beef Stew\n- Bread",
        status: 'Pending'
    }
];
