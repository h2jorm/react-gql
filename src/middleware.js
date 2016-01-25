let connections = new Set();

export const register = function (connection) {
  connections.add(connection);
  return function () {
    connections.delete(connection);
  };
};

export const connect = store => dispatch => action => {
  let result = dispatch(action);
  for (let connection of connections.values()) {
    connection(store);
  }
  return result;
};
