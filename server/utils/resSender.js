
export default function resSender(res, statusCode, success, message, data = null) {
    const responsePayload = { success, message };

    // Include additional data if provided
    if (data) {
        responsePayload.data = data;
    }

    res.status(statusCode).json(responsePayload);
}
