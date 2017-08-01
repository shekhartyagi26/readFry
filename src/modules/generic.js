const generateResponse = ({ status, message = null, description = null, data = {} }) => {
    return {
        status: status.toString(),
        error: {
            message,
            description,
        },
        data: (Array.isArray(data)) ? fromAryToObj(data) : data
    }
};

const getSuccess = (results) => {
    return generateResponse({ status: 200, data: results })
};

const getSuccessMessage = (message = {}) => {
    return generateResponse({ status: 200, message: message })
};

const notFoundError = (e) => {
    return generateResponse({ status: 404, message: e })
};

const serverError = (e) => {
    return generateResponse({ status: 500, message: e })
};
const validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

const successResponse = (status = 200, response = '{}', message = "", flag = 1) => {
    return ({
        "status": status,
        "flag": flag,
        "response": response,
        "message": message
    });
}

module.exports = {
    getSuccess,
    notFoundError,
    serverError,
    getSuccessMessage,
    validateEmail,
    successResponse
};