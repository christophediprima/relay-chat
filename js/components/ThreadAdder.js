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
import AddThreadMutation from '../mutations/AddThreadMutation';

var ENTER_KEY_CODE = 13;

class ThreadAdder extends React.Component {

  static contextTypes = {
    history: PropTypes.history,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {name: ''};
  }

  render() {
    const {relay, viewer} = this.props;

    const currentThreadID = relay.route.params.id;

    return (
      <input type="text" placeholder="Add new thread" onChange={this._onChange} onKeyDown={this._onKeyDown}></input>
    );
  }

  _onChange = (event) => {
    this.setState({name: event.target.value});
  }

  _onKeyDown = (event) => {
    if (event.keyCode === ENTER_KEY_CODE) {
      event.preventDefault();
      var name = this.state.name.trim();
      if (name) {
        Relay.Store.update(new AddThreadMutation({
          name,
          viewer: this.props.viewer
        }));
      }
      this.setState({name: ''});
    }
  }
}
// Note: MarkThreadAsReadMutation would use thread, viewer in fragments
// We need to specify here, mutation is kind of like child component here
// 因為 MarkThreadAsReadMutation 會用到 thread, viewer 我們在這裡 specify
// mutation 其實有點像 現在這個的 component 的 child component
export default Relay.createContainer(ThreadAdder, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        ${AddThreadMutation.getFragment('viewer')}
      }
    `
  }
});
