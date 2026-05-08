const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 8787;
const KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_replace_me';
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'replace_me';

function json(res, code, data) {
  res.writeHead(code, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(data));
}

function createSignature(orderId, paymentId) {
  const crypto = require('crypto');
  return crypto.createHmac('sha256', KEY_SECRET).update(`${orderId}|${paymentId}`).digest('hex');
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return res.end();
  }

  if (req.url === '/api/config' && req.method === 'GET') return json(res, 200, { keyId: KEY_ID });

  if (req.url === '/api/create-order' && req.method === 'POST') {
    let body = '';
    req.on('data', (c) => (body += c));
    return req.on('end', async () => {
      try {
        const { amount = 149900, currency = 'INR', receipt = `rcpt_${Date.now()}` } = JSON.parse(body || '{}');
        const auth = Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString('base64');
        const resp = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount, currency, receipt }),
        });
        const data = await resp.json();
        if (!resp.ok) return json(res, 500, { error: data.error || data });
        return json(res, 200, data);
      } catch (e) {
        return json(res, 500, { error: e.message });
      }
    });
  }

  if (req.url === '/api/verify-payment' && req.method === 'POST') {
    let body = '';
    req.on('data', (c) => (body += c));
    return req.on('end', () => {
      try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = JSON.parse(body || '{}');
        const expected = createSignature(razorpay_order_id, razorpay_payment_id);
        return json(res, 200, { verified: expected === razorpay_signature });
      } catch (e) {
        return json(res, 400, { verified: false, error: e.message });
      }
    });
  }

  json(res, 404, { error: 'Not found' });
});

server.listen(PORT, () => {
  console.log(`AgriFit payment API listening on http://localhost:${PORT}`);
});
