# ─── Stage 1: Node builder ───────────────────────────────────────────────────
FROM node:20-slim AS builder

WORKDIR /app

# Install dependencies first (layer-cache friendly)
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the source
COPY . .

# Maps are powered by Leaflet + OpenStreetMap — no API key needed.
ARG VITE_API_BASE_URL="/api/v1"
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build


# ─── Stage 2: Nginx runtime ─────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runtime

# Remove default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom config
COPY nginx.conf /etc/nginx/conf.d/civicai.conf

# Copy the built React app
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=15s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
