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
  nodeField
} from './interface';

import {
  User,
  Thread,
  Message,
} from '../data.js';

import {
  addThread,
  addMessage,
  getMessage,
  getMessagesByThreadId,
  getThread,
  markThreadAsRead,
  getUser,
  getViewer,
  setViewerName,
} from '../database';

import {
  GraphQLMessage,
  MessageConnection,
  GraphQLMessageEdge
} from './objects/message';

import {
  GraphQLThread,
  ThreadConnection
} from './objects/thread';

import {
  GraphQLUser
} from './objects/user';

import {
  GraphQLAddMessageMutation
} from './mutations/addMessage';

import {
  GraphQLAddThreadMutation
} from './mutations/addThread';

import {
  GraphQLMarkThreadAsReadMutation
} from './mutations/markThreadAsRead';

import {
  GraphQLSetViewerNameMutation
} from './mutations/setViewerName';


var Root = new GraphQLObjectType({
  name: 'Root',
  fields: {
    viewer: {
      type: GraphQLUser,
      resolve: () => getViewer()
    },
    node: nodeField
  },
});

var Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addThread: GraphQLAddThreadMutation,
    addMessage: GraphQLAddMessageMutation,
    markThreadAsRead: GraphQLMarkThreadAsReadMutation,
    setViewerName: GraphQLSetViewerNameMutation,
  },
});

export var Schema = new GraphQLSchema({
  query: Root,
  mutation: Mutation
});
