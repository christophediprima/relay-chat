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
  getMessagesByThreadId
} from '../../database';

import {
  MessageConnection
} from './message';

var GraphQLThread = new GraphQLObjectType({
  name: 'Thread',
  fields: {
    id: globalIdField('Thread'),
    name: {
      type: GraphQLString,
      resolve: (obj) => obj.name
    },
    isRead: {
      type: GraphQLBoolean,
      resolve: (obj) => obj.isRead
    },
    messages: {
      type: MessageConnection,
      args: connectionArgs,
      resolve: (thread, args) => {
        return connectionFromArray(getMessagesByThreadId(thread.id), args);
      }
    },
    lastUpdated: {
      type: GraphQLInt,
      resolve: (obj) => obj.lastUpdated
    }
  },
  interfaces: [nodeInterface]
});

var {
  connectionType: ThreadConnection
} = connectionDefinitions({
  name: 'Thread',
  nodeType: GraphQLThread,
  connectionFields: () => ({
    unreadCount: {
      type: GraphQLInt,
      resolve: (conn) => conn.edges.filter(edge => !edge.node.isRead).length
    }
  })
});

module.exports = {
  GraphQLThread,
  ThreadConnection
};
