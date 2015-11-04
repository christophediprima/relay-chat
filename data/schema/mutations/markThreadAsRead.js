import {
  GraphQLID,
  GraphQLNonNull
} from 'graphql';

import {
  fromGlobalId,
  mutationWithClientMutationId
} from 'graphql-relay';

import {
  getThread,
  getViewer,
  markThreadAsRead
} from '../../database';

import {
  GraphQLThread
} from '../objects/thread';

import {
  GraphQLUser
} from '../objects/user';

var GraphQLMarkThreadAsReadMutation = mutationWithClientMutationId({
  name: 'MarkThreadAsRead',
  description: 'Mark a thread as read by a user',
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

module.exports = {
  GraphQLMarkThreadAsReadMutation
};
