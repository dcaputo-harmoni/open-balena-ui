require('dotenv').config();

const serverEnv = Object.entries(process.env);
const reactAppEnv = serverEnv.filter(envSet => envSet[0].startsWith('REACT_APP_'));
const reactAppEnvJson = JSON.stringify(Object.fromEntries(reactAppEnv));

module.exports = (req, res) => {
  res.status(200).end(`window.env = ${reactAppEnvJson};`);
}