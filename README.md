# QuickCuts Barbershop Queue API

A small Express + SQLite backend for managing a walk-in barbershop queue. Customers are added, staff update their status as they move through the shop, and entries are removed once they leave.

## Setup

npm install
cp .env.example .env
node server.js

Server runs at http://localhost:3000

## Data

Table: queue
- id - auto-generated
- customerName - required text
- serviceType - one of: Haircut, Shave, Haircut + Shave
- status - one of: Waiting, In Chair, Done
- timeIn - set automatically by the server

## Routes

GET /queue - public, lists every entry
GET /queue/:id - public, gets one entry, 404 if not found
POST /queue - requires API key, adds a customer
PUT /queue/:id - requires API key, updates status only
DELETE /queue/:id - requires API key, removes an entry

Protected routes need an x-api-key header matching API_KEY in .env.
Missing or wrong key returns 401. Bad input returns 400. Unknown id returns 404.

## Other features

- One centralized error handler so the server never crashes
- Rate limiting on the whole app (30 requests per minute)

## Testing

Tested manually in Thunder Client, including failing cases like a missing key, bad data, and a wrong id.
