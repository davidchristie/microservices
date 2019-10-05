const consul = require("./consul");

const getServiceList = () => {
  return new Promise((resolve, reject) => {
    consul.kv.get(
      {
        key: "gateway/services",
        recurse: true
      },
      function(error, result) {
        if (error) {
          reject(error);
        }
        if (!result) {
          reject(new Error("Service list not available"));
        }
        const serviceList = result.map(record => {
          return {
            name: record.Key.split("/")[2],
            url: record.Value
          };
        });
        resolve(serviceList);
      }
    );
  });
};

module.exports = {
  getServiceList
};
