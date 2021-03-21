import _ from 'lodash';
import firebaseRead from '../../lib/firebaseRead';
import firebaseWrite from '../../lib/firebaseWrite';
import { getRequest } from '../../lib/api';

module.exports = async (req, res) => {
  let statusCode = 200;
  let reply = 'success';
  const request = getRequest(req);

  if (request && request.uid && request.jobid) {
    if (req.method === 'POST' || req.method === 'PUT') {
      reply = await firebaseWrite(`/${request.uid}/kanban/${request.jobid}`, request.body.data) || 'unknown error';
    } else if (req.method === 'GET') {
      reply = await firebaseRead(`/${request.uid}/kanban/${request.jobid}`);
    }
  } else {
    statusCode = 400;
    reply = 'bad API request body format (not proper JSON)';
  }

  res.status(statusCode).send(JSON.stringify(reply));
};