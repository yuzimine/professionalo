import firestoreRead from 'lib/firestoreRead';
import { getRequest } from 'lib/api';

module.exports = async (req, res) => {
  let statusCode = 200;
  let reply = 'success';
  const request = getRequest(req);

  if (request && request.uid) {
    if (req.method === 'GET') {
      if (request.slug) {
        const id = slug[0];
        reply = await firestoreRead(`/messages/${request.uid}/${id}`) || 'unknown error';
      } else {
        reply = await firestoreRead(`/messages/${request.uid}`) || 'unknown error';
      }
    }
  } else {
    statusCode = 400;
    reply = 'bad API request body format (not proper JSON)';
  }
  
  res.status(statusCode).send(JSON.stringify(reply));
};