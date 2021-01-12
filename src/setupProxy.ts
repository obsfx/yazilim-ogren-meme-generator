import proxy from 'http-proxy-middleware'

//@ts-ignore
const fn = app => {
  //@ts-ignore
  app.use('/api', proxy({ target: 'https://obsfx.github.io', changeOrigin: true }));
}

export default fn;
