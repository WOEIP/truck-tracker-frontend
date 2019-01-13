import axios from 'axios';

const urlRoot = 'http://api.trucktracker.net/';

let Api = {
    get: function (endPoint) {
    axios.get(this.urlRoot + endPoint, {
    }).then(function (response) {
      console.log(response);
    }).catch(function (error) {
      console.log(error);
    });
  },

  post: function (endPoint, postObject) {
    axios.post(urlRoot + endPoint, postObject
    ).then(function (response) {
      console.log(response);
    }).catch(function (error) {
      console.log(error);
    });
  }
};

export default Api;
