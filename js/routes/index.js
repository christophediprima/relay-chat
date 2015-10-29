import React from 'react';
import {Route} from 'react-router';
import ChatApp from '../components/ChatApp';
import MessageSection from '../components/MessageSection';
import LoginSection from '../components/LoginSection';
import chatAppQueries from './chatApp';
import messageSectionQueries from './messageSection';
import loginSectionQueries from './loginSection';

// with react-router-relay, we can define mutiple root queries
// for different component with our react-router <Route>
// As shown below, params: id being query variable: id in messageSectionQueries
// 利用 react-router-relay, 下方的:id 就能在 messageSectionQueries 裡成為
// query 的variable: id, 這樣我們用本來習慣的react-router定義相對應的
// view 和 component, 只要再加 queries props 為不同 component 作 root queries即可

export default (
  <Route path="/" component={ChatApp} queries={chatAppQueries}>
    <Route path="login" component={LoginSection}
      queries={loginSectionQueries} />
    <Route path="thread/:id" component={MessageSection}
      queries={messageSectionQueries} />
  </Route>
);
