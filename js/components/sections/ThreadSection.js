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
import ThreadList from '../ThreadList';
import ThreadAdder from '../ThreadAdder';


class ThreadSection extends React.Component {

  render() {
    // FIXME : hacky here! Because we can't get this.props.params.id here
    // since it's the not component router matches
    // 因為 ThreadSection 不是 router 碰到的 component, 所以我們只有用這個方法
    // 之後 Relay 會有 global cached 的 implementation, 就不用這樣做了
    const {relay, viewer, viewer : { threads }, viewer: { threads: {unreadCount}}} = this.props;

    const unread = unreadCount === 0 ?
      <span>No unread thread</span> :
      <span>Unread threads: {unreadCount}</span>;
    return (
      <div>
        <div className="thread-section">
          <div className="thread-count">
            {unread}
          </div>
          <ThreadList threads={threads} viewer={viewer} />
          <ThreadAdder threads={threads} viewer={viewer}></ThreadAdder>
        </div>
        {this.props.children ||
          <span>Select a thread by clicking it.</span>
          }
      </div>
    );
  }

}
// we would not use viewer in ThreadSection but ThreadListItem needs it to
// trigger MarkThreadAsReadMutation, so we need to specify here
// 這裡雖然不會用到 viewer 但因為更下層的 ThreadListItem 的 MarkThreadAsReadMutation
// 會用到所以也要 specify ，這是 Relay 比較麻煩的地方
export default Relay.createContainer(ThreadSection, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        threads(first: 9007199254740991) {
          unreadCount,
          edges {
            node {
              id,
            },
          },
          ${ThreadList.getFragment('threads')}
        },
        ${ThreadList.getFragment('viewer')},
        ${ThreadAdder.getFragment('viewer')}
      }
    `
  }
});
