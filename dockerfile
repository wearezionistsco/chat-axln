# Gunakan Node.js versi LTS yang ringan
FROM node:18-slim

# Install dependency sistem untuk Chromium / Puppeteer
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

# Set working directory
WORKDIR /app

# Copy package.json & package-lock.json terlebih dahulu (biar cache lebih efisien)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy semua source code
COPY . .

# Set environment variable supaya Puppeteer pakai Chromium dari sistem
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Expose port (kalau ada web server, kalau tidak boleh di-skip)
EXPOSE 3000

# Start bot
CMD ["npm", "start"]
