import React from 'react';
//import axios from 'axios';

require('./formulaire.css')
/* eslint-disable */
const validEmailRegex = RegExp(
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  );
  /*
  const validateForm = errors => {
    let valid = true;
    Object.values(errors).forEach(val => val.length > 0 && (valid = false));
    return valid;
  };*/

  
export default class Inscription extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        fullName: null,
        email: null,
        password: null,
        errors: {
          fullName: '',
          email: '',
          password: '',
        }
      };
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
              ? 'Votre mot de passe doit contenir plus de 8 caractères...'
              : '';
          break;

          case 'fullName': 
          errors.fullName = 
            value.length < 5
              ? 'Veuillez entrer un Pseudo valide...'
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
          url: "http://localhost:8888/api/registration.php",
          data: this.state
        }).then((response) => {
          if (response.data.status === 'success') {
            alert("Message Sent.");
            this.resetForm()
          } else if (response.data.status === 'fail') {
            alert("Message failed to send.")
          }
        })
      }*/


    render( ) {
      const {errors} = this.state;
      return (
        <div className='wrapper'>
          <div className='form-wrapper'>
            <h2>Créer votre compte</h2>
            <form  onSubmit={this.handleSubmit} method="post" >
              <div className='fullName'>
                <label htmlFor="fullName">Pseudo</label>
                <input required type='text' name='fullName' value={this.state.value}  onChange={this.handleChange} noValidate />
                {errors.fullName.length > 0 && 
                  <span className='error'>{errors.fullName}</span>}
              </div>
              <div className='email'>
                <label htmlFor="email">Email</label>
                <input required type='email' name='email' value={this.state.value} onChange={this.handleChange} noValidate />
                {errors.email.length > 0 && 
                  <span className='error'>{errors.email}</span>}
              </div>
              <div className='password'>
                <label htmlFor="password">Mot de passe</label>
                <input required type='password' name='password' value={this.state.value} onChange={this.handleChange} noValidate />
                {errors.password.length > 0 && 
                  <span className='error'>{errors.password}</span>}
              </div>
              <div className='submit'>
                <button name="loginSubmit" type="submit" className="btn btn-primary" >Créer</button>
              </div>
            </form>
          </div>
        </div>
      );
    }
  }
