import React from "react";
import LogIn from '../components/templates/layerLogin.png';
import Popup from 'reactjs-popup';
//import  { Redirect } from 'react-router-dom'

//import {Link} from "react-router-dom";
import { getCookie } from "../components/cookies.js";
import {withRouter} from 'react-router-dom';
import jwt_decode from "jwt-decode";
import  "./GlobalVariables"


class Login extends React.Component 
{
    constructor(props) {
        super(props);
        this.state = {
       
            message_er:"",
            Open:false,
        
            
        }
        /*this.login = this.login.bind(this);
        this.onChangeLogin = this.onChangeLogin.bind(this);*/
    }

      redirectLogin() 
      {
        this.props.history.push("/Lobby_creation");
      }

      clickMe(){
        //ws.send(message)
        let username = this.refs.user_name.value
        let password = this.refs.password.value


    
        //verification longueur du nom
        if(username.length<5){
          this.setState({message_er:"Veuillez entrer un username valide"})
          this.setState({Open:true})
          setTimeout(() => this.setState({ Open: false }), 3000)
          return
        }

          //Verification longueur mdp
        if(password.length<8 ){
          this.setState({message_er:"Veuillez entrer un mot de passe valide"})
          this.setState({Open:true})
          setTimeout(() => this.setState({ Open: false }), 3000)
          return
        }
    
        // Ajouter ça normalement
        /*
        else {
          this.redirectLogin();
        }
        */
          
          //inputs OK alors requete php

          let request = new XMLHttpRequest();
        request.onreadystatechange =  ()=> {
            if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
                //console.log(this.responseText);
                if (request.responseText.includes("OK")) {
                  global.lobby.current_JWT = getCookie("JWT_logged")
                  global.lobby.current_player = jwt_decode(global.lobby.current_JWT).name
                  global.new_game_data.current_player = global.lobby.current_player
                  this.redirectLogin();
                } else {
                  this.setState({message_er:request.responseText})
                  this.setState({Open:true})
                  setTimeout(() => this.setState({ Open: false }), 3000)
                  return
                }

            }
        }; 

        // header
        request.open("POST", "api/login.php");
        request.setRequestHeader("content","multipart/form-data");
        // construct body request
        let data = new FormData(); // comptabilité de set
        data.append("gamertag", username)
        data.append("pwd", password)
        // send
        request.setRequestHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        request.send(data);

    }



    render() 
    {
        return (
            <div>
        <form action="api/login.php" method="post" className="formLogin">
            <p>Username</p>
            <input ref="user_name"  type="text" name="usernameLog" placeholder="Username..." />
            <p>Password</p>
            <input ref="password"  type="password" name="passwordLog" placeholder="Mot de passe..."/>
            <br />
                
            <img onClick={this.clickMe.bind(this)} className="loginImg" src={LogIn} alt="Log In" />
            
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

export default withRouter(Login)