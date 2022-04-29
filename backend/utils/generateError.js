const generateError = (statusCode = 500, message = 'Internal Server error', data) => {
    const err = new Error(message);
    err.statusCode = statusCode;
    if (data) err.data = data;
    throw err;
}

module.exports = generateError;