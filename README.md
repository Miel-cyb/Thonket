
# Thonket Sales and Order Management System

This is a comprehensive sales and order management system designed to streamline the entire process, from order placement to fulfillment. It features a user-friendly interface for sales, operations, and warehouse management, as well as a powerful admin dashboard for user and system administration.

## Features

*   **Sales Page:** Allows sales representatives to place new orders, view existing orders, and manage customer information.
*   **Operations Dashboard:** Provides a centralized view of all orders, allowing operations staff to approve or reject orders, track driver locations, and monitor key performance indicators.
*   **Warehouse Management:** Enables warehouse staff to manage inventory, process approved orders, and prepare them for dispatch.
*   **Admin Page:** A secure dashboard for administrators to manage users, and staff.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   npm

```sh
npm install npm@latest -g
```

### Installation

1.  Clone the repo

```sh
git clone https://github.com/your_username_/your_project_name.git
```

2.  Install NPM packages

```sh
npm install
```

3.  Start the development server

```sh
npm run dev
```

This will start the application on `http://localhost:5173` and the mock server on `http://localhost:3000`.

## Data Flow

This application uses a mock server to simulate a backend environment. The data is stored in JSON files in the `src/data` directory and served via a local server running on `http://localhost:3000`. This allows for a realistic development experience without the need for a full-fledged backend.

### Data Source

The primary data source for orders is the `src/data/allordersData.js` file. This file contains an array of order objects, each with detailed information about the customer, items, status, and assigned driver.

### API Endpoints

The mock server exposes the following API endpoints to the application:

*   `GET /api/orders`
*   `POST /api/warehouse`
*   `DELETE /api/orders/:id`

These endpoints are used by the `OperationsPage` to fetch orders, approve them, and send them to the warehouse.

## Admin Page

The Admin Page, located at `src/admin/AdminPage.jsx`, is the central control panel for managing users and staff in the Thonket system. It provides a secure and intuitive interface for administrators to perform the following tasks:

*   **View All Users:** See a comprehensive list of all users in the system.
*   **View All Staff:** See a comprehensive list of all staff members.
*   **Add New Staff:** Create new staff accounts with the appropriate roles and permissions.
*   **Create New Users:** Add new users to the system and assign them to specific roles.
*   **Manage Roles:** Define and manage user roles and permissions.

## Order Approval and Fulfillment

The order approval and fulfillment process is designed to be efficient and transparent. Here's a step-by-step breakdown of how an order moves through the system:

1.  **Order Placement:** A sales representative places a new order through the Sales Page.
2.  **Order Approval:** The order appears on the Operations Dashboard, where an operations staff member can review it and either approve or reject it.
3.  **Warehouse Notification:** Once an order is approved, it is sent to the Warehouse Page for processing.
4.  **Order Fulfillment:** The warehouse staff picks and packs the order, and then dispatches it for delivery.

## Deployment

This application is currently configured for development and uses a mock server to simulate a backend. For a production deployment, a real backend server and database would be required. The API requests in the application would need to be updated to point to the new backend endpoints.
