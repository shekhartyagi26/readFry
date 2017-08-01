import jwt from 'jwt-simple';


const encodeToken = (id) => {
    let secret = 'xxx';
    let payload = { _id: id, timeStamp: new Date() };
    return jwt.encode(payload, secret);
}
const decodeToken = (token) => {
    let secret = 'xxx';
    return jwt.decode(token, secret);
}

module.exports = {
    encodeToken,
    decodeToken
};