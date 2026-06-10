module.exports = {
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
};
