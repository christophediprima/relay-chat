/**
 * This file is provided by Facebook for testing and evaluation purposes
 * only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React from 'react';
import Relay from 'react-relay';
import { PropTypes } from 'react-router';
import classNames from 'classnames';
import ThreadListItem from './ThreadListItem';

class ThreadList extends React.Component {

  static contextTypes = {
    history: PropTypes.history,
  }

  render() {
    const {relay, threads: {edges, unreadCount}, viewer} = this.props;

    const currentThreadID = relay.route.params.id;
    const threadListItems = edges.map(edge => {
      return (
        <ThreadListItem
          key={edge.node.id}
          thread={edge.node}
          viewer={viewer}
          currentThreadID={currentThreadID}
        />
      );
    });

    return (
      <ul className="thread-list">
        {threadListItems}
      </ul>
    );
  }
}
// Note: MarkThreadAsReadMutation would use thread, viewer in fragments
// We need to specify here, mutation is kind of like child component here
// 因為 MarkThreadAsReadMutation 會用到 thread, viewer 我們在這裡 specify
// mutation 其實有點像 現在這個的 component 的 child component
export default Relay.createContainer(ThreadList, {
  fragments: {
    threads: () => Relay.QL`
      fragment on ThreadConnection {
        unreadCount,
        edges {
          node {
            id,
            ${ThreadListItem.getFragment('thread')}
          }
        }
      }
    `,
    viewer: () => Relay.QL`
      fragment on User {
        ${ThreadListItem.getFragment('viewer')}
      }
    `
  }
});
