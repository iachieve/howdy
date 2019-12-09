import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { Redirect, Link } from 'react-router-dom';
import { read } from './apiUser';
import DefaultProfile from '../images/avatar.jpg';
import DeleteUser from './DeleteUser.js';

class Profile extends Component {
  constructor(){
    super();
    this.state = {
      user: "",
      redirectToSignin: false
    }
  }

  init = (userId) => {
      const token = isAuthenticated().token;
      read(userId, token).then(data => {
        if(data.error){
          this.setState({ redirectToSignin: true });
          console.log(data.error)
        }else{
          this.setState({user: data});
        }
      });
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

    const { redirectToSignin, user} = this.state;
    if(redirectToSignin) return <Redirect to="/signin"/>

    const photoUrl = user._id ? `${process.env.REACT_APP_API_URL}/user/photo/${user._id}`
    : DefaultProfile;
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Profile</h2>
        <div className="row">
          <div className="col-md-6">
          <img src={photoUrl} alt={user.name} style={{height: '200px', width: 'auto'}}
                onError={i => i.target.src = `${DefaultProfile}`}
                className="thumbnail"/>

          </div>
          <div className="col-md-6">
          <div className="lead mt-2">
            <p>{user.name}</p>
              <p>{user.email}</p>
              <p>{`joined ${new Date(user.created).toDateString()}`}</p>
          </div>
            
            {isAuthenticated().user && isAuthenticated().user._id == user._id && (
              <div className="d-inline-block">
                <Link className="btn btn-raised btn-success mr-5" to={`/user/edit/${user._id}`}>
                  Edit Profile
                </Link>
                <DeleteUser userId={user._id}/>
              </div>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col md-12 mt-5 mb-5">
            <p className="lead">{user.about}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;