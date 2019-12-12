import React, { Component } from 'react'
import { singlePost, remove, like, unlike } from './apiPost'
import DefaultPostImage from '../images/emptyImage.png';
import { Link, Redirect } from 'react-router-dom';
import { isAuthenticated } from '../auth'
import Comment from './Comment'

export default class SinglePost extends Component {
  state = {
    post: '',
    redirectToHome: false,
    redirectToLogin: false,
    like: false,
    likes: 0,
    comments: []
  }

  updateComments = comments => {
    this.setState({ comments })
  }
  checkLike = (likes) => {
    const userId = isAuthenticated() && isAuthenticated().user._id;
    let match = likes.indexOf(userId) !== -1;
    return match;
  }

  componentDidMount = () => {
    const postId = this.props.match.params.postId;
    singlePost(postId).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        this.setState({
          post: data,
          likes: data.likes.length,
          like: this.checkLike(data.likes),
          comments: data.comments
        });
      }
    });
  }

  deletePost = () => {
    const token = isAuthenticated().token;
    const postId = this.props.match.params.postId;
    remove(postId, token)
      .then(data => {
        if (data.error) {
          console.log(data.error)
        } else {
          this.setState({ redirectToHome: true });
        }
      })
  }

  renderDeleteButton = () => {
    return (
      <>
        <button data-toggle="modal" data-target="#deleteConfirmation" className="btn btn-raised btn-danger btn-sm">delete post</button>

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
                <button onClick={this.deletePost} type="button" className="btn btn-raised btn-danger" data-dismiss="modal">Delete Post</button>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  likeToggle = () => {

    if (!isAuthenticated()) {
      this.setState({ redirectToLogin: true });
      return;
    }

    let callApi = this.state.like ? unlike : like;
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    const postId = this.state.post._id;
    callApi(userId, token, postId).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ like: !this.state.like, likes: data.likes.length });
      }
    })
  }

  renderPost = (post, likes) => {
    if (this.state.redirectToHome) {
      return <Redirect to="/" />
    }
    if (this.state.redirectToLogin) {
      return <Redirect to="/signin" />
    }

    const posterId = post.postedBy ? post.postedBy._id : "";
    const posterName = post.postedBy ? post.postedBy.name : "";
    return (
      <div className="card-body">
        <img src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
          alt={post.title} onError={i => (i.target.src = `${DefaultPostImage}`)}
          className="img-thumbnail mb-3" style={{ height: "300px", width: "100%", objectFit: 'cover' }} />

        {likes ? (
          <h3 onClick={this.likeToggle}>
            {likes} likes
          <i className="fa fa-thumbs-up text-success " style={{ padding: '10px', borderRadius: '50%', border: '1px solid', cursor: 'pointer' }}></i>
          </h3>
        ) : (
            <h3 onClick={this.likeToggle}>
              {likes} likes
          <i className="fa fa-thumbs-up text-warning " style={{ padding: '10px', borderRadius: '50%', border: '1px solid', cursor: 'pointer' }}></i>
            </h3>
          )}


        <p className="card-text">{post.body.substring(0, 100)}</p>
        <br />
        <p className="font-italic mark">Posted by: <Link to={`/user/${posterId}`}>
          {posterName} </Link></p> <p>on {new Date(post.created).toDateString()}</p>
        <div className="d-inline-block">
          <Link to={`/`} className="btn btn-raised btn-primary btn-sm mr-2">back to posts</Link>

          {isAuthenticated().user && isAuthenticated().user._id === post.postedBy._id &&
            <>
              <Link to={`/post/edit/${post._id}`} className="btn btn-raised btn-warning btn-sm mr-2">Update Post</Link>
              {this.renderDeleteButton()}
            </>
          }
        </div>
      </div>
    )
  }
  render() {

    const { post, likes, comments } = this.state;
    return (
      <div className="container">
        <h2 className="display-2 mt-5 mb-5">{post.title}</h2>
        {
          post ? (
            this.renderPost(post, likes)
          ) : (
              <div className="jumbotron text-center">Loading...</div>
            )
        }
        <Comment postId={post._id} comments={comments.reverse()} updateComments={this.updateComments} />
      </div>
    )
  }
}
