const isDev = process.env.NODE_ENV === 'development';

module.exports = {
    error: () =>  isDev ? console.error : ({  }),
    log: () => console.log
}