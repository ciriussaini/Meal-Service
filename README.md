# Community Home Meal Service

Community Home Meal Service is a local platform connecting home cooks with people in their neighborhood looking for fresh, home-cooked meals. Designed with a clean and modern user interface, the application serves as a robust prototype relying strictly on vanilla web technologies.

## Features

- **Role-based Dashboards:** Separate views & functionalities for standard users and administrators.
- **Offline Storage:** Utilizes `LocalStorage` to persistently store and retrieve provider lists, order history, and new requests without requiring a backend server.
- **Provider Management:** Admins can securely review, approve, or reject new community meal providers.
- **Order System:** Users can browse approved local providers and place meal orders seamlessly. 
- **Order Status Tracking:** Admins can track and update order status (Pending -> Approved -> Completed) and users see live updates on their dashboards.
- **Provider Search:** Quickly filter meal providers seamlessly from the user dashboard.
- **Provider Request Tracking:** Real-time feedback for users on the status of their requests to become community providers.
- **Vanilla Tech Stack:** 100% HTML, CSS, and JavaScript. Zero frameworks, zero bloat, ensuring absolute beginner-friendly code.

## How To Run

This project runs 100% locally and offline. No complicated setup, backend environments, databases, or build steps required.

1. **Download/Clone:** Get the code files onto your computer. Make sure all standard files (`index.html`, `style.css`, `script.js`, `config.js`) are located in the same folder.
2. **Launch Application:** Double-click the **`index.html`** file in your file explorer. It will open instantly in your default web browser (Chrome, Firefox, Safari, Edge, etc.).
3. **Enjoy:** Once opened, you can immediately begin using the application to log in via the roles defined below.

*(Upon initialization, the app will automatically seed your browser's local storage with sample providers, orders, and requests so you have a baseline to test with!)*

## Demo Login Credentials

**Admin User**
- **Username:** `admin`
- **Password:** `admin123`
- *Privileges:* View pending requests, manage approved providers, manage and update system orders.

**Standard User**
- **Username:** `user`
- **Password:** `user123`
- *Privileges:* Request to become a meal provider, view approved providers, place orders, search providers, and log order status dynamically.

## Troubleshooting

- **Data Not Saving?** Ensure your browser isn't running in "Strict Privacy" or "Incognito/Private" mode, as some browsers restrict `LocalStorage` in these states.
- **Resetting Data:** To reset the sample data back to default, run `localStorage.clear();` in your browser's developer console (F12) or simply clear your browser's history, then refresh the page.
