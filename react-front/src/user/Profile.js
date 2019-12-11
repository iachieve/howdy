import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { Redirect, Link } from 'react-router-dom';
import { read } from './apiUser';
import DefaultProfile from '../images/avatar.png';
import DeleteUser from './DeleteUser.js';
import FollowProfileButton from './FollowProfileButton'
import ProfileTabs from './ProfileTabs';
import {listByUser} from '../post/apiPost'

class Profile extends Component {
  constructor(){
    super();
    this.state = {
      user: { following: [], followers: [] },
      redirectToSignin: false,
      following: false,
      posts: []
    }
  }

  checkFollow = user => {
    const jwt = isAuthenticated();
    const match = user.followers.find(follower => {
      return follower._id === jwt.user._id
    })
    return match;
  }

  init = (userId) => {
      const token = isAuthenticated().token;
      read(userId, token).then(data => {
        if(data.error){
          this.setState({ redirectToSignin: true });
          console.log(data.error)
        }else{
          let following = this.checkFollow(data);
          this.setState({ user: data, following });
          this.loadPosts(data._id, token);
        }
      });
  }

  loadPosts = (userId, token)=>{
    listByUser(userId, token).then(data => {
      if(data.error){
        console.log(data.error)
      }else{
        this.setState({posts: data})
      }
    })
  }

  clickFollowButton = callApi => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    callApi(userId, token, this.state.user._id)
    .then(data => {
      if(data.error){
        this.setState({ error: data.error })
      }else{
        this.setState({ user: data, following: !this.state.following })
      }
    })
  }

  componentDidMount(){
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  componentWillReceiveProps(props){
    const userId = props.match.params.userId;
    this.init(userId);
  }
  render() {

    const { redirectToSignin, user, posts} = this.state;
    if(redirectToSignin) return <Redirect to="/signin"/>

    const photoUrl = user._id ? `${process.env.REACT_APP_API_URL}/user/photo/${user._id}`
    : DefaultProfile;
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Profile</h2>
        <div className="row">
          <div className="col-md-4">
            <img src={photoUrl} alt={user.name} style={{height: '200px', width: 'auto'}}
                  onError={i => i.target.src = `${DefaultProfile}`}
                  className="thumbnail"/>

            </div>
          <div className="col-md-8">
            <div className="lead mt-2">
              <p>{user.name}</p>
                <p>{user.email}</p>
                <p>{`joined ${new Date(user.created).toDateString()}`}</p>
            </div>
              
              {isAuthenticated().user && isAuthenticated().user._id == user._id ? (
                <div className="d-inline-block">
                  <Link className="btn btn-raised btn-success mr-5" to={`/user/edit/${user._id}`}>
                    Edit Profile
                  </Link>
                  <Link className="btn btn-raised btn-info mr-5" to={`/post/create`}>
                    Create Post
                  </Link>
                  <DeleteUser userId={user._id}/>
                </div>
              ):(
                <FollowProfileButton following={this.state.following} onButtonClick={this.clickFollowButton}/>
              )}
          </div>


        </div>
        <div className="row">
          <div className="col md-12 mt-5 mb-5">
            <p className="lead">{user.about}</p>
          </div>
        </div>
            <ProfileTabs followers={user.followers} following={user.following} posts={posts}/>
      </div>
    );
  }
}

export default Profile;