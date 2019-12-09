export const signup = user => {
  let url = `${process.env.REACT_APP_API_URL}/signup`
  return fetch(url,{
    method: "POST",
    headers: {
      Accept: 'application/json',
      "Content-type": 'application/json'
    },
    body: JSON.stringify(user)
  })
  .then(res => {return res.json()})
  .catch(err => console.log(err))
}

export const signin = user => {
  let url = `${process.env.REACT_APP_API_URL}/signin`
  return fetch(url,{
    method: "POST",
    headers: {
      Accept: 'application/json',
      "Content-type": 'application/json'
    },
    body: JSON.stringify(user)
  })
  .then(res => {return res.json()})
  .catch(err => console.log(err))
};

export const  authenticate = (jwt, next) => {
  if(typeof window !== "undefined"){
    localStorage.setItem("jwt", JSON.stringify(jwt))
    next();
  }
}

export const signout = next => {
  if(typeof window !== "undefined"){
    localStorage.removeItem("jwt");
  }
  next();
  let url = `${process.env.REACT_APP_API_URL}/signout`
  return fetch(url,{
    method:"GET"
  }).then(response => {
    console.log('signout', response);
    return response.json();
  })
}

export const isAuthenticated = () => {
  // debugger
  if(typeof window == "undefined"){
    return false;
  }
  if(localStorage.getItem('jwt')){
    let authObj = JSON.parse(localStorage.getItem('jwt'))
    // console.log(authObj)
    return authObj
  }else{
    return false;
  }
}