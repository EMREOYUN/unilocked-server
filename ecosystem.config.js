module.exports = {
  apps: [
    {
      script: "build/index.js",
      instances: "max",
      exec_mode: "cluster",
    },
  ],
};
