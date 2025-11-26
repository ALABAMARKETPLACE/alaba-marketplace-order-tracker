# Alaba Marketplace – Next.js Frontend

Alaba Marketplace is a multi-role logistics and e-commerce platform for buyers, sellers, delivery companies, and drivers.
This repository (`alaba-mp`) contains the **Next.js** frontend that talks to the NestJS backend (`new-alaba-marketplace`).

---

## Features

### Buyers
- Browse products by category (electronics, fashion, home & garden, etc.).
- Add products to cart, update quantities, and remove items.
- Create orders with full delivery address (street, city, state, phone).
- View all orders with totals and statuses.
- Detailed order page:
  - 6-step delivery timeline (Order placed → Picked up → In transit → Out for delivery → Package received → Delivered).
  - High-level phase badge (In progress, In transit, Completed).
  - Ownership barcode and delivery confirmation code.
  - Driver information when assigned.
  - Upload and view delivery images.
- Pay with **Paystack**, with a dedicated callback page that verifies the payment and shows success/failure clearly.

### Sellers
- Role-based dashboard sections for managing products (depending on backend capabilities).
- Can see orders that involve their products (via the shared orders views).

### Delivery Companies
- **Company Dashboard** with access restricted to `company` role.
- **Marketplace Orders**:
  - View orders with no assigned delivery company.
  - Accept marketplace orders and attach them to your company.
- **My Drivers**:
  - See all drivers attached to your company.
  - Assign drivers to orders by ID.
- **Driver Directory & Invitations**:
  - Global directory of drivers (user role = `driver`).
  - Send invitations to drivers; when they accept, they become company drivers.
- **Driver Tracking**:
  - See orders currently out for delivery with drivers.
  - Quick view of driver, delivery address, and order status.

### Drivers
- See deliveries assigned to them.
- Confirm deliveries using the buyer’s delivery code.
- View and accept invitations from delivery companies to join their fleets.

---

## Tech Stack

- **Framework:** Next.js (App Router, TypeScript)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, shadcn/ui, Radix UI
- **State/Data:** React Query (TanStack Query)
- **HTTP:** Axios with a custom `ApiClient` (access token + refresh handling)
- **Forms & Validation:** React Hook Form + Zod
- **Icons:** lucide-react
- **Backend (separate repo):** NestJS + Sequelize + PostgreSQL

---

## Project Structure

```text
src/
  app/
    (auth)/          # Login, register
    (dashboard)/     # Role-based dashboards (buyer, seller, driver, company)
      cart/
      products/
      orders/
      company/
      driver/
    payment/
      callback/      # Paystack callback handler
    track/           # Public order tracking page
  components/
    orders/          # Timeline, status badges, dialogs, etc.
    products/
    cart/
    ui/              # shadcn/ui primitives
  lib/
    api/
      client.ts      # Axios client with auth & refresh logic
      endpoints/     # Typed endpoints (orders, products, drivers, paystack,...)
    hooks/           # React Query hooks (use-orders, use-products, use-auth,...)
    constants.ts     # API URLs, roles, order statuses, default product image
    utils.ts         # Helpers (formatCurrency, formatDate,...)
  types/
    auth.ts, order.ts, product.ts, payment.ts, cart.ts, ...
```

---

## Prerequisites

- **Node.js** >= 18
- **npm** or **pnpm**
- A running backend instance (`new-alaba-marketplace`) with migrations + seeders applied.

---

## Environment Setup

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3002  # Backend base URL (NestJS API)
NEXT_PUBLIC_APP_URL=http://localhost:3001       # Frontend URL (Next.js app)
```

The frontend uses `NEXT_PUBLIC_API_BASE_URL` for all API calls (e.g. `/api/v1/orders`, `/api/v1/products`).

---

## Installation & Running

From the `alaba-mp` directory:

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

The app will start on the default Next.js port (usually `http://localhost:3000` or 3001).

### Production Build

```bash
npm run build
npm start
```

---

## Linting & Type Checking

```bash
# ESLint
npm run lint

# TypeScript type-check
npm run type-check
```

Both commands must pass before deploying to production.

---

## Key Flows

### Orders & Timeline

1. Buyer adds products to cart and proceeds to checkout.
2. Cart page collects delivery address, city, state, and phone.
3. Frontend calls `/api/v1/orders` to create an order.
4. Order details page shows:
   - Items and totals
   - Delivery address
   - Timeline driven by backend `status` and tracking events
   - High-level phase (In progress/In transit/Completed)

### Payment (Paystack)

1. On the order details page, buyer enters email and clicks **Pay with Paystack**.
2. Frontend calls `/api/v1/paystack/initialize` with `{ orderId, amount, email, ... }`.
3. User is redirected to Paystack hosted checkout.
4. Paystack calls back to `/payment/callback?reference=...` (or `trxref`).
5. Callback page calls `/api/v1/paystack/verify`:
   - In dev, backend mocks a successful payment and updates the order.
   - In prod, backend verifies with real Paystack API.
6. UI shows success or failure, plus barcode and tracking reference.

### Delivery & Drivers

- Delivery companies:
  - Accept marketplace orders.
  - Invite drivers via the directory.
  - See only **unattached** drivers in the directory; accepted drivers move to **My Drivers**.
- Drivers:
  - See invitations on `/driver/invitations` and accept them.
  - Can be attached to multiple companies.
- Buyers:
  - Confirm package received and final delivery using the provided codes.

---

## GitHub / Deployment Notes

- `.gitignore` excludes `node_modules`, `.next`, build artifacts, env files, logs, editor files, and `uploads/`.
- `next.config.js` is configured for:
  - `images.unsplash.com` (hero and default product image)
  - `alaba-marketplace.s3.amazonaws.com` (S3 uploads in production)

Before making the repo public, you may want to:
- Add screenshots or a short demo section.
- Add CI (GitHub Actions) for `npm run lint` and `npm run type-check`.
- Clarify licensing.

---

## License

This project is proprietary to the Alaba Marketplace team. Update this section if you plan to open-source it.
