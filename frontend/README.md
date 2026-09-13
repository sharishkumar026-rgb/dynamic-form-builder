# Dynamic Form Builder - Frontend

Frontend application for the **Dynamic Form Builder & Response Management System**.

This application provides a user interface for creating dynamic forms, managing form fields, submitting and managing responses, viewing dashboards and analytics, generating reports, and managing users based on role permissions.

---

## Technology Stack

- React
- TypeScript
- Vite
- Material UI
- React Router
- Axios
- Chart.js
- React Chart.js 2
- CSS

---

## Project Structure

```text
frontend/
│
├── public/
│
├── src/
│   │
│   ├── api/
│   │
│   ├── components/
│   │   ├── analytics/
│   │   ├── common/
│   │   ├── dashboard/
│   │   ├── forms/
│   │   ├── layout/
│   │   ├── reports/
│   │   └── users/
│   │
│   ├── config/
│   │
│   ├── hooks/
│   │
│   ├── pages/
│   │   ├── analytics/
│   │   ├── dashboard/
│   │   ├── forms/
│   │   ├── reports/
│   │   ├── responses/
│   │   └── users/
│   │
│   ├── routes/
│   │
│   ├── store/
│   │
│   ├── theme/
│   │
│   ├── types/
│   │
│   ├── utils/
│   │
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
│
├── .env
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md