# quote-app/Dockerfile

# 1) Builder: install dependencies & produce a production build
FROM node:22-alpine AS builder
WORKDIR /app

# Copy only package files & install all deps
COPY package.json package-lock.json ./
RUN npm ci

# Copy in your source & build the Next.js app
COPY . .
RUN npm run build

# 2) Runner: install only prod deps + copy build output
FROM node:22-alpine AS runner
WORKDIR /app

# Install only "dependencies"
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Bring in the compiled output from the builder
COPY --from=builder /app/.next ./.next
# If you have a `public/` folder, uncomment the next line:
# COPY --from=builder /app/public ./public

# Copy Next.js config if present
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Tell Docker we’ll listen on 3000
EXPOSE 3000

# Start the Next.js server
CMD ["npm", "start"]
