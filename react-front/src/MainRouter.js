import React from 'react'
import { Route, Switch } from 'react-router-dom';
import Home from './core/Home'
import Signup from './user/Signup'
import Signin from './user/Signin';
import Profile from './user/Profile';
import Menu from './core/menu';
import Users from './user/Users';
import EditProfile from './user/EditProfile';
import PrivateRoute from './auth/PrivateRoute';
import FindPeople from './user/FindPeople';
import NewPost  from './post/NewPost'
import EditPost  from './post/EditPost'
import SinglePost  from './post/SinglePost'

const MainRouter = () => (
  <div>
    <Menu/>
    <Switch>
      <Route exact path="/" component={Home}></Route>
      <Route exact path="/posts/:postId" component={SinglePost}></Route>
      <Route exact path="/users" component={Users}></Route>
      <Route exact path="/signup" component={Signup}></Route>
      <Route exact path="/signin" component={Signin}></Route>
      <PrivateRoute exact path="/user/edit/:userId" component={EditProfile}></PrivateRoute>
      <PrivateRoute exact path="/findpeople" component={FindPeople}></PrivateRoute>
      <PrivateRoute exact path="/post/post" component={NewPost}></PrivateRoute>
      <PrivateRoute exact path="/post/edit/:postId" component={EditPost}></PrivateRoute>
      <Route exact path="/user/:userId" component={Profile}></Route>
    </Switch>
  </div>
);
export default MainRouter;