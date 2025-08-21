module.exports = {
  apps: [
    {
      name: "whatsapp-bot",
      script: "index.js",
      watch: true,
      autorestart: true,
      max_memory_restart: "300M", // restart kalau makan RAM > 300MB
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
