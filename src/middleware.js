let connections = [];

export const register = function (connection) {
  connections.push(connection);
};

export const connect = store => dispatch => action => {
  let result = dispatch(action);
  connections.forEach(connection => {
    connection();
  });
  return result;
};
