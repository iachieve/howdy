import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { remove } from './apiUser';
import { signout } from '../auth';
import {Redirect } from 'react-router-dom';

class DeleteUser extends Component {

  state = {
    redirect: false
  }

  deleteAccount = (event) => {
    event.preventDefault();
    const token = isAuthenticated().token;
    const userId = this.props.userId;
    remove(userId, token)
    .then(data => {
      if(data.error){
        console.log(data.error)
      }else{
        signout(()=> console.log("User is deleted"));
        this.setState({redirect: true});
      }
    })
  }

  render(){
    if(this.state.redirect){
      return <Redirect to="/"/>
    }
    return (
      <>
      <button data-toggle="modal" data-target="#deleteConfirmation" className="btn btn-raised btn-danger">delete profile</button>

      <div className="modal fade" id="deleteConfirmation" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Delete Confirmation</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            Are you sure you want to delete your account?
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-raised btn-secondary mr-1" data-dismiss="modal">Cancel</button>
            <button onClick={this.deleteAccount}  type="button" className="btn btn-raised btn-danger" data-dismiss="modal">Delete Account</button>
          </div>
        </div>
      </div>
    </div>
      </>
    )
    }
}

export default DeleteUser;