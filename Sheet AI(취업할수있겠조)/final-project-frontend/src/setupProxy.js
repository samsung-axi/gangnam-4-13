const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    ['/api', '/login'], // ✅ 반드시 /login 포함!
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
    })
  );
};
