import React, { Component } from 'react'
import {Link} from 'react-router-dom'

import DefaultProfile from '../images/avatar.png';

export default class ProfileTabs extends Component {
  render() {
    const { following, followers } = this.props
    return (
      <div className="row">
        <div className="col-md-4"> 
          <h3 className="text-primary">{followers.length} followers</h3>
          <hr/>
          {followers.map((person, i) => (
            <div key={i}>
              <div>
                <Link to={`/user/${person._id}`}>
                    <img src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`}
                    onError={i => i.target.src = `${DefaultProfile}`}
                    className="float-left mr-2" style={{height:'40px', width:"40px", borderRadius: "50%", border: "1px solid"}}
                    alt ={person.name}/>
                  <p className="lead">{person.name}</p>
                </Link>
                <p style={{clear: "both"}}>
                  {person.about}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="col-md-4"> 
        <h3 className="text-primary">{following.length} Following</h3>
        <hr/>
          {following.map((person, i) => (
            <div key={i}>
                <div>
                  <Link to={`/user/${person._id}`}>
                     <img src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`}
                     onError={i => i.target.src = `${DefaultProfile}`}
                     className="float-left mr-2" style={{height:'40px', width:"40px", borderRadius: "50%", border: "1px solid"}}
                     alt ={person.name}/>
                    <p className="lead">{person.name}</p>
                  </Link>
                  <p style={{clear: "both"}}>
                    {person.about}
                  </p>
                </div>
              </div>
          ))}
        </div>
        <div className="col-md-4">
          <h3 className=" lead">Posts</h3>
        </div>
      </div>
    )
  }
}
