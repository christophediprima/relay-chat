import {
  fromGlobalId,
  nodeDefinitions,
} from 'graphql-relay';

import {
  User,
  Thread,
  Message,
} from '../data';

import {
  getMessage,
  getThread,
  getUser,
} from '../database';

var GraphQLObjects = {};
var interfaceInjectObject = function(GraphQLObject, name){
  GraphQLObjects[name] = GraphQLObject;
}

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
      return GraphQLObjects['message'];
    } else if (obj instanceof Thread) {
      return GraphQLObjects['thread'];
    } else if (obj instanceof User) {
      return GraphQLObjects['user'];
    }
    return null;
  }
);

module.exports = {
  nodeInterface,
  nodeField,
  interfaceInjectObject
};
