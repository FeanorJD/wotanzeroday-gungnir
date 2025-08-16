# Wotanzeroday Gungnir - Docker Configuration
# Author: Pablo Bobadilla - SOC L3

FROM node:18-alpine as builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app to nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Add labels
LABEL maintainer="Pablo Bobadilla <pablo.bobadilla@cybersec.ar>"
LABEL description="Wotanzeroday Gungnir - Advanced SOC Platform"
LABEL version="2.3.1"

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
