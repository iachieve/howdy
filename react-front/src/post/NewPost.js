import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { create } from './apiPost';
import { Redirect } from 'react-router-dom'
import DefaultProfile from '../images/avatar.png';

class NewPost extends Component {
  constructor() {
    super();
    this.state = { title: '', body: '', photo: '', error: '', user:{}, fileSize: 0, loading: false, redirectToProfile: false };
  }

  componentDidMount() {
    this.postData = new FormData();
    this.setState({user: isAuthenticated().user})
  }

  isValid = () => {
    const { title, body, fileSize } = this.state;
    
    if(fileSize > 100000){
      this.setState({ error: "file size should be less than 100kb" , loading: false });
      return false;
    }
    if (title.length === 0) {
      this.setState({ error: "title is required" });
      return false;
    }
    if (body.length === 0) {
      this.setState({ error: "body is required" });
      return false;
    }
    return true;
  }

  handleChange = field => event => {
    this.setState({ error: "" });

    const value = field === "photo" ? event.target.files[0] : event.target.value;
    const fileSize = field === "photo" ? event.target.files[0].size :0;
    // debugger
    this.setState({ [field]: value });
    this.setState({ fileSize: fileSize });
    this.postData.set(field, value);
  }

  clickSubmit = event => {
    event.preventDefault();
    this.setState({ loading: true });

    if (this.isValid()) {

      const userId = isAuthenticated().user._id;
      const token = isAuthenticated().token;
      create(userId, token, this.postData)
        .then(data => {
          if (data.error) {
            this.setState({ error: data.error });
          }
          else {
            this.setState({loading: false, title: '', body: '', photo: '', redirectToProfile: true})
          }
        })
    }
  }


  newPostForm = (title, body) => {
    return (
      <form>
        <div className="form-group">
          <label className="text-muted">Upload Photo</label>
          <input onChange={this.handleChange("photo")} type="file" accept="image/*" className="form-control" />
        </div>
        <div className="form-group">
          <label className="text-muted">post title</label>
          <input value={title} onChange={this.handleChange("title")} type="text" className="form-control" />
        </div>
        <div className="form-group">
          <label className="text-muted">body</label>
          <textarea value={body} onChange={this.handleChange("body")} className="form-control" />
        </div>
        <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">Submit</button>
      </form>)
  }

  render() {
    const { title, body, photo, error, user, loading, redirectToProfile } = this.state;

    if (redirectToProfile) {
      return <Redirect to={`/user/${user._id}`} />
    }

    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Create New Post</h2>
        <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>{error}</div>
        {loading ? <div className="jumbotron text-center">Loading...</div>: ""}
        {/* <img src={photoUrl} alt={name} style={{height: '200px', width: 'auto'}} 
          onError={i => i.target.src = `${DefaultProfile}`}
          className="thumbnail"/> */}
        {this.newPostForm(title, body)}
      </div>
    );
  }
}

export default NewPost;