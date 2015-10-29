import Relay from 'react-relay';
// if you wanna see step by step explanation for Mutation,
// you can check MarkThreadAsReadMutation.js first
export default class SetViewerNameMutation extends Relay.Mutation {

  static fragments = {
    viewer: () => Relay.QL`
      fragment on User {
          id,
          name
      }
    `,
  };

  getMutation() {
    return Relay.QL`mutation{setViewerName}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on SetViewerNamePayload {
        viewer {
          id,
          name
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
    }];
  }

  getVariables() {
    return {
      name: this.props.name
    };
  }

  getOptimisticResponse() {
    const {viewer, name} = this.props;

    viewer.name = name;

    return {
      viewer : viewer
    };
  }
}
