FROM node:18-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    bash

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
FROM base AS dependencies
RUN npm install --production --legacy-peer-deps --no-package-lock
RUN cp -R node_modules /prod_node_modules

# Build application
FROM base AS build
COPY package.json ./
RUN npm install --legacy-peer-deps --no-package-lock
COPY . .
RUN npm run build:server

# Production image
FROM base AS production
ENV NODE_ENV=production

COPY --from=dependencies /prod_node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/medusa-config.js ./
COPY --from=build /app/package.json ./

# Expose ports
EXPOSE 9000
EXPOSE 7001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:9000/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"

# Start application
CMD ["npm", "run", "start:railway"]

