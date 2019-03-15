import React from 'react';
import axios from 'axios';

const {
  accessToken,
} = require('../../config/accessToken');

const topics = () => {
  axios.get('/api/topics').then((resp) => {
    console.log(resp);
  }).catch((err) => {
    console.log(err);
  });
};

const loign = () => {
  axios.post('/api/user/login', {
    accessToken,
  }).then((resp) => {
    console.log(resp);
  }).catch((err) => {
    console.log(err);
  });
};

const markAll = () => {
  axios.post('/api/message/mark_all?needAccessToken=true')
    .then((resp) => {
      console.log(resp);
    }).catch((err) => {
      console.log(err);
    });
};

const ApiTest = () => (
  <div>
    <button type="button" onClick={topics}>topics</button>
    <button type="button" onClick={loign}>loign</button>
    <button type="button" onClick={markAll}>markAll</button>
  </div>
);

export default ApiTest;
