module.exports = {
<<<<<<< HEAD
  apps: [{
    name: "blog",
    script: "/home/ubuntu/.nvm/versions/node/v22.22.3/bin/node",
    args: "/root/Blog/node_modules/next/dist/bin/next start",
    cwd: "/root/Blog",
    env: {
      PORT: 3000,
      NODE_ENV: "production"
    }
  }]
=======
  apps: [
    {
      name: "blog",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      cwd: "/var/www/blog",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
>>>>>>> ceccea7d4b1b0185759feaad8a061764536e7fdd
};
