# build program
FROM node:22-alpine AS builder
WORKDIR /app

# Copy only package files & install all deps
COPY package.json package-lock.json ./
RUN npm ci

# Copy in your source
COPY . .

# build the Next.js app
RUN npm run build

# run the website
FROM node:22-alpine
WORKDIR /app

# Install only "dependencies"
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Bring in the compiled output from the builder
COPY --from=builder /app/.next ./.next

# Copy Next.js config if present
COPY --from=builder /app/next.config.mjs ./next.config.mjs

EXPOSE 3000

# start server
CMD ["npm", "start"]
