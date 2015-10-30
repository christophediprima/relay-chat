import React from 'react';
import {Route} from 'react-router';
import ChatApp from '../components/ChatApp';
import ThreadSection from '../components/sections/ThreadSection';
import MessageSection from '../components/sections/MessageSection';
import LoginSection from '../components/sections/LoginSection';
import chatAppQueries from '../queries/chatApp';
import threadSectionQueries from '../queries/threadSection';
import messageSectionQueries from '../queries/messageSection';
import loginSectionQueries from '../queries/loginSection';

// with react-router-relay, we can define mutiple root queries
// for different component with our react-router <Route>
// As shown below, params: id being query variable: id in messageSectionQueries
// 利用 react-router-relay, 下方的:id 就能在 messageSectionQueries 裡成為
// query 的variable: id, 這樣我們用本來習慣的react-router定義相對應的
// view 和 component, 只要再加 queries props 為不同 component 作 root queries即可

function checkLogin(nextState, replaceState){
  console.log(nextState);
}

export default (
  <Route path="/" component={ChatApp} queries={chatAppQueries} onEnter={checkLogin}>
    <Route path="login" component={LoginSection} queries={loginSectionQueries} />
    <Route path="thread" component={ThreadSection} queries={threadSectionQueries}>
      <Route path=":id" component={MessageSection} queries={messageSectionQueries} />
    </Route>
  </Route>
);
