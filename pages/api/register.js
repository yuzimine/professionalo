import { getRequest } from 'lib/api';
import firestoreWrite from 'lib/firestoreWrite';

module.exports = async (req, res) => {
  let statusCode = 200;
  let reply = 'success';
  const request = getRequest(req);

  if (request) {
    if (req.method === 'POST') {
      reply = await firestoreWrite(
        request.body.profile,
        'users',
        request.id !== '' ? request.id : null) || 'unknown error';
    }
  } else {
    statusCode = 400;
    reply = 'bad API request body format (not proper JSON)';
  }

  res.status(statusCode).send(JSON.stringify(reply));
};