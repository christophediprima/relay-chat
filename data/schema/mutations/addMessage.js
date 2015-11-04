import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';

import {
  cursorForObjectInConnection,
  fromGlobalId,
  mutationWithClientMutationId,
} from 'graphql-relay';

import {
  getMessage,
  getThread,
  getViewer,
  addMessage
} from '../../database';

import {
  GraphQLMessageEdge,
  getMessagesByThreadId
} from '../objects/message';

import {
  GraphQLThread
} from '../objects/thread';

import {
  GraphQLUser
} from '../objects/user';

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

module.exports = {
  GraphQLAddMessageMutation
};
