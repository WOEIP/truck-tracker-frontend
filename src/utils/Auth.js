import uuidv5 from 'uuid/v5';

const MY_NAMESPACE = 'dd84aaf1-34ee-4ccc-b6d1-66e9b3afb6d9';

let Auth = {
    createUUID: function (inputString) {
      return uuidv5(inputString, MY_NAMESPACE);
  },
};

export default Auth;
