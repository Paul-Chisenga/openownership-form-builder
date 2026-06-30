# ---- 1. Development Dependencies Stage ----
FROM node:24-alpine AS development-dependencies-env
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

# ---- 2. Production Dependencies Stage ----
FROM node:24-alpine AS production-dependencies-env
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

# ---- 3. Build Stage ----
FROM node:24-alpine AS build-env
WORKDIR /app
COPY . .
COPY --from=development-dependencies-env /app/node_modules ./node_modules
# Generates the Prisma client directly into /app/app/generated/prisma
RUN npx prisma generate
RUN npm run build

# ---- 4. Final Runtime Stage ----
FROM node:24-alpine AS runtime
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Copy only production dependencies
COPY --from=production-dependencies-env /app/node_modules ./node_modules

# --- NEW PRISMA PATH FIX ---
# Copy your custom generated Prisma folder entirely from the build stage
COPY --from=build-env /app/app/generated/prisma ./app/generated/prisma
COPY --from=build-env /app/prisma ./prisma

# Copy built application assets and your root server file
COPY --from=build-env /app/build ./build
COPY --from=build-env /app/server.js ./server.js

# Environment settings
ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "run", "start"]