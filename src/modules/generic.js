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

const notFoundError = (e) => {
    return generateResponse({ status: 404, message: e })
};

const serverError = (e) => {
    return generateResponse({ status: 500, message: e })
};

module.exports = {
    getSuccess,
    notFoundError,
    serverError
};