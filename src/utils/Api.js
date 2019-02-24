import axios from 'axios';

const urlRoot = 'https://api.trucktracker.net/';

let Api = {
    get: function (endPoint) {
      return axios.get(urlRoot + endPoint, {withCredentials: true})
    .then(function (response) {
      // We keep this here, generic API stuff can go here
      return response;
    }).catch(function (error) {
      console.log(error);
    });
  },

  post: function (endPoint, postObject) {
      return axios.post(urlRoot + endPoint, postObject, {withCredentials: true})
    .then(function (response) {
      // We keep this here, generic API stuff can go here
      return response;
    }).catch(function (error) {
      console.log(error);
    });
  }
};

export default Api;
