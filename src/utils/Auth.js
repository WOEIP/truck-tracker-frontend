import uuidv5 from 'uuid/v5';
import bcrypt from 'bcryptjs';

const MY_NAMESPACE = 'dd84aaf1-34ee-4ccc-b6d1-66e9b3afb6d9';

let Auth = {
    createUUID: function (inputString) {
      return uuidv5(inputString, MY_NAMESPACE);
    },

    hashPassword: function (pw) {
        //TODO dynamic salt, store it in DB
//        const salt = bcrypt.genSaltSync(10);
        const salt = '$2a$10$arjAldmQvHFfmUeL1/GCm.';
        return bcrypt.hashSync(pw, salt);
    }
};

export default Auth;
