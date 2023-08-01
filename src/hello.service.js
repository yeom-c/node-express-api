const getHello = async (params, body) => {
  return {
    params,
    body,
  };
};

module.exports = {
  getHello,
};
