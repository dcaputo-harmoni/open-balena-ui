const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const jwt = require('njwt');

require('dotenv').config()

const app = express();

app.use(cors());

app.use('/', createProxyMiddleware({
  target: `${process.env.POSTGREST_URL}`,
  onProxyReq: async (proxyReq, req, res) => {
    try {
      jwt.verify(req.headers.authorization.split("Bearer ")[1], process.env.OPENBALENA_JWT_SECRET);
      const token = jwt.create({role: "docker"}, process.env.OPENBALENA_JWT_SECRET).compact();
      proxyReq.setHeader("Authorization", `Bearer ${token}`);
    } catch (e) {
      console.log("Token verification failed");
      proxyReq.destroy();
  }
  },
  changeOrigin: true,
}));
app.listen(8000);