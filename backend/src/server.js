const { createApp } = require('./app');
const port = Number(process.env.PORT || 3001);
createApp().listen(port, () => console.log('Backend running on http://localhost:' + port));
