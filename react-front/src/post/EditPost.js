import React, { Component } from 'react';
import { singlePost, updatePost } from './apiPost'
import {isAuthenticated} from '../auth'
import { Redirect } from 'react-router-dom'
import DefaultProfile from '../images/emptyImage.png';


class EditPost extends Component {
  constructor(){
    super()
    this.state = {id: '', title: '', body: '', redirectToProfile: false, 
                  error: "", fileSize : 0, loading: false}
  }

  init = (postId) => {
    singlePost(postId).then(data => {
      if (data.error) {
        this.setState({ redirectToProfile: true });
        console.log(data.error)
      } else {
        this.setState({ id: data._id, title: data.title, body: data.body, error: "" });
      }
    });
  }


  isValid = () => {
    const { title, body, fileSize } = this.state;
    
    if(fileSize > 100000){
      this.setState({ error: "file size should be less than 100kb" , loading: false });
      return false;
    }
    if (title.length === 0) {
      this.setState({ error: "title is required" , loading: false });
      return false;
    }
    if (body.length === 0) {
      this.setState({ error: "body is required" , loading: false });
      return false;
    }
    return true;
  }



  editPostForm = (title, body) => {
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

      const postId = this.state.id;
      const token = isAuthenticated().token;
      updatePost(postId, token, this.postData)
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



  componentDidMount() {
    this.postData = new FormData();
    const postId = this.props.match.params.postId;
    this.init(postId);
  }

  render() {
    const {id, title, body, redirectToProfile, error, loading} = this.state;
    if(redirectToProfile){
      return <Redirect to={`/user/${isAuthenticated().user._id}`}/>
    }

    const photoUrl = id ? `${process.env.REACT_APP_API_URL}/post/photo/${id}?${new Date().getTime()}`
                        : DefaultProfile;

    return (
      <div className="container">
        <h2 className="mt-5 mb-5">{title}</h2>
        
        <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>{error}</div>
        {loading ? <div className="jumbotron text-center">Loading...</div>: ""}

        <img src={photoUrl} alt={title} style={{height: '200px', width: 'auto'}}
          onError={i => i.target.src = `${DefaultProfile}`}
          className="thumbnail"/>

        {this.editPostForm(title, body)}
      </div>
    );
  }
}

export default EditPost;