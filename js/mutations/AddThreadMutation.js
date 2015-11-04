import Relay from 'react-relay';
// if you wanna see step by step explanation for Mutation,
// you can check MarkThreadAsReadMutation.js first
export default class AddThreadMutation extends Relay.Mutation {

  static fragments = {
    viewer: () => Relay.QL`
      fragment on User {
        id,
        threads(first: 9007199254740991) {
          unreadCount,
          edges {
            node {
              id
            }
          }
        },
      }
    `,
  };

  getMutation() {
    return Relay.QL`mutation{addThread}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on AddThreadPayload {
        threadEdge,
        viewer {
          threads(first: 9007199254740991) {
            unreadCount,
            edges {
              node {
                id
              }
            }
          },
        },
      }
    `;
  }

  getConfigs() {
    return [{
      // use FIELDS_CHANGE here to make unreadCount and thread order changeed
      // 用 FIELDS_CHANGE 來讓新增訊息時，左邊thread的順序和unreadCount都會跟著動
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        viewer: this.props.viewer.id,
      },
    },
    // use RANGE_ADD to let Relay append new egde in connection
    // rangeBehaviors: append, prepend, remove
    // 這裡 RANGE_ADD 告訴 Relay 要在 connection append 新的egde
    {
      type: 'RANGE_ADD',
      parentName: 'viewer',
      parentID: this.props.viewer.id,
      connectionName: 'threads',
      edgeName: 'threadEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }];
  }

  getVariables() {
    return {
      name: this.props.name,
      id: this.props.viewer.id
    };
  }

  getOptimisticResponse() {
    const {id, name, viewer} = this.props;

    let timestamp = Date.now();
    return {
      threadEdge: {
        node: {
          // id field is not recommended for new nodes in optimistic payload,
          // since there might a chance that it could collide with another
          // node from the server.
          // 如果我們自己 specify id 有可能會跟 server 的 id 衝突，讓 Relay 幫我們處理
          authorName: viewer.name,
          timestamp: timestamp,
          name: name
        },
      },
      viewer: viewer
    };
  }
}
