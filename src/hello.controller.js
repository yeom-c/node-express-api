const helloService = require('./hello.service');

const getHello = async (req, res) => {
  const result = await helloService.getHello(req.params, req.body);

  res.send(result);
};

module.exports = {
  getHello,
};
