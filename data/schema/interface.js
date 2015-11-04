import {
  fromGlobalId,
  nodeDefinitions,
} from 'graphql-relay';

import {
  getMessage,
  getThread,
  getUser,
} from '../database';

var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    if (type === 'Message') {
      return getMessage(id);
    } else if (type === 'Thread') {
      return getThread(id);
    } else if (type === 'User') {
      return getUser(id);
    }
    return null;
  },
  (obj) => {
    if (obj instanceof Message) {
      return GraphQLMessage;
    } else if (obj instanceof Thread) {
      return GraphQLThread;
    } else if (obj instanceof User) {
      return GraphQLUser;
    }
    return null;
  }
);

module.exports = {
  nodeInterface,
  nodeField
};
