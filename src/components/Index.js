import React from 'react';
import LogoRisking from '../components/templates/logo.png';
import Join from '../components/templates/joingame.png';
import { getCookie } from "../components/cookies.js";

/* Les formulaires */
import Login from '../components/Login';
import Signup from '../components/Signup';

import {Link} from "react-router-dom";
import Popup from 'reactjs-popup';
import jwt_decode from "jwt-decode";
import  "./GlobalVariables"


/* PostData */
//import PostData from '../components/PostData';

/* Les boutons pour afficher les formulaires */
import SignIn from '../components/templates/layerSignin.png';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';

require('../components/indexRisking.css')

export default class Index extends React.Component {
    constructor() {
        super();
        this.state = {
            name: 'React',
            showHideLogin: true, /* Par défaut, le formulaire de login est affiché */
            showHideSignup: false, /* Par défaut, le formulaire de signup est caché */
            message_er:"",
            Open:false,
        };
        this.hideComponent = this.hideComponent.bind(this);
    }
    
    /* Fonction qui affiche l'une des formulaire à partir de leur états (affiché / caché) */
    hideComponent(name) {
        switch(name) {
            case "showHideLogin":
                /* Si le login n'est pas affiché, on va l'afficher en appuyant le bouton Login */
                if (!this.state.showHideLogin)
                {
                    this.setState({ showHideLogin: !this.state.showHideLogin });
                    this.setState({ showHideSignup: !this.state.showHideSignup });
                }
                break;
            case "showHideSignup":
                /* Si le signup n'est pas affiché, on va l'afficher en appuyant le bouton Signup */
                if (!this.state.showHideSignup)
                {
                    this.setState({ showHideSignup: !this.state.showHideSignup });
                    this.setState({ showHideLogin: !this.state.showHideLogin });
                }
                break;
            default:
        }
    }

    redirectLogin() 
    {
      this.props.history.push("/Lobby_creation");
    }

    clickMe(){
        //ws.send(message)
        let username = this.refs.username.value
        console.log(username)


    
        //verification longueur du nom
        if(username.length<5){
          this.setState({message_er:"Veuillez entrer un username valide de minimum 5 caractères"})
          this.setState({Open:true})
          setTimeout(() => this.setState({ Open: false }), 3000)
          return
        }
          
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
        request.open("POST", "api/play_without_login.php");
        request.setRequestHeader("content","multipart/form-data");
        // construct body request
        let data = new FormData(); // comptabilité de set
        data.append("gamertag", username)
        // send
        request.setRequestHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        request.send(data);

    }

    render() {
        if (getCookie("JWT_logged")) {
            global.lobby.current_JWT = getCookie("JWT_logged")
            global.lobby.current_player = jwt_decode(global.lobby.current_JWT).name
            global.new_game_data.current_player = global.lobby.current_player
            return <Redirect to={"/Lobby_creation"}></Redirect>;
        } else {


            const {showHideLogin, showHideSignup} = this.state;
            return (
                <div>
                    <div className="containerIndex">

                        <img className="logoRiskingIndex" src={LogoRisking} alt="Risking"/>

                        <form method="post" action="" className="formNewGame">
                            <h1> Quick Game </h1>
                            <p className="firstP">Username</p>
                            <input ref="username" type="text" name="nickname"
                                   placeholder="Username pour une partie rapide..."/>
                            <img onClick={this.clickMe.bind(this)} className="formImg" src={Join} alt="Join"/>
                        </form>

                        <div className="flagContainer">
                            <Link to="/signup">
                                <img className="signupFlag" src={SignIn} alt="Sign Up"/>
                            </Link>
                        </div>

                        {showHideLogin && <Login/>}
                        {showHideSignup && <Signup/>}

                    </div>
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
}


