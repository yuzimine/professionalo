import _ from 'lodash';

export const fetcher = (...args) => fetch(...args).then(res => res.json());

export const fetchApi = async (endPoint, header) => {
  const res = await fetcher(
    `${location.origin}/api/${endPoint}`,
    header,
  );
  return res;
};

export const postApi = async (endPoint, data) => {
  return await fetchApi(endPoint, {
    method: 'POST',
    body: data,
  });
};

export const putApi = async (endPoint, data) => {
  return await fetchApi(endPoint, {
    method: 'PUT',
    body: data,
  });
};

export const getApi = async (endPoint) => {
  return await fetchApi(endPoint, {
    method: 'GET'
  });
};

export const getRequest = (req) => {
  let reply = [];

  if (!_.isEmpty(req.query)) {
    reply = req.query;
  }
  if (!_.isEmpty(req.body) && !_.isNil(req.body)) {
    try {
      reply['body'] = JSON.parse(req.body);
    } catch {
      reply['error'] = 'request error';
    }
  }

  return reply;
};