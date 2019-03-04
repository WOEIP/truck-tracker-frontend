import axios from 'axios';

const urlRoot = 'https://api.trucktracker.net/';

let Api = {
    get: function (endPoint) {
      return axios.get(urlRoot + endPoint, {withCredentials: true})
        .then(response => {
          // We keep this here, generic API stuff can go here
          return response;
        }).catch(error => {
          console.log(error);
          throw error;
        });
  },

  post: function (endPoint, postObject) {
      return axios.post(urlRoot + endPoint, postObject, {withCredentials: true})
        .then(response => {
          // We keep this here, generic API stuff can go here
            return response;
        }).catch(error => {
          console.log(error);
          throw error;
        });
  }
};

export default Api;
