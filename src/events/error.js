module.exports = async function error (Kirito, [error]) {
    Kirito.logger.error(error);
    Kirito.Raven.captureException(error);
}
