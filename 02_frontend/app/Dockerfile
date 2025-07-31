# Use the Node.js image to build the frontend
FROM node:20 AS frontend-build
WORKDIR /frontend
COPY . .
RUN yarn install
RUN yarn build

# Use a minimal image to serve the frontend
FROM nginx:alpine
COPY --from=frontend-build /frontend/build /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the default port for frontend
EXPOSE 80

# Start the frontend
CMD ["nginx", "-g", "daemon off;"]
