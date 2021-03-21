/**
 * REST API for Writing User Profile Data
 */

import { getSession } from 'next-auth/client';
import firestoreRead from 'lib/firestoreRead';
import firestoreWrite from 'lib/firestoreWrite';
import { getRequest } from 'lib/api';

module.exports = async (req, res) => {
  let statusCode = 200;
  let reply = 'success';
  const request = getRequest(req);
  const session = await getSession({ req });

  if (session && request && req) {
    if (req.method === 'GET') {
      reply = await firestoreRead(
        'users',
        request.id !== '' ? request.id : null) || 'unknown error';
    }
    if (req.method === 'POST') {
      reply = await firestoreWrite(
        request.body.profile,
        'users',
        request.id) || 'unknown error';
    }
  } else {
    statusCode = 400;
    if (!session) {
      reply = 'unauthorized API access (you must first login)';
    } else {
      reply = 'bad API request body format (not proper JSON)';
    }
  }

  res.status(statusCode).send(JSON.stringify(reply));
};