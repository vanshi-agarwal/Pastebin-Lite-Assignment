# Pastebin Lite

Pastebin Lite is a minimal web application that allows users to create and share text snippets using a unique URL.  
The goal of this project is to demonstrate backend logic, API design, and deployment using modern web technologies.

---

## 🚀 Features

- Create text snippets instantly
- Each paste is accessible via a unique URL
- Simple and clean user interface
- Fast retrieval using key-value storage
- Server-side rendering with Next.js App Router

---

## 🛠 Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Storage:** Vercel KV / Redis
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

---

## Deterministic Testing

When `TEST_MODE=1` is set, the application reads the current time from the
`x-test-now-ms` request header to ensure deterministic expiry testing.
If the header is absent, real system time is used.

---

## ⚙️ How It Works

1. A user enters text and submits the form
2. The backend generates a unique ID for the paste
3. The content is stored in Redis (Vercel KV)
4. The user receives a shareable URL
5. When the URL is opened, the paste content is fetched and displayed

---

## 🧪 Running Locally

1. Clone the repository
   ```bash
   git clone https://github.com/vanshi-agarwal/Pastebin-Lite-Assignment.git
