import React, { Component } from 'react';
import { Redirect} from 'react-router-dom';
import { signin, authenticate } from '../auth'

class Signin extends Component {
  constructor(){
    super();
    this.state = { email: "" , password : "" , error:"", redirectToReferer:false, loading: false }
  }
  handleChange = field => event => {
    this.setState({[field]: event.target.value})
    this.setState({error:""})
  }

  clickSubmit = event => {
    event.preventDefault();
    this.setState({loading: true});
    const {email, password } = this.state;
    const user = { email, password};
    signin(user)
    .then(data => {
      if(data.error){
        this.setState({error: data.error, loading: false})}
      else{
       authenticate(data,()=>{
         this.setState({redirectToReferer: true});
       });
      }
  })
  }

  signinForm = (email, password) => {
   return ( 
    <form>
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
    const {email, password, error, redirectToReferer, loading } = this.state;
    if(redirectToReferer){
      return <Redirect to="/" />
    }
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Signin</h2>
        <div className="alert alert-danger" style={{display: error ? "" : "none" }}>{error}</div>
        {loading ? <div className="jumbotron text-center">Loading...</div>: ""}
        {this.signinForm(email, password)}
      </div>
    );
  }
}

export default Signin;