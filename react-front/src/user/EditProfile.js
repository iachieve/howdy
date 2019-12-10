import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { read, update, updateUser } from './apiUser';
import { Redirect } from 'react-router-dom'
import DefaultProfile from '../images/avatar.png';


class EditProfile extends Component {
  constructor() {
    super();
    this.state = {
      id: "", name: "", email: "",
      password: "", redirectToProfile: false,
      error: "", fileSize: 0, loading: false, about: ""
    }
  }

  init = (userId) => {
    const token = isAuthenticated().token;
    read(userId, token).then(data => {
      if (data.error) {
        this.setState({ redirectToProfile: true });
        console.log(data.error)
      } else {
        this.setState({ id: data._id, name: data.name, email: data.email, error: "", about: data.about });
      }
    });
  }

  componentDidMount() {
    this.userData = new FormData();
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  isValid = () => {
    const { name, email, password, fileSize } = this.state;
    // debugger
    if(fileSize > 100000){    
      this.setState({ error: "file size should be less than 100kb" , loading: false });
      return false;
    }
    if (name.length === 0) {
      this.setState({ error: "Name is required" });
      return false;
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      this.setState({
        error: "A valid Email is required" , loading: false 
      });
      return false;
    }
    // if (!(password.length >= 1 && password.length <= 5)) {

    //   this.setState({ error: "Password must be at least 6 characters."  , loading: false })
    //   return false;
    // }
    return true;
  }

  handleChange = field => event => {
    this.setState({ error: "" });

    const value = field === "photo" ? event.target.files[0] : event.target.value;
    const fileSize = field === "photo" ? event.target.files[0].size :0;
    // debugger
    this.setState({ [field]: value });
    this.setState({ fileSize: fileSize });
    this.userData.set(field, value);
  }

  clickSubmit = event => {
    event.preventDefault();
    this.setState({ loading: true });
    if (this.isValid()) {
      const userId = this.props.match.params.userId;
      const token = isAuthenticated().token;

      update(userId, token, this.userData)
        .then(data => {
          if (data.error) {
            this.setState({ error: data.error });
          }
          else {
            updateUser(data, ()=> 
            this.setState({ name: "", email: "", password: "", error: "", redirectToProfile: true })
            )
            
          }
        })
    }
  }


  editFrom = (name, email, password, about) => {
    return (
      <form>
        <div className="form-group">
          <label className="text-muted">Profile Photo</label>
          <input onChange={this.handleChange("photo")} type="file" accept="image/*" className="form-control" />
        </div>

        <div className="form-group">
          <label className="text-muted">Name</label>
          <input value={name} onChange={this.handleChange("name")} type="text" className="form-control" />
        </div>
        <div className="form-group">
          <label className="text-muted">Email</label>
          <input value={email} onChange={this.handleChange("email")} type="email" className="form-control" />
        </div>
        <div className="form-group">
          <label className="text-muted">About</label>
          <textarea value={about} onChange={this.handleChange("about")} className="form-control" />
        </div>
        <div className="form-group">
          <label className="text-muted">Password</label>
          <input value={password} onChange={this.handleChange("password")} type="password" className="form-control" />
        </div>
        <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">Submit</button>
      </form>)
  }

  render() {
    const { id, name, email, password, redirectToProfile, error,
              loading, about } = this.state;

    if (redirectToProfile) {
      return <Redirect to={`/user/${id}`} />
    }
    const photoUrl = id ? `${process.env.REACT_APP_API_URL}/user/photo/${id}?${new Date().getTime()}`
                        : DefaultProfile;
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Edit Profile</h2>
        <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>{error}</div>
        {loading ? <div className="jumbotron text-center">Loading...</div>: ""}
        <img src={photoUrl} alt={name} style={{height: '200px', width: 'auto'}} 
          onError={i => i.target.src = `${DefaultProfile}`}
          className="thumbnail"/>
        {this.editFrom(name, email, password, about)}
      </div>
    );
  }
}

export default EditProfile;