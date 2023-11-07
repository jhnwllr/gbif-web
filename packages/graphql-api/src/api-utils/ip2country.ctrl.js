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
    return res.json({ country: null, error: 'Localhost' });
  }

  // Get the country code for the client's IP address
  try {
    const countryCode = ip3country.lookupStr(clientIP);
    const debugInfo = {
      forwardedFor: req.header('x-forwarded-for'),
      reqIp: req.ip,
      remoteAddress: req.socket.remoteAddress
    }
    if (countryCode) {
      res.json({ country: countryCode, ip: clientIP, ...debugInfo });
    } else {
      res.json({ country: null, ip: clientIP, ...debugInfo, error: 'No country code found' });
    }
  } catch(err) {
    res.status(500).json({ country: null, error: 'Internal Server Error' });
  }
});