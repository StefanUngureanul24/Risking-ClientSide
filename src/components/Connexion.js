import React from 'react';
import {Link} from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import jwt_decode from "jwt-decode";
//import axios from 'axios';


require('./formulaire.css')

/* eslint-disable */
const validEmailRegex = RegExp(
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  );
  /*const validateForm = errors => {
    let valid = true;
    Object.values(errors).forEach(val => val.length > 0 && (valid = false));
    return valid;
  };*/

  
class Connexion extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        email: null,
        password: null,
        errors: {
          email: '',
          password: '',
        }
      };
    }

    test(){
      const { history } = this.props;
      history.push('/Lobby_interface');
    }

    bouchon(){
      global.lobby.current_player = jwt_decode(global.lobby.current_JWT).name
      global.new_game_data.current_player = global.lobby.current_player
    }
  
    handleChange = (event) => {
      event.preventDefault();
      const { name, value } = event.target;
      let errors = this.state.errors;
      switch (name) {
        case 'email': 
          errors.email = 
            validEmailRegex.test(value)
              ? ''
              : 'Email non valide...';
          break;
        case 'password': 
          errors.password = 
            value.length < 8
              ? 'Le mot de passe doit contenir plus de 8 caractères...'
              : '';
          break;
        default:
          break;
      }
  
      this.setState({errors, [name]: value});
    }
  /*
    //temporaire (config serveur)
    handleSubmit(e) {
        e.preventDefault();
        axios({
          method: "POST",
          url: "http://localhost:8888/api/login.php",
          data: this.state
        }).then((response) => {
          if (response.data.status === 'success') {
            alert("Message Sent.");
            this.resetForm()
          } else if (response.data.status === 'fail') {
            alert("Message failed to send.")
          }
        })
      }
*/

    render() {
      const {errors} = this.state;
      return (
        <div className='wrapper'>
          <div className='form-wrapper'>


            <h2>Connexion</h2>

            <form  onSubmit={this.handleSubmit} method="post" >

              <div className='email'>
                <label htmlFor="email">Email</label>
                <input required type='email' name='email'  value={this.state.value} onChange={this.handleChange} noValidate />
                {errors.email.length > 0 && 
                  <span className='error'>{errors.email}</span>}
              </div>


              <div className='password'>
                <label htmlFor="password">Mot de passe</label>
                <input required type='password' name='password'  value={this.state.value} onChange={this.handleChange} noValidate />
                {errors.password.length > 0 && 
                  <span className='error'>{errors.password}</span>}
              </div>


              <div className='submit'>
                <button onClick = {() =>this.test()} name="loginSubmit" type="submit" className="btn btn-primary" >Se connecter</button>
              </div>


              <div className='submit'>
                  Pas encore inscrit ?   
              <Link className="nav-link" to="/Inscription">  S'inscrire </Link>
              </div>
              <div>
                <Link className="nav-link" to="/Map">  Jouer  </Link>
                <Link className="nav-link" onClick={() => this.bouchon()} to="/Lobby_creation">  (temp) page suivante  </Link>


                </div>

            </form>
          </div>
        </div>
      );
    }
  }


export default withRouter(Connexion)