FROM node:18-slim

# Install dependency Chromium
RUN apt-get update && apt-get install -y \
    chromium \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpangocairo-1.0-0 \
    libpango-1.0-0 \
    libcairo2 \
    libgdk-pixbuf2.0-0 \
    libgtk-3-0 \
    libgobject-2.0-0 \
    fonts-liberation \
    libu2f-udev \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

# Jangan download Chromium lagi
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

RUN npm install --production

COPY . .

# Pakai Chromium sistem
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

CMD ["npm", "start"]
