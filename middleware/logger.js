module.exports = async (ctx, next) => {
    try {
        await next();
    } catch (e) {
        console.log('some error occured', e)
    }
}