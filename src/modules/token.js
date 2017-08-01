import jwt from 'jwt-simple';
import { successResponse } from "../modules/generic";


const encodeToken = (id) => {
    let secret = 'xxx';
    let payload = { _id: id, timeStamp: new Date() };
    return jwt.encode(payload, secret);
}
const decodeToken = (token) => {
    return new Promise((resolve, reject) => {
        try {
            resolve(jwt.decode(token, secret));
        } catch (err) {
            reject(err);
        }
    })
};

export default {
    decodeToken
};

module.exports = {
    encodeToken
};