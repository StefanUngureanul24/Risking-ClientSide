import React from 'react';
import fleche from './battle/rsz_fleche_2.png'
import Popup from 'reactjs-popup';
import image_create_lobby from './battle/btn-createlobby.png'
import {Link} from "react-router-dom";
import * as Logique from './module_logique'
import  "./GlobalVariables"
import { withRouter } from 'react-router-dom';


require('./create_lobby.css');

 class Create_lobby extends React.Component {
 
    constructor(props) {
        super(props);
    
        this.state = {
    
          //handle errors
          
        Open:false,
        myInputValue:'' ,
        message_er:"",
        go:false,

        }
    };




 // POPUP handle Opening
 handlePopup = () => {
   
    this.setState({
      Open:true,
    });
    setTimeout(() => this.setState({ Open: false }), 3000)
  };


  rdgame(){
    var message = Logique.create_Message(0x18,global.lobby.current_JWT)
    console.log(message) 
    global.websocket.send(message)
  }




  join(){
      console.log(this.refs.input.value)


      //format ID valide (nombre uniquement)
      if(this.refs.input.value.length === 0) {
        this.setState({message_er:"Veuillez entrer un ID valide !"})
        this.setState({Open:true})
        this.setState({myInputValue:''})
        setTimeout(() => this.setState({ Open: false }), 2000)
      }

      // l'ID est faux (n'existe pas) //jwt bouchonné
       else{
         //envoi du message au serveur
        global.lobby.room_Id32 = this.refs.input.value
        let message =  Logique.create_Message(0x12, this.refs.input.value, global.lobby.current_JWT)
        console.log(message) 
        global.websocket.send(message)
       }
  

      //le Salon est plein
    /*if(window.new_game_data.message_er === "Salon plein"){
      this.setState({message_er:"Le salon est plein ! !"})
      this.setState({Open:true})
      this.setState({inputValue:""})
      setTimeout(() => this.setState({ Open: false }), 2000)
    }*/

    //la partie est déjà lancée
    /*else if(window.new_game_data.message_er === "Game déja lancé"){
      this.setState({message_er:"La partie est déjà lancée !"})
      this.setState({Open:true})
      this.setState({inputValue:""})
      setTimeout(() => this.setState({ Open: false }), 2000)
    }*/

    //Tout est OK -> redirection
    /*else{
    this.setState({Open:false})
    window.location.href='./Map' //temp}
  }*/
       //}

}

change(){
  this.setState({go :global.new_game_data.go})
  const { history } = this.props;
  if(this.state.go === true){
     global.new_game_data.go = false;
     this.setState({go :false})
     history.push('/Lobby_interface')
 }
}   

componentDidMount() {
  this.interval = setInterval(() =>  this.change(), 400);

  this.interval2 = setInterval(() => {
    if(global.new_game_data.error === true){
      this.setState({message_er: global.new_game_data.mess_err})
      this.setState({Open:true})
      setTimeout(() => this.setState({ Open: false }), 3000)
      global.new_game_data.error = false;
    }
  }, 500 );
}


componentWillUnmount() {
  clearInterval(this.interval);
  clearInterval(this.interval2);
}
  

    render() {

      return (
    
    <div class="principale">

        <div class="rejoindre">
          <button id ="Random_game_btn"  onClick={this.rdgame.bind(this)}> Rejoindre aléatoirement</button>
          <hr/>
            <h1>Salle ID:</h1>
           <input ref="input"  type="text"  onChange={this.getData} placeholder="012245" />
            <button id ="join"  onClick={this.join.bind(this)}> Rejoindre le lobby</button>
        </div>


        <div class="create">
            <Link to="Lobby_parametre"><img className="createImg" src ={image_create_lobby} id ="create" alt="img"/> </Link>
        </div>


        <div class="fleche">
            <img  src={fleche} alt="img" rotate="90"/>
        </div>

        
        <Popup
              open={this.state.Open}
              position='top center'
              onClose={this.handleClose}>

             <p>{this.state.message_er}</p>
          </Popup>

    </div>
      );
    }
}


export default withRouter(Create_lobby)
