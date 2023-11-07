import { Router } from 'express';
import ip3country from 'ip3country';
const router = Router();
ip3country.init();

export default (app) => {
  app.use('/unstable-api/ip', router);
};

router.get('/get-country', (req, res, next) => {
  // const clientIP = req.ip;
  const clientIP = req.header('x-forwarded-for') || req.socket.remoteAddress;

  // Check if the IP address is "localhost" or "127.0.0.1" and handle it
  if (clientIP === '::1' || clientIP === '127.0.0.1') {
    return res.json({ country: null });
  }

  // Get the country code for the client's IP address
  try {
    const countryCode = ip3country.lookupStr(clientIP);
    if (countryCode) {
      res.json({ country: countryCode, ip: clientIP });
    } else {
      res.json({ country: null, ip: clientIP });
    }
  } catch(err) {
    res.status(500).json({ country: null, error: 'Internal Server Error' });
  }
});