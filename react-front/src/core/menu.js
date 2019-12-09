import React from 'react'
import {Link, withRouter} from 'react-router-dom';
import { signout, isAuthenticated } from '../auth'
import Logo from '../images/logo_green.png'

const isActive = (history, path) => {
  if(history.location.pathname === path){
    return { color: "#ff9900" }
  }else{
    return { color: "#ffffff" }
  }
}

const Menu = ({history}) => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
  <Link className="nav-item nav-link" to="/" style={isActive(history, "/")}><img alt="Howdy" style={{height: '1.5rem'}} src={Logo}></img></Link>
  
  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>
  <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
    <div className="navbar-nav">
      {/* <a className="nav-item nav-link active" href="#">Home <span className="sr-only">(current)</span></a> */}
     
      <Link className="nav-item nav-link" to="/users" style={isActive(history, "/users")}>users</Link>
      
      {!isAuthenticated() ?
      <>
      <Link className="nav-item nav-link" to="/signin" style={isActive(history, "/signin")}>sign in</Link>
      <Link className="nav-item nav-link" to="/signup" style={isActive(history, "/signup")}>sign up</Link>
      </>
      : ""
      }

      {isAuthenticated() ?
      <>
        <span onClick={()=> signout(() => history.push('/'))} className="nav-item nav-link" style={isActive(history, "/signout"), {cursor: "pointer", color: "#fff"}}>sign out</span>
        <Link className="nav-item nav-link" 
          style={isActive(history, `/user/${isAuthenticated().user._id}/`)} 
          to={`/user/${isAuthenticated().user._id}/`}>
            {`${isAuthenticated().user.name} Profile`}
            </Link>
      </>
        :""   
      }
      </div>
  </div>
</nav>
)

export default withRouter(Menu);