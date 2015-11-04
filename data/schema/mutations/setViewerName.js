import {
  GraphQLNonNull,
  GraphQLString
} from 'graphql';

import {
  fromGlobalId,
  mutationWithClientMutationId
} from 'graphql-relay';

import {
  getViewer,
  setViewerName
} from '../../database';

import {
  GraphQLUser
} from '../objects/user';

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

module.exports = {
  GraphQLSetViewerNameMutation
};
