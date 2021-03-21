import firebaseRead from '../../lib/firebaseRead';
import { getRequest } from '../../lib/api';

module.exports = async (req, res) => {
  let statusCode = 200;
  let reply = 'success';
  const request = getRequest(req);

  if (request && request.id) {
    if (req.method === 'GET') {
      reply = await firebaseRead(`/users/${request.id}`) || 'unknown error';
    }
  } else {
    statusCode = 400;
    reply = 'bad API request body format (not proper JSON)';
  }

  res.status(statusCode).send(JSON.stringify(reply));
};