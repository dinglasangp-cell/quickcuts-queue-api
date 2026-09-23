// Protects POST/PUT/DELETE. GET routes stay public, so this is only
// attached to the routes that need it, not app-wide.
function requireApiKey(req, res, next) {
  const key = req.header('x-api-key');

  if (!key || key !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized: missing or invalid API key' });
  }

  next();
}

module.exports = requireApiKey;
