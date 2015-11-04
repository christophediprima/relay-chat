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

var GraphQLAddThreadMutation = mutationWithClientMutationId({
  name: 'AddThread',
  inputFields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    thread: {
      type: GraphQLThread,
      resolve: ({threadID}) => getThread(threadID)
    },
    viewer: {
      type: GraphQLUser,
      resolve: ({userId}) => getUser(userId),
    },
  },
  mutateAndGetPayload: ({name, id}) => {
    // important, else it would be encoded client id,
    // then database don't know how to handle
    var userId = fromGlobalId(id).id;
    var {threadID} = addThread(name, userId);
    return {threadID, userId};
  }
});

var GraphQLAddMessageMutation = mutationWithClientMutationId({
  name: 'AddMessage',
  inputFields: {
    text: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    messageEdge: {
      type: GraphQLMessageEdge,
      resolve: ({ messageID, threadID }) => {
        var message = getMessage(messageID);
        return {
          cursor: cursorForObjectInConnection(getMessagesByThreadId(
            threadID), message),
          node: message,
        };
      }
    },
    thread: {
      type: GraphQLThread,
      resolve: ({threadID}) => getThread(threadID)
    },
    viewer: {
      type: GraphQLUser,
      resolve: () => getViewer(),
    },
  },
  mutateAndGetPayload: ({text, id}) => {
    // important, else it would be encoded client id,
    // then database don't know how to handle
    var localThreadId = fromGlobalId(id).id;
    var {messageID, threadID} = addMessage(text, localThreadId);
    return {messageID, threadID};
  }
});

var GraphQLMarkThreadAsReadMutation = mutationWithClientMutationId({
  name: 'MarkThreadAsRead',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    thread: {
      type: GraphQLThread,
      resolve: ({localThreadId}) => getThread(localThreadId),
    },
    viewer: {
      type: GraphQLUser,
      resolve: () => getViewer(),
    },
  },
  mutateAndGetPayload: ({id}) => {
    var localThreadId = fromGlobalId(id).id;
    markThreadAsRead(localThreadId);
    return {localThreadId};
  },
});

var GraphQLSetViewerNameMutation = mutationWithClientMutationId({
  name: 'SetViewerName',
  inputFields: {
    name: { type: new GraphQLNonNull(GraphQLString)}
  },
  outputFields: {
    viewer: {
      type: GraphQLUser,
      resolve: ({}) => getViewer(),
    },
  },
  mutateAndGetPayload: ({name}) => {
    setViewerName(name);
    return {};
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
