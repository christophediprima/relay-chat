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

module.exports = {
  GraphQLMessage,
  MessageConnection,
  GraphQLMessageEdge
};
