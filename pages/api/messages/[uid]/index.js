import firestoreWrite from 'lib/firestoreWrite';
import firestoreRead from 'lib/firestoreRead';
import { getRequest } from 'lib/api';

module.exports = async (req, res) => {
  let statusCode = 200;
  let reply = 'success';
  const request = getRequest(req);

  if (request && request.uid) {
    if (req.method === 'POST' && request.body) {
      const { data } = request.body;
      reply = await firestoreWrite(
        data,
        'messages',
        request.uid, data.jobid || 'nojob') || 'unknown error';
    } else if (req.method === 'GET' && request.uid) {
      if (request.jobid) reply = await firestoreRead('messages', request.uid, request.jobid) || 'unknown error';
      else reply = await firestoreRead('messages', request.uid) || 'unknown error';
    } else {
      statusCode = 400;
      reply = 'bad API request';
    }
  } else {
    statusCode = 400;
    reply = 'bad API request body format (not proper JSON)';
  }

  res.status(statusCode).send(JSON.stringify(reply));
};