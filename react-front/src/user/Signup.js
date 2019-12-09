import React, { Component } from 'react';
import { signup } from '../auth'
import {Link } from 'react-router-dom'

class Signup extends Component {
  constructor(){
    super();
    this.state = { name: "" , email: "" , password : "" , error:"" , open:false  }
  }
  handleChange = field => event => {
    this.setState({error: "", open: false})
    this.setState({[field]: event.target.value})
  }

  clickSubmit = event => {
    event.preventDefault();
    const {name, email, password } = this.state;
    const user = {name, email, password};
    signup(user)
    .then(data => {
      if(data.error){
          // console.log(this)
          this.setState({error: data.error});
        }
      else{
        this.setState({ name : "", email: "", password : "", error: "", open: true  });
      }
  })
  }
 
  signupFrom = (name, email, password) => {
   return ( 
    <form>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input value={name} onChange={this.handleChange("name")} type="text" className="form-control"/>
      </div>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input value={email}  onChange={this.handleChange("email")}  type="email" className="form-control"/>
      </div>
      <div className="form-group">
        <label className="text-muted">Password</label>
        <input  value={password}  onChange={this.handleChange("password")}  type="password" className="form-control"/>
      </div>
      <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">Submit</button>
    </form>)
  }

  render() {
    const {name, email, password, error, open } = this.state;
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Signup</h2>
        <div className="alert alert-danger" style={{display: error ? "" : "none" }}>{error}</div>
        <div className="alert alert-info" style={{display: open ? "" : "none" }}>
          new account successfully created, please <Link to="/signin">signin</Link> 
        </div>
        {this.signupFrom(name, email, password)}
      </div>
    );
  }
}

export default Signup;