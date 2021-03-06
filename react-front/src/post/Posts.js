import React, { Component } from 'react'
import {list} from './/apiPost';
import DefaultPostImage from '../images/emptyImage.png';
import {Link} from 'react-router-dom';

export default class Posts extends Component {
  constructor(){
    super();
    this.state = { posts: []}
  }
  componentDidMount(){
    list().then(data => {
      if(data.error){
        console.log(data.error)
      }else{
        this.setState({posts: data});
      }
    })
  }

  renderPosts = posts => {
    // debugger
    return (
      <div className="row">
      {posts.map((post, idx) => {
      const posterId = post.postedBy ? post.postedBy._id : "";
      const posterName = post.postedBy ? post.postedBy.name : "";
      return (
        <div className="card col-md-4" key={idx}>
          <div className="card-body">
          <img src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                    alt={post.title} onError={i => (i.target.src = `${DefaultPostImage}`)}
                    className="img-thumbnail mb-3" style={{ height: "200px", width: "100%" }}/>
          <h5 className="card-title">{post.title}</h5>
          <p className="card-text">{ post.body.substring(0, 100) }</p>
          <br/>
           <p className="font-italic mark">Posted by: <Link to={`/user/${posterId}`}>
             {posterName} </Link></p> <p>on {new Date(post.created).toDateString()}</p>
            <Link to={`/posts/${post._id}`} className="btn btn-raised btn-primary btn-sm">read more</Link>
          </div>
        </div>
      )})}
  </div>
    )}

  render() {
    const { posts } = this.state;
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">{posts.length ? ('Recent Posts'):('Loading ...')}</h2>
        {this.renderPosts(posts)}
    </div>
    )
  }
}
