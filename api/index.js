import { app, initApp } from '../server/server.js';

let initialized = false;

export default async function handler(req, res) {
  if (!initialized) {
    try {
      await initApp();
      initialized = true;
    } catch (err) {
      console.error('Failed to initialize serverless application:', err);
    }
  }

  return app(req, res);
}
