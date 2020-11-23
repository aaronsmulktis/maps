const compression = require('compression');
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

app.use(compression());

app.use(
  express.static(path.resolve(`${process.cwd()}/build/`), {
    maxage: 0,
    setHeaders(res) {
      res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.header('Pragma', 'no-cache');
      res.header('Expires', 0);
    }
  })
);

app.get('*', (req, res) => {
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', 0);
  res.sendFile(path.resolve(`${process.cwd()}/build/index.html`));
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.info(`==> 🌎 Listening on port ${port}. Open up http://0.0.0.0:${port}/ in your browser.`);
});
