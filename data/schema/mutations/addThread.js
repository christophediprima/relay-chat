import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';

import {
  fromGlobalId,
  mutationWithClientMutationId,
} from 'graphql-relay';

import {
  addThread,
  getThread,
  getUser,
} from '../../database';

import {
  GraphQLThread
} from '../objects/thread';

import {
  GraphQLUser
} from '../objects/user';

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

module.exports = {
  GraphQLAddThreadMutation
};
