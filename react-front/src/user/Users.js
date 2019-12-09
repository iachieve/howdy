import React, { Component } from 'react'
import {list} from './apiUser';
import DefaultProfile from '../images/avatar.jpg';
import {Link} from 'react-router-dom';

export default class Users extends Component {
  constructor(){
    super();
    this.state = { users: []}
  }
  componentDidMount(){
    list().then(data => {
      if(data.error){
        console.log(data.error)
      }else{
        this.setState({users: data});
      }
    })
  }

  renderUsers = users => (
    <div className="row">
      {users.map((user, idx) => (
        <div className="card col-md-4" key={idx}>
          <img src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`} 
                alt={user.name} style={{height: '200px', width: 'auto'}} 
                onError={i => i.target.src = `${DefaultProfile}`}
                className="thumbnail"/>
        {/* <img className="card-img-top" style={{ width: '100%', height: '15vw', 'objectFit': 'contain'}} src={DefaultProfile} alt="Card image cap"/> */}
        <div className="card-body">
          <h5 className="card-title">{user.name}</h5>
          <p className="card-text">{ user.email }</p>
          <Link to={`/user/${user._id}`} className="btn btn-raised btn-primary btn-sm">view Profile</Link>
        </div>
      </div>
      ))}
    </div>
  )

  render() {
    const { users } = this.state;

    return (
      <div className="container">
      <h2 className="mt-5 mb-5">Users</h2>
        {this.renderUsers(users)}
    </div>
    )
  }
}
