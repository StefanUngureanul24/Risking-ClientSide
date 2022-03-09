import React from 'react';
import Popup from 'reactjs-popup';
import  "./GlobalVariables"
import Australia from './battle/australia.png';
import Mexico from './battle/mexico.png';
import Map_1 from './battle/map_1.png';

import {Link} from "react-router-dom";
import {withRouter} from 'react-router-dom';
import * as Logique from './module_logique'

require('./parametre.css');


class Parametre extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          parametre_1: null, //nb_player_max
          parametre_2: null, //timer
          parametre_3: null, //map_id
          map:1,
          message_er:"",
          Open:false,
          change_style:true,
          go:false,
        };
      }


      

//envoyer le message 
  clickMe(){

 
    //ws.send(message)

      //nombre de joueur verification 
    if(this.refs.input.value>6 || this.refs.input.value<2 ){
      this.setState({message_er:"Veuillez entrer un nombre de joueurs entre 2 et 6!"})
      this.setState({Open:true})
      setTimeout(() => this.setState({ Open: false }), 3000)
    }else{
        if(this.refs.nb_temps.value<30  ){
          this.setState({message_er:"Veuillez entrer un temps par tour supérieur à 30 !"})
          this.setState({Open:true})
          setTimeout(() => this.setState({ Open: false }), 3000)
        }else{

          if(this.state.map === 0){
            this.setState({message_er:"Veuillez selectionner une map..."})
            this.setState({Open:true})
            setTimeout(() => this.setState({ Open: false }), 3000)
          }
          else{

    //inputs OK alors send 
    
    global.lobby.tab_Player_name.push(global.lobby.current_player)
    global.lobby.nb_player++
    var message = Logique.create_Message(0x10,this.refs.input.value,this.state.map,this.refs.nb_temps.value,global.lobby.current_JWT)
    console.log(message)
    global.websocket.send(message)
    
    /*var message_test = new Uint8Array([0x11,1,0,0,0,0,0,0,0])
    Logique.parser(message_test, window.new_game_data, window.lobby)*/

  
    //le Lobby est crée alors redirection vers le salon
    /*if(window.lobby.room_Id !== -1){
      this.setState({Open:false})
      window.location.href='./Map' //temp
  }*/
    /*else{
      this.setState({message_er:"Erreur du serveur, le salon n'est pas crée, veuillez réessayer !"})
      this.setState({Open:true})
      setTimeout(() => this.setState({ Open: false }), 3000)
    }*/
  }
}}


}
  

  //Utilisation uniquement de la Map 1  pour l'instant
  map_1(){

      this.setState({map:1})
  }

  
  map_2(){
    this.setState({message_er:"Map disponible prochainement"})
    this.setState({Open:true})
    setTimeout(() => this.setState({ Open: false }), 3000)

}

map_3(){
  this.setState({message_er:"Map disponible prochainement"})
    this.setState({Open:true})
    setTimeout(() => this.setState({ Open: false }), 3000)}



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
  }

  componentWillUnmount() {
    clearInterval(this.interval);
}




  
    render() {

      return (
    
    <div class="principale">

        <div class = "parametre">

          <div class="parametre_1">
              <label>
                  Nombre de joueurs :</label>
                  <input type="number" ref="input"  value={this.state.parametre_1} onChange={this.getData} id="nb_player" name="Nombre de joueur" min="2" max="6" defaultValue="2"></input>
          </div>


          <div class="parametre_2">
              <label>
                  Temps par tour (en secondes):</label>
                  <input type="number"  ref="nb_temps" min="30" max="90" defaultValue="30" />              
          </div>


          <div class="mapsLobby">
                      <img onClick={() =>this.map_1()}  src={Map_1} id="Map1"   alt="Map1" />
                      <img onClick={() =>this.map_2()} src={Mexico} id="Map2" alt="Map2" />
                      <img onClick={() =>this.map_3()} src={Australia} id="Map3"  alt="Map3" />
          </div>

          <div class="creer">
              <button id="Button_valider" onClick={this.clickMe.bind(this)}> Valider les paramètres </button>
              <Link className="nav-link" to="/Lobby_creation">   <button id ="Button_retour" component={Link} to="/Lobby_creation" > Quitter</button>  </Link>
              {/*<Link  to="/Lobby_interface"> (temp) page suivante </Link>*/}

          </div>
        </div>



        {/*Gestion des erreurs*/}
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

export default withRouter(Parametre)