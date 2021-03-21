import { getRequest } from '../../lib/api';

module.exports = (req, res) => {
  const request = getRequest(req);
  console.log(request);
  res.status(200).redirect(req.headers.referer);
};