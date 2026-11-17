FROM node:24-bookworm-slim
WORKDIR /app
COPY package.json package-lock.json ./
ARG HUSKY=0
RUN npm ci
RUN npx playwright install --with-deps chromium
COPY . .
CMD ["npx", "allure", "run", "--", "npm", "test"]