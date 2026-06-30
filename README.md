# Dynamic Form Builder Engine

## Live Demo

- **URL**: https://openownership-form-builder.onrender.com/

## Overview

This repository contains a completed technical assessment project: a full-stack, configuration-driven Dynamic Form Builder Engine.

Users can create custom form layouts, add typed fields, attach validation rules, and collect submission responses. The app uses a dynamic frontend form generation strategy together with runtime schema validation to keep form configuration, validation, and persistence aligned.

Built with:

- React Router v8 (Framework Mode)
- React 19 + React Hook Form
- Zod validation
- Express + server-side routing
- Prisma ORM with MongoDB
- Tailwind-inspired UI components

## What the app does

- Manage multiple form layouts
- Add typed fields to each layout (`STRING`, `EMAIL`, `NUMBER`)
- Add field validation rules: `REQUIRED`, `MIN`, `MAX`
- Build submission forms dynamically from saved field metadata
- Validate submissions against generated Zod schemas
- Persist form layout, fields, submissions, and answer snapshots in MongoDB
- Display submission history per form layout

## Why this approach

I chose a mostly relational design for the core data model to support traceability and future scaling.

- `FormLayout`, `FormField`, `FormSubmission`, and `FormAnswer` are modeled with strict relations.
- `FormAnswer` stores submitted values alongside the field snapshot, which makes submission history immutable even when a field changes later.
- `FormField.validationRules` remains a JSON object because the rule set is simple and this avoids an extra pivot table without sacrificing clarity.
- Zod was chosen because it offers flexibility for dynamic schema generation and helps keep validation consistent between frontend and backend.
- React Hook Form was chosen for the frontend because it is flexible and works well with dynamic form generation.
- Prisma was chosen for the ORM because it is TypeScript-first and integrates cleanly with the stack.
- MongoDB was chosen because it is strong enough for this feature set and maps well to the semi-structured rule storage approach, especially when used via Atlas.

## Data model notes

- `InputDataType` defines field categories and allowed rules.
- `ValidationRule` defines rule kinds such as `REQUIRED`, `MIN`, and `MAX`.
- `FormLayout` is the configuration container for a form.
- `FormField` stores the field definition, label, type, and validation rule metadata.
- `FormSubmission` stores a submission event and a snapshot of the layout.
- `FormAnswer` stores each submitted field answer and its field metadata.

This design supports stable audit trails and safer data migration over time.

## Frontend strategy

The frontend uses `react-hook-form` for form state and validation.

- The dynamic form generation is implemented in `app/components/forms/DynamicForm.tsx`.
- Field creation and validation flows are visible in `app/components/forms/form-layout/`, `app/components/forms/form-field.tsx`, and `app/components/forms/field-rule.tsx`.
- The app reuses shared Zod schemas for layout and field creation, while the submission schema is generated at runtime from saved field metadata.

## Backend strategy

- Static form creation schemas live in `app/validation/schemas/`
- Runtime submission schema generation is implemented in `app/utils/validation.ts`
- Route actions and loaders are implemented in `app/routes/`
- Prisma data access is centralized through `app/lib/prisma.server.ts`

## Environment and startup

### `.env` configuration

The app expects the MongoDB connection string in `.env`.

```env
DATABASE_URL="mongodb+srv://open-ownership:Test%40db4Openownership@cluster0.tk0xb.mongodb.net/form-builder?appName=Cluster0"
```

### Install dependencies

```bash
npm install
```

### Generate Prisma client types

```bash
npx prisma generate
```

### Run development mode

```bash
npm run dev
```

Then open http://localhost:3000

### Local production mode

React Router does not automatically load `.env` when running the built app locally, so use:

```bash
npm run build
node --env-file .env server.js
```

This is only required for local production testing. Docker and hosted deployments can continue to use `npm start`.

### Database setup

```bash
npm run migrate
npm run seed
```

Reset and reseed:

```bash
npm run seed:fresh
```

### Docker

```bash
docker-compose up --build
```

The app will be available at http://localhost:3000

## Scripts

- `npm run dev` — start development server
- `npm run build` — build the app for production
- `npm start` — run production server
- `npm run typecheck` — generate route types and run TypeScript
- `npm run migrate` — push Prisma schema to MongoDB
- `npm run seed` — seed initial data
- `npm run seed:fresh` — reset and seed database

## Trade-offs and future improvements

### Trade-offs

- No unit tests were implemented in this submission.
- I used Zod because it allows flexible form schema generation and consistent validation for both frontend and backend.
- I kept `FormField.validationRules` as JSON instead of modeling a full pivot table because the rule structure is small and fixed, and this simplifies storage without losing correctness.
- I intentionally modeled `FormAnswer` as a separate entity instead of embedding all submission data directly in `FormSubmission` to preserve the submission snapshot and support future scaling.

### What I would add with more time

- Add unit tests for the dynamic validation logic, route actions, and form creation flows.
- Support more advanced validation rules and nested schemas.
- Add a separate frontend `InputType` model to map `FormField` to actual input controls (checkbox, select, radio, multi-select, etc.).
- Consider a Laravel+React split if the product needed a stronger backend validation and domain-driven architecture.
- Add better error reporting and field-level validation feedback in the submission UI.

## AI tools used

- Gemini Chat — used for concept review, debugging, Dockerfile optimization, and research into deployment patterns.
- GitHub Copilot in VS Code — used to help generate and refine README text and code suggestions.

## Notes

- The live deployment is available at https://openownership-form-builder.onrender.com/
- Local production testing should use `node --env-file .env server.js` because `react-router build` does not load `.env` by itself.
- Docker and other hosted deployments can continue using `npm start` as-is.
