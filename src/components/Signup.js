import React from "react";
import SignUp from '../components/templates/layerSignup.png';
import Back from '../components/templates/back.png';
import Popup from 'reactjs-popup';
import { Link } from "react-router-dom";
import { withRouter } from 'react-router-dom';

/* eslint-disable */
const validEmailRegex = RegExp(
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);

class Signup extends React.Component 
{
    constructor(props) {
        super(props);
        this.state = {
           /* usernameSign: '',
            passwordSign: '',
            passwordSignConf: ''*/

            message_er:"",
            Open:false,
        }
    }

    redirectSignup() 
    {
      this.props.history.push("/");
    }

    clickMe(){

        //ws.send(message)
        let username = this.refs.user_name.value
        let password = this.refs.password.value
        let password_confir = this.refs.password_confirmation.value
        let email = this.refs.email.value


    
          //verification longueur du nom
        if(username.length<2){
          this.setState({message_er:"Veuillez entrer un username valide de minimum 5 caractères"})
          this.setState({Open:true})
          setTimeout(() => this.setState({ Open: false }), 3000)
          return
        }

        if(!validEmailRegex.test(email)){
          this.setState({message_er:"Cet email est déjà utilisé ou n'est pas valide. Veuillez entrer un email valide"})
          this.setState({Open:true})
          setTimeout(() => this.setState({ Open: false }), 3000)
          return
        }

          //Verification longueur mdp
        if(password.length<8 ){
          this.setState({message_er:"Veuillez entrer un mot de passe valide de minimum 8 caractères"})
          this.setState({Open:true})
          setTimeout(() => this.setState({ Open: false }), 3000)
          return
        }
            //verification si mdp saisie == mdp de confirmation
          if(password !== password_confir){
            this.setState({message_er:"Les deux mot de passes ne correspondent pas..."})
          this.setState({Open:true})
          setTimeout(() => this.setState({ Open: false }), 3000)
          return
          }

          //inputs OK alors requete php
        let request = new XMLHttpRequest();
        request.onreadystatechange = () => {
          if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
              if (request.responseText.includes("OK")) {
                this.redirectSignup();
              } else {
                  //alert(request.responseText)
                  this.setState({message_er:request.responseText})
                  this.setState({Open:true})
                  setTimeout(() => this.setState({ Open: false }), 3000)
              }

          }
      };

        // header
        request.open("POST", "/api/signup.php");
        request.setRequestHeader("content","multipart/form-data");
        // construct body request
        let data = new FormData(); // comptabilité de set
        data.append("gamertag", username)
        data.append("pwd", password)
        data.append("pwdr", password_confir)
        data.append("email", email)
        // send
        request.send(data);
    }


    render()
    {
        return (
            <div className="signupBackground">
            
        <form action="/api/signup.php" method="post" className="formSignup" id="signupForm">
              <Link to="">
                <img className="backLobby" src={Back} alt="Go back" />
              </Link>   
                <p>Username</p>
                <input ref="user_name"  type="text" name="dialog_signup_pseudo" placeholder="Entrer votre username..." />
                <p>Email</p>
                <input ref="email"  type="text" name="dialog_signup_mail" placeholder="email..." />
                <p>Password</p>
                <input ref="password"  type="password" name="dialog_signup_password" placeholder="Mot de passe..."/>
                <p>Confirm Password</p>    
                <input ref="password_confirmation" type="password" name="dialog_signup_passrepeat"  placeholder="Retaper votre mot de passe... "/>
                <br />
                <img className="signupImg" onClick={this.clickMe.bind(this)} src={SignUp} alt="Log In" />
        </form>


        <Popup
              open={this.state.Open}
              position='top center'
              onClose={this.handleClose}>
             <p>{this.state.message_er} </p>
        </Popup>

        </div>
        );
    }
}

export default withRouter(Signup)
