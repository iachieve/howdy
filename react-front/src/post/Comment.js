import React, { Component } from 'react'
import { comment, uncomment } from './apiPost'
import { Link } from 'react-router-dom'
import { isAuthenticated } from '../auth'
import DefaultProfile from '../images/avatar.png';


export default class Comment extends Component {
  state = {
    text: "",
    error: "",
    commentToDelete: ""
  }
  isValid = () => {
    const { text } = this.state;

    if (!text.trim().length > 0 || text.trim().length > 150) {
      this.setState({ error: "max length is 150 characters." })
      return false;
    }
    return true;
  }
  handleChange = (event) => {
    this.setState({ text: event.target.value, error: "" })
  }
  addComment = (event) => {
    event.preventDefault();
    if (!isAuthenticated()) {
      this.setState({ error: "please login to leave a comment" })
      return;
    }
    if (this.isValid()) {
      const userId = isAuthenticated().user._id;
      const postId = this.props.postId;
      const token = isAuthenticated().token;
      const newComment = { text: this.state.text }
      comment(userId, token, postId, newComment)
        .then(data => {
          if (data.error) {
            console.log(data.error)
          } else {
            this.setState({ text: "" });
            this.props.updateComments(data.comments);
          }
        })
    }
  }


  renderDeleteComment = (deleteComment) => {
    return (
      <>

        <div className="modal fade" id="deleteComment" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Delete Confirmation</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete your comment?
          </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-raised btn-secondary mr-1" data-dismiss="modal">Cancel</button>
                <button onClick={() => this.deleteComment(deleteComment)} type="button" className="btn btn-raised btn-danger" data-dismiss="modal">Delete Comment</button>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  deleteComment = (deleteComment) => {
    // debugger
    const userId = isAuthenticated().user._id;
    const postId = this.props.postId;
    const token = isAuthenticated().token;

    uncomment(userId, token, postId, deleteComment)
      .then(data => {
        if (data.error) {
          console.log(data.error)
        } else {
          this.setState({ text: "" });
          this.props.updateComments(data.comments);
          this.setState({ commentToDelete: "" })
        }
      })
  }


  render() {
    let comments = this.props.comments;
    const { error } = this.state;
    return (
      <div>
        <h2 className="mt-5 mb-5">leave a comment</h2>
        <form>
          <div className="form-group">
            <input
              type="text"
              onChange={this.handleChange}
              value={this.state.text}
              className="form-control"
              placeholder="Leave a comment..."
            />
            <button onClick={this.addComment} className="btn btn-raised btn-success mt-2">
              Post </button>
          </div>
        </form>
        <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>{error}</div>
        <div className="col-md-12">
          <h3 className="text-primary">{comments.length} Comments</h3>
          <hr />
          {comments.map((comment, i) => (
            <div key={i}>
              <div>
                <Link to={`/user/${comment.postedBy._id}`}>
                  <img src={`${process.env.REACT_APP_API_URL}/user/photo/${comment.postedBy._id}`}
                    onError={i => i.target.src = `${DefaultProfile}`}
                    className="float-left mr-2"
                    style={{ height: '40px', width: "40px", borderRadius: "50%", border: "1px solid" }}
                    alt={comment.postedBy.name} />
                  <span className="lead">{comment.postedBy.name}</span>
                </Link>
                <p style={{ clear: "both" }}>
                  {comment.text}
                </p>

                <div className="mark">
                <span className="font-italic">comment by:&nbsp;
                  <Link  to={`/user/${comment.postedBy._id}`}>
                    {comment.postedBy.name}
                  </Link>
                </span>

                 <span> on {new Date(comment.created).toDateString()}
                </span>
                <span data-toggle="modal" data-target="#deleteComment" className="text-danger float-right mr-1" style={{ cursor: 'pointer'}}>remove</span>

                {isAuthenticated().user && isAuthenticated().user._id === comment.postedBy._id &&
                  <>

                    {this.renderDeleteComment(comment)}
                  </>
                }
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    )
  }
}
