# 🍽️ Restaurant Operations Platform (ROP) Core

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE.md)
[![Database](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://www.postgresql.org/)
[![Backend](https://img.shields.io/badge/Backend-Node.js/Express-brightgreen.svg)](https://nodejs.org/) <!-- Replace with your backend tech -->
[![Frontend](https://img.shields.io/badge/Frontend-React/Vue-cyan.svg)](https://reactjs.org/) <!-- Replace with your frontend tech -->
[![Status](https://img.shields.io/badge/status-active--development-green.svg)]()

A modern, scalable platform for streamlining end-to-end restaurant operations, from table management and order processing to inventory control and analytics. Features multi-location support and robust role-based access.

## ✨ Core Features

✅ **Operations Management**
-   🧑‍💼 **Staff Management:** Role-Based Access Control (Admin, Manager, Waiter, Chef, Cashier), Shift Scheduling (basic).
-   🏪 **Multi-Location/Branch Support:** Centralized management for chain restaurants.
-   🍽️ **Table Management:** Visual layout, status tracking (Available, Occupied, Reserved, Needs Cleaning), merging/splitting.
-   📅 **Reservation System:** Booking management, waitlist functionality.

✅ **Order & Menu**
-   📝 **Order Processing:** POS integration, KDS communication, order tracking (Placed, Preparing, Ready, Served).
-   🍲 **Menu Engineering:** Dynamic menu items, categories, modifiers, pricing tiers, allergen info.
-   🧾 **Billing & Payments:** Bill splitting, discount application, payment gateway integration.

✅ **Inventory & Supply Chain**
-   📦 **Inventory Control:** Real-time tracking of ingredients & supplies, low stock alerts.
-   🌿 **Recipe Management:** Ingredient mapping to menu items for accurate costing & consumption.
-   🤝 **Supplier Management:** Basic supplier database and purchase order tracking.

✅ **System & Data**
-   📊 **Reporting & Analytics:** Sales insights, popular items, inventory usage, staff performance.
-   🛡️ **Audit Trails:** Comprehensive logging of critical actions and data changes.
-   ⚙️ **System Configuration:** Customizable settings (taxes, service charges, restaurant details).
-   🔑 **Secure Authentication:** JWT-based or similar secure login mechanisms.

✅ **Technical Foundation**
-   🆔 **UUID Primary Keys:** For globally unique identifiers.
-   🧱 **Normalized Relational Structure:** With strategic use of JSONB for flexibility (e.g., custom modifiers, dynamic attributes).
-   ☁️ **Scalable Architecture:** Designed for growth and potential cloud deployment.

## 📊 Schema Overview (Simplified ERD)

This diagram illustrates the core relationships between key entities in the Restaurant Operations Platform.

```mermaid
erDiagram
    STAFF {
        UUID staff_id PK
        VARCHAR name
        VARCHAR email
        VARCHAR password_hash
        UUID role_id FK
        UUID restaurant_id FK "nullable, for multi-location"
    }
    ROLES {
        UUID role_id PK
        VARCHAR role_name
        JSONB permissions
    }
    RESTAURANTS {
        UUID restaurant_id PK
        VARCHAR name
        VARCHAR address
        JSONB settings "e.g., tax_rate, currency"
    }
    TABLES {
        UUID table_id PK
        UUID restaurant_id FK
        VARCHAR table_number
        VARCHAR status "Available, Occupied, Reserved"
        INT capacity
    }
    MENU_ITEMS {
        UUID item_id PK
        UUID category_id FK
        VARCHAR name
        TEXT description
        DECIMAL price
        BOOLEAN is_available
        JSONB modifiers_available "e.g., size, toppings"
        JSONB allergen_info
    }
    CATEGORIES {
        UUID category_id PK
        VARCHAR name
    }
    INGREDIENTS {
        UUID ingredient_id PK
        VARCHAR name
        VARCHAR unit_of_measure
        DECIMAL cost_per_unit
    }
    RECIPE_COMPONENTS {
        UUID recipe_component_id PK
        UUID item_id FK "FK to MENU_ITEMS"
        UUID ingredient_id FK
        DECIMAL quantity_used
    }
    INVENTORY {
        UUID inventory_id PK
        UUID ingredient_id FK
        UUID restaurant_id FK
        DECIMAL current_stock
        DECIMAL low_stock_threshold
    }
    ORDERS {
        UUID order_id PK
        UUID staff_id FK "waiter/cashier"
        UUID table_id FK "nullable, for takeaway/delivery"
        UUID customer_id FK "nullable"
        VARCHAR status "Placed, Preparing, Ready, Served, Paid, Cancelled"
        TIMESTAMP created_at
        DECIMAL total_amount
        DECIMAL discount_amount
        DECIMAL final_amount
    }
    ORDER_ITEMS {
        UUID order_item_id PK
        UUID order_id FK
        UUID item_id FK "FK to MENU_ITEMS"
        INT quantity
        DECIMAL unit_price_at_order
        JSONB applied_modifiers
        TEXT notes
    }
    PAYMENTS {
        UUID payment_id PK
        UUID order_id FK
        VARCHAR payment_method
        DECIMAL amount_paid
        TIMESTAMP payment_date
        VARCHAR transaction_ref
    }
    RESERVATIONS {
        UUID reservation_id PK
        UUID customer_id FK "nullable, guest name stored directly"
        UUID table_id FK
        UUID restaurant_id FK
        VARCHAR customer_name
        VARCHAR customer_phone
        TIMESTAMP reservation_time
        INT party_size
        VARCHAR status "Confirmed, Seated, Cancelled, No-show"
    }
    AUDIT_LOGS {
        UUID log_id PK
        UUID staff_id FK "who performed action"
        VARCHAR entity_affected
        UUID entity_id
        VARCHAR action_type "CREATE, UPDATE, DELETE"
        JSONB old_values "nullable"
        JSONB new_values "nullable"
        TIMESTAMP timestamp
    }

    STAFF ||--o{ ORDERS : "manages"
    STAFF ||--|{ ROLES : "has"
    STAFF }o--|| RESTAURANTS : "works_at (optional)"
    RESTAURANTS ||--o{ TABLES : "has"
    RESTAURANTS ||--o{ INVENTORY : "maintains"
    RESTAURANTS ||--o{ RESERVATIONS : "accepts"
    MENU_ITEMS ||--|{ CATEGORIES : "belongs_to"
    MENU_ITEMS ||--o{ RECIPE_COMPONENTS : "composed_of"
    INGREDIENTS ||--o{ RECIPE_COMPONENTS : "used_in"
    INGREDIENTS ||--o{ INVENTORY : "tracked_as"
    ORDERS ||--o{ ORDER_ITEMS : "contains"
    ORDERS ||--|{ TABLES : "assigned_to (optional)"
    ORDER_ITEMS }|--|| MENU_ITEMS : "is_a"
    ORDERS ||--o{ PAYMENTS : "settled_by"
    RESERVATIONS ||--|{ TABLES : "books"
    AUDIT_LOGS ||--|{ STAFF : "action_by (optional)"
