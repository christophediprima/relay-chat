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
import SetViewerNameMutation from '../mutations/SetViewerNameMutation';

var ENTER_KEY_CODE = 13;

class LoginSection extends React.Component {
  constructor(props, context) {
    super(props, context);
    const currentName = props.viewer.name;
    this.state = {text: currentName};
  }

  render() {
    const {viewer} = this.props;

    console.log(viewer);
    return (
      <div>
        <div>Please provide a nickname</div>
        <input type="text" placeholder="Type your name"
          name="name"
          value={this.state.text}
          onChange={this._onChange}
          onKeyDown={this._onKeyDown} />
      </div>
    );
  }

  _onChange = (event) => {
    this.setState({text: event.target.value});
  }

  _onKeyDown = (event) => {
    if (event.keyCode === ENTER_KEY_CODE) {
      event.preventDefault();
      var name = this.state.text.trim();
      if (name) {
        Relay.Store.update(new SetViewerNameMutation({
          name,
          viewer: this.props.viewer
        }));
      }
      //this.setState({text: ''});
    }
  }
}

export default Relay.createContainer(LoginSection, {
  fragments: {
    // Note: Relay will ask you to specify first, last, before, or after
    // if you need to query to edges, so we set a big number here
    // 注意：Relay 會要你 specify specify first, last, before, 或 after
    // 如果你要 query 任何 edges 裡的東西, 所以我們這裡假定一個很大的數
    viewer: () => Relay.QL`
      fragment on User {
        id,
        name,
        ${SetViewerNameMutation.getFragment('viewer')}
      }
    `
  },
});
