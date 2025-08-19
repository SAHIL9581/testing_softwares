# API Setup

## 1️⃣ Create `apiClient.js` (core API handler)

This file sets up **one axios instance** with:

* **Base URL** for your backend
* **Default headers**
* **Interceptors** for adding auth tokens and handling errors

```javascript
// src/api/apiClient.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://your-api-url.com", // Change to your backend URL
  timeout: 10000, // 10 sec timeout
  headers: { "Content-Type": "application/json" }
});

// ✅ Add token to every request automatically
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// ✅ Handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized — logging out");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

## 2️⃣ Create `api.js` (different for each endpoint functions)

Here, we define **named functions** for each API call.
Keeps it readable and consistent.

```javascript
// src/api/api.js
import apiClient from "./apiClient";

export const loginUser = (data) => apiClient.post("/auth/login", data);

// Add more endpoints with new js files in api folder...
```

---

## 3️⃣ Use it in pages

Now your pages stay **super clean** and easy to maintain.

```javascript
// src/pages/Login.jsx
import React, { useState } from "react";
import { loginUser } from "../api/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await loginUser({ email, password });
      localStorage.setItem("token", res.data.token);
      alert("Login successful!");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
```

---

## 🔹 How it works

1. **`apiClient.js`** → sets up a single axios instance that automatically:

   * Uses the same base URL for all requests
   * Attaches token to every request
   * Handles errors in one place

2. **`api.js`** → defines clear, reusable functions for each endpoint.

3. **Pages** → just import and call these functions without worrying about axios or token handling.

---

## ✅ Why this is enterprise-grade

* **Centralized config** → If API base URL changes, update in 1 file only.
* **Global error handling** → No need to repeat try/catch logic everywhere.
* **Security** → Token added automatically.
* **Maintainable** → If you add logging, retries, or analytics later, it happens in one place.
* **Scalable** → Works whether you have 10 endpoints or 500.

---


docker-compose down -v && docker-compose up --build