import axios from 'axios';

const baseUrl = process.env.API_BASE || '';

const parseUrl = (url, params) => {
  params = params || {};
  const str = Object.keys(params).reduce((result, key) => {
    result += `${key}=${params[key]}&`;
    return result;
  }, '');
  return `${baseUrl}/api${url}?${str.substr(0, str.length - 1)}`;
};

export const get = (url, params) => new Promise((resolve, reject) => {
  axios.get(parseUrl(url, params)).then((resp) => {
    const { data } = resp;
    if (data && data.success === true) {
      resolve(data);
    } else {
      reject(data);
    }
  }).catch((err) => {
    if (err.response) {
      reject(err.response.data);
    } else {
      reject(err);
    }
  });
});

export const post = (url, params, _data) => new Promise((resolve, reject) => {
  axios.post(parseUrl(url, params), _data).then((resp) => {
    const { data } = resp;
    if (data && data.success === true) {
      resolve(data);
    } else {
      reject(data);
    }
  }).catch((err) => {
    if (err.response) {
      reject(err.response.data);
    } else {
      const res = {
        success: false,
        err_msg: err.message,
      };
      reject(res);
    }
  });
});
