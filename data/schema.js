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
  User,
  Thread,
  Message,
} from './data.js';

import {
  addThread,
  addMessage,
  getMessage,
  getMessagesByThreadId,
  getThread,
  getThreads,
  markThreadAsRead,
  getUser,
  getViewer,
  setViewerName,
} from './database';

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

var GraphQLMessage = new GraphQLObjectType({
  name: 'Message',
  fields: {
    id: globalIdField('Message'),
    authorName: {
      type: GraphQLString,
      resolve: (obj) => obj.authorName
    },
    text: {
      type: GraphQLString,
      resolve: (obj) => obj.text
    },
    timestamp: {
      type: GraphQLInt,
      resolve: (obj) => obj.timestamp
    }
  },
  interfaces: [nodeInterface]
});

var {
  connectionType: MessageConnection,
  edgeType: GraphQLMessageEdge,
} = connectionDefinitions({
  name: 'Message',
  nodeType: GraphQLMessage,
});

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

var { connectionType: ThreadConnection } = connectionDefinitions({
  name: 'Thread',
  nodeType: GraphQLThread,
  connectionFields: () => ({
    unreadCount: {
      type: GraphQLInt,
      resolve: (conn) => conn.edges.filter(edge => !edge.node.isRead).length
    }
  })
});

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
      resolve: ({userId}) => usersById(userId),
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
    return {threadID};
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
