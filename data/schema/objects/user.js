import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  cursorForObjectInConnection,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';

import {
  nodeInterface
} from '../interface';

import {
  getThreads
} from '../../database';

import {
  ThreadConnection
} from './thread';


var GraphQLUser = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: globalIdField('User'),
    name: {
      type: GraphQLString,
      resolve: (obj) => obj.name
    },
    threads: {
      type: ThreadConnection,
      args: connectionArgs,
      resolve: (obj, args) => connectionFromArray(getThreads(), args),
    }
  },
  interfaces: [nodeInterface]
});

module.exports = {
  GraphQLUser
};
