module.exports = async function error (Kirito, [error]) {
    Kirito.logger.error(error);
    if (Kirito.raven)
        Kirito.Raven.captureException(error);
}
