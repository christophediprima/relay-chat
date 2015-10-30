import Relay from 'react-relay';
// viewer, thread here correspond to ThreadSection fragments viewer. thread
// 這裡的 viewer. thread 就對應到 MessageSection 所需要的 fragments viewer. thread
export default {
  viewer: (Component) => Relay.QL`
    query {
      viewer{
        ${Component.getFragment('viewer')},
      }
    }
  `
};
