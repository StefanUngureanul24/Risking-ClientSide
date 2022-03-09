import React from 'react';
//import {Link} from 'react-router-dom';
import Joueurs from "./Joueurs";
import JoueursSoldats from "./Joueurs_soldats";
import InfosPanel from "./Infos_panel";
import InfosPanelSoldats from "./infos_panel_soldats";
import * as Logique  from "./module_logique";
import Popup from 'reactjs-popup';
import  "./GlobalVariables"
import mapstream from "../1";

import character1 from "./battle/axer-pixfix.png";
import ModalImage  from "react-modal-image";
import { withRouter } from 'react-router-dom';
import * as smalltalk from 'smalltalk'
import passerphase from "./battle/rsz_playerphasesuivant-bouton.png"
import passertour from "./battle/playerfindutour-bouton.png"
//import {Alert} from 'react-native';

import audio_game from '../sounds/back.mp3';
const audio = new Audio(audio_game);

require("./Map.css")

//console.log = console.warn = console.error = () => {};
class Map extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

      //nombre de territoires autres joueurs
      arr: [
        4,2
      ],

      //nombre de soldats autres joueurs
      arr_soldats: [
        2,1
      ],

      // MAJ des soldats dans chaque territoire, array de taille TERRITORY_NUMBER
      territoire_array : [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],

      //nombre de territoire joueur courant
      arr_self: 2,
      //nombre de soldats joueur courant
      arr_self_soldats: 1 ,

      //repartition des joueurs sur les territoires
      map_repartition:[
        {id : "player_1", ter:["0","12","2","18","4","39","6","29","8","45","10"]},
        {id : "player_2", ter:["11","1","13","34","15","16", "47","3" ]},
        {id : "player_3", ter:["19","20","21","22","23","24","25","26","27",]},
        {id : "player_4", ter:["28","7","30","31","32","33","14","37","35","36"]},
        {id : "player_5", ter:["38","5","40","41","42","43","44","9","46","17"]},
        {id : "player_6", ter:""},
      ],


      //Phase courante
      phase:1,

      // handling de la popup bonhomme
      isOpen: true,
      isOpenImage:true,

      // handling de la popup message erreurs
      Open: false,
      // affichage msg erreur
      err:"",

      //handling popup notif
      notif:"",
      popOpen: false,
      //winner
      winner :"",
      current_player_name:"",
      explication_phase:"",
      go: false,
    };
    this.handleZoneClick = this.handleZoneClick.bind(this);
  }

  playAudio() {
    audio.load();
    audio.loop = true;
    audio.play();
  }

  stopAudio() {
    audio.pause();    
  }  

  //Passer le tour 
  handleClick_Passer() {
    console.log('Tour passé');
  }


  //Quitter la partie
  handleClick_Quitter(){
    global.websocket.close();
    global.websocket = new WebSocket("wss://wssrisking.zefresk.com:42424");
    global.websocket.binaryType = "arraybuffer";

    global.websocket.onopen = function(e) {
      console.log("connected")
    };

    global.websocket.onmessage = function(event) {
      console.log(event.data)
      var buffer = new Uint8Array(event.data)
      Logique.parser(buffer, global.new_game_data, global.lobby,mapstream)
    };

    global.websocket.onclose = function(event) {
      if (event.wasClean) {
        console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
      } else {
        console.log('[close] Connection died');
      }
      console.log(event.code)
    };

    global.websocket.onerror = function(error) {
      console.log(`[error] ${error.message}`);
    }

    Logique.clear_game(global.new_game_data)
    Logique.clear_lobby(global.lobby)
    console.log('Partie quittée');
    const { history } = this.props;
    history.push('/Lobby_parametre')
    //add redirection + griser territoires
  }

  //Gérer les phases
  handleZoneClick(e) {

    if (global.new_game_data.current_name === global.new_game_data.current_player){
      if(global.new_game_data.phase === 0){
        if(global.new_game_data.tab_Player[global.new_game_data.id_current_player].ter.indexOf(e.target.id) === -1){
          this.setState({err: "mauvaise case de renforcement"})
          this.setState({Open:true})
          setTimeout(() => this.setState({ Open: false }), 3000)
          global.new_game_data.error = false
        }
        else{
          this.setState({phase:2})
          e.stopPropagation();
          var tab = [e.target.id , global.new_game_data.t_toplace];

          var message = Logique.create_Message(0x40, tab[0],tab[1]);
          console.log(message);
          global.websocket.send(message)
        }
      }

      else if (global.new_game_data.phase === 1){
        if (global.info_phase[0] === -1){
          if(global.new_game_data.tab_Player[global.new_game_data.id_current_player].ter.indexOf(e.target.id) === -1){
            this.setState({err: "mauvaise case"})
            this.setState({Open:true})
            setTimeout(() => this.setState({ Open: false }), 3000)
            global.new_game_data.error = false
          } else {
            global.info_phase[0] = parseInt(e.target.id);
          }
        }
        else {
          if(global.new_game_data.tab_Player[global.new_game_data.id_current_player].ter.indexOf(e.target.id) > -1){
            this.setState({err: "mauvaise case"})
            this.setState({Open:true})
            setTimeout(() => this.setState({ Open: false }), 3000)
            global.new_game_data.error = false
            global.info_phase[0] = -1;
          }
          else {
            if (global.new_game_data.tab_Territory[global.info_phase[0]].nb_soldier === 1 ){
              this.setState({err: "trop peu de soldat"})
              this.setState({Open:true})
              setTimeout(() => this.setState({ Open: false }), 3000)
              global.new_game_data.error = false
              global.info_phase[0] = -1;
            }
            else {
              global.info_phase[1] = parseInt(e.target.id);
              this.setState({phase:3})
              //var nb_sol = window.prompt('nombre de soldat entre 1 et 3');
              smalltalk
                .prompt('Attaque','Nombre de troupe entre 1 et 3','1')
                .then((value) =>{
                    var nb_sol = parseInt(value);
                    var message1 = Logique.create_Message(0x50,global.info_phase[0], global.info_phase[1], nb_sol);
                    console.log(message1)
                    global.websocket.send(message1)
                    global.info_phase[0] = -1;
                    global.info_phase[1] = -1;
                })
                .catch(() =>{
                  global.info_phase[0] = -1
                  global.info_phase[1] = -1
                })            
            }
          }
        }
      }
      else if (global.new_game_data.phase === 2){
        if (global.info_phase[0] === -1){
          if(global.new_game_data.tab_Player[global.new_game_data.id_current_player].ter.indexOf(e.target.id) === -1){
            this.setState({err: "mauvaise case"})
            this.setState({Open:true})
            setTimeout(() => this.setState({ Open: false }), 3000)
            global.new_game_data.error = false
          } else {
            if (global.new_game_data.tab_Territory[parseInt(e.target.id)].nb_soldier === 1){
              this.setState({err: "trop peu de soldat"})
              this.setState({Open:true})
              setTimeout(() => this.setState({ Open: false }), 3000)
              global.new_game_data.error = false
              global.info_phase[0] = -1;
            }
            else {
              global.info_phase[0] = parseInt(e.target.id);
            }
          }
        }
        else {
          if(global.new_game_data.tab_Player[global.new_game_data.id_current_player].ter.indexOf(e.target.id) === -1){
            this.setState({err: "mauvaise case"})
            this.setState({Open:true})
            setTimeout(() => this.setState({ Open: false }), 3000)
            global.new_game_data.error = false
            global.info_phase[0] = -1;
          }
          else {
            global.info_phase[1] = parseInt(e.target.id);
            if (global.info_phase[0] === global.info_phase[1]){
              this.setState({err: "mauvaise case"})
              this.setState({Open:true})
              setTimeout(() => this.setState({ Open: false }), 3000)
              global.new_game_data.error = false
              global.info_phase[0] = -1;
              global.info_phase[1] = -1;
            }
            else {
              //var nb_sol1 = window.prompt('nombre de soldat');
              this.setState({phase:1})
              smalltalk
                .prompt('Tranfert','Nombre de troupes','0')
                .then((value) =>{
                    var nb_sol1 = parseInt(value);
                    var message2 = Logique.create_Message(0x60,global.info_phase[0], global.info_phase[1], nb_sol1);
                    console.log(message2)
                    global.websocket.send(message2)
                    global.info_phase[0] = -1;
                    global.info_phase[1] = -1;
                })
                .catch(() =>{
                  global.info_phase[0] = -1
                  global.info_phase[1] = -1
                })  
            }
          }
        }
      }
    }
  }


  change(){
    this.setState({go :global.new_game_data.go})
    const { history } = this.props;
    if(this.state.go === true){
        global.new_game_data.go = false;
        setTimeout(() => this.setState({go :false}), 10000)
        history.push('/Lobby_interface')
    }
  }


  closenotif(){
    setTimeout(() => this.setState({ popOpen: false }), 3000)
    global.new_game_data.notif = false
    //this.close()
  }


  // POPUP handle Opening bonhomme
  handleOpen = () => {
    setTimeout(() => this.setState({ isOpen: false }), 1000)
  };

  // POPUP handle Opening error message
  handleOpen_err = () => {
    setTimeout(() => this.setState({ Open: false }), 1000)
  };


  //Gérer les clics sur les phases
  handlePhase=()=> {
    if (global.new_game_data.current_name === global.new_game_data.current_player){
      if (global.new_game_data.phase !== 0){
        //global.new_game_data.phase = (global.new_game_data.phase + 1) % 3;
        console.log(global.new_game_data);
        var message3 = Logique.create_Message(0x70);
        console.log(message3);
        global.websocket.send(message3)
      }
      else {
        if(global.new_game_data.t_toplace === 0){
          console.log(global.new_game_data);
          var message4 = Logique.create_Message(0x70);
          console.log(message4);
          global.websocket.send(message4)
        }
      }
    }
    else {
      this.setState({err: "ce n'est pas votre tour"})
      this.setState({Open:true})
      setTimeout(() => this.setState({ Open: false }), 3000)
      global.new_game_data.error = false
    }
  };



  /*Refresh state each 500/1000 seconde*/
  componentDidMount() {
    this.state.phase === 1?this.setState({isOpen:true}):this.setState({isOpen:false})
    setTimeout(() => {
      this.setState({ isOpen:false });
    }, 1500);

    // MAJ nombre de soldats sur les territoires:  position i -> territoire i 
    this.interval = setInterval(() => this.setState({territoire_array : Logique.tab_nb(global.new_game_data)}), 500);


    // MAJ du nombre de régions possédées chez le joueur courant
    this.interval_2 = setInterval(() => this.setState({arr_self: window.p}), 500);

    // MAJ du nombre de soldats possédées chez le joueur courant (ne pas oublier mod 10)
    //this.interval_3 = setInterval(() => this.setState({arr_self_soldats:window.obj.tab[window.obj.id]}), 500);


    this.interval_7 = setInterval(() => this.setState({current_player_name: global.new_game_data.current_name}), 500);

    this.interval_10 = setInterval(() =>{

      if(global.new_game_data.error === true){
        this.setState({err: global.new_game_data.mess_err})
        this.setState({Open:true})
        setTimeout(() => this.setState({ Open: false }), 3000)
        global.new_game_data.error = false;

      }
    }, 500);

    this.interval_11 = setInterval(() => {
          if (global.new_game_data.notif === true){
            if (this.state.isOpen === false){
              this.setState({notif: global.new_game_data.mess_notif})
              this.setState({popOpen:true})
            }
          }
        }
        , 500);

    this.interval_12 = setInterval(() =>  this.change(), 3000);

    //this.interval_4 = setInterval(() => (this.state.phase == 1)? this.setState({isOpen: true}):this.setState({isOpen: false}), 10000);

    //MAJ du nombre de territoires chez les autres joueurs
    //this.interval = setInterval(() => this.setState({arr : X  }), 1);


    //this.interval_5 = setInterval(() => this.setState({state: global.new_game_data.phase}), 500);

    this.interval_6 = setInterval(() => this.setState({phase: global.new_game_data.phase+1}), 500);
    this.interval_9 = setInterval(() =>{
      if(this.state.phase === 1){this.setState({explication_phase:"Renforcement"})}
      else if(this.state.phase === 2){this.setState({explication_phase:"Attack"})}
      else if(this.state.phase === 3){this.setState({explication_phase:"Déplacement de troupe"})}
    }, 500);

    if(this.state.phase === 1){
      this.playAudio()
    }  


    // MAJ de la répartition des territoires dans les différentes zones
    if(global.new_game_data.tab_Player.length === 2 ){
      this.interval_4 = setInterval(() => this.setState(
          {map_repartition:[
              {id : "player_1", ter:global.new_game_data.tab_Player[0].ter},
              {id : "player_2", ter:global.new_game_data.tab_Player[1].ter},
            ],}
      ), 500)
    }


    else if(global.new_game_data.tab_Player.length === 3 ){
      this.interval_4 = setInterval(() =>
          this.setState(
              {
                map_repartition:[
                  {id : "player_1", ter:global.new_game_data.tab_Player[0].ter},
                  {id : "player_2", ter:global.new_game_data.tab_Player[1].ter},
                  {id : "player_3", ter:global.new_game_data.tab_Player[2].ter},
                ]

              }) , 500);
    }

    else if(global.new_game_data.tab_Player.length === 4 ){

      this.interval_4 = setInterval(() =>
          this.setState(
              {
                map_repartition:[
                  {id : "player_1", ter:global.new_game_data.tab_Player[0].ter},
                  {id : "player_2", ter:global.new_game_data.tab_Player[1].ter},
                  {id : "player_3", ter:global.new_game_data.tab_Player[2].ter},
                  {id : "player_4", ter:global.new_game_data.tab_Player[3].ter},

                ]

              }) , 500);
    }

    else if(global.new_game_data.tab_Player.length === 5 ){

      this.interval_4 = setInterval(() =>
          this.setState(
              {
                map_repartition:[
                  {id : "player_1", ter:global.new_game_data.tab_Player[0].ter},
                  {id : "player_2", ter:global.new_game_data.tab_Player[1].ter},
                  {id : "player_3", ter:global.new_game_data.tab_Player[2].ter},
                  {id : "player_4", ter:global.new_game_data.tab_Player[3].ter},
                  {id : "player_5", ter:global.new_game_data.tab_Player[4].ter},
                ]
              }) , 500);
    }

    else if(global.new_game_data.tab_Player.length === 6 ){

      this.interval_4 = setInterval(() =>
          this.setState(
              {
                map_repartition:[
                  {id : "player_1", ter:global.new_game_data.tab_Player[0].ter},
                  {id : "player_2", ter:global.new_game_data.tab_Player[1].ter},
                  {id : "player_3", ter:global.new_game_data.tab_Player[2].ter},
                  {id : "player_4", ter:global.new_game_data.tab_Player[3].ter},
                  {id : "player_5", ter:global.new_game_data.tab_Player[4].ter},
                  {id : "player_6", ter:global.new_game_data.tab_Player[5].ter},
                ]
              }) , 500);
    }
  }


//Reset 
  componentWillUnmount() {
    clearInterval(this.interval);
    clearInterval(this.interval_2);
    clearInterval(this.interval_3);
    clearInterval(this.interval_4);
    clearInterval(this.interval_6);
    clearInterval(this.interval_10);
    clearInterval(this.interval_11)
    clearInterval(this.interval_12)
  }


  render(){

    window.obj = Logique.nb_soldat_total(global.new_game_data)

    window.p  =4;
    window.map = 0;
    window.test=  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

//window.test =  Logique.tab_nb(global.new_game_data);
    window.ar = [0,8,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,4,0,0,0,0,0,5,0,0,6,0,0,0,0]


    // render des régions possédés et nombre de soldats pour les autres joueurs
    let rows = []
    if (global.new_game_data.tab_Player.length <= 3) { // bug si > 3 joueurs
      for (let i = 0; i < global.new_game_data.tab_Player.length - 1; i++) {
        rows.push(<Joueurs key={this.state.arr[i]} ter={this.state.arr[i]}/>)
        rows.push(<JoueursSoldats key={this.state.arr_soldats[i]} soldats={this.state.arr_soldats[i]}/>)
      }
    }


    const map = window.map;
    let comp;
    if(map === 0){
      comp = <div class="map__image" >
        <svg viewBox="100 0 1800 1000"   xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink ">
          <g transform="translate(0.000000,1080.000000) scale(0.100900,-0.10090)">

            <path  z-index="-1" onClick={this.handleZoneClick} id="0" className={this.state.map_repartition.filter((item) => item.ter.includes("0")).map(({id}) => ({id}))[0].id }  d="M4564 9599 c-71 -55 -171 -101 -217 -101 -16 1 -44 10 -63 21 -19 12
  -41 21 -48 21 -22 0 -49 -38 -43 -60 3 -11 1 -23 -4 -26 -17 -10 -9 -52 14
  -66 29 -18 144 -64 180 -72 22 -5 28 -12 25 -29 -2 -15 -25 -34 -80 -65 -63
  -35 -78 -49 -78 -67 0 -41 70 -78 207 -110 82 -19 148 -19 177 0 21 14 24 14
  36 0 19 -23 80 -19 122 10 20 14 39 25 41 25 2 0 0 -20 -6 -44 -5 -24 -7 -51
  -4 -60 8 -21 57 -21 95 1 34 19 62 12 62 -17 0 -25 -52 -50 -103 -50 -28 0
  -38 -6 -58 -37 -22 -34 -29 -38 -62 -35 -38 3 -80 -14 -135 -56 -43 -33 -42
  -77 3 -102 23 -13 31 -25 35 -56 5 -37 8 -40 69 -64 35 -14 71 -36 79 -48 12
  -19 24 -22 78 -22 55 0 65 -3 75 -22 7 -13 25 -39 41 -58 32 -39 34 -52 13
  -70 -22 -19 -18 -68 9 -100 17 -20 25 -46 30 -95 10 -95 27 -125 72 -125 40 0
  71 -29 104 -97 23 -48 44 -54 115 -29 30 10 45 11 60 3 11 -6 34 -13 50 -17
  20 -4 31 -13 33 -25 4 -34 -53 -107 -110 -141 -52 -30 -53 -32 -52 -77 0 -57
  14 -74 89 -108 33 -15 87 -48 119 -73 63 -50 87 -59 132 -54 21 2 30 10 34 28
  5 20 13 26 45 30 32 4 41 10 43 28 3 22 5 22 55 -15 66 -47 67 -49 67 -106 0
  -41 3 -49 24 -57 15 -5 29 -22 35 -43 7 -19 20 -42 30 -51 43 -39 205 -62 230
  -32 15 18 52 112 59 150 5 33 -17 56 -55 56 -23 0 -22 1 9 29 18 15 43 31 56
  35 31 10 58 69 66 147 10 91 51 176 110 225 36 30 46 45 44 64 -3 24 -7 25
  -70 28 -66 3 -66 3 -83 40 -9 20 -20 45 -26 55 -7 13 -5 17 7 17 8 0 42 25 75
  57 56 53 59 58 59 104 0 26 -4 51 -10 54 -5 3 -10 22 -10 42 0 26 -5 36 -20
  40 -13 3 -35 36 -62 92 -42 84 -44 86 -78 86 -34 0 -35 -1 -38 -45 -1 -25 -5
  -56 -8 -68 -5 -23 -6 -23 -29 -8 -30 20 -121 21 -155 1 -14 -8 -39 -14 -56
  -15 -22 0 -45 -12 -77 -40 -50 -45 -96 -56 -76 -19 7 14 10 71 8 163 -2 115 0
  151 15 195 11 33 16 66 13 89 -6 36 -51 92 -74 92 -7 0 -17 9 -23 20 -8 15
  -21 20 -49 20 -23 0 -48 -8 -64 -20 -46 -36 -118 -25 -175 28 -28 26 -32 36
  -32 82 0 56 -20 104 -50 120 -15 8 -20 21 -20 56 0 83 -80 150 -111 93 -11
  -21 -11 -21 -30 -2 -13 13 -19 32 -18 59 4 115 0 146 -23 192 -18 38 -29 48
  -52 50 -25 3 -41 -8 -110 -77 -72 -71 -85 -80 -121 -82 -50 -3 -71 7 -55 26 6
  8 10 31 8 52 -3 34 -8 41 -49 63 -25 14 -74 46 -108 73 -35 26 -74 47 -86 47
  -13 0 -54 -23 -91 -51z"/>
            <text transform="scale(1,-1)"  z-index="5" position="relative" id="text"  y="-8000" x="5400"  font-size="500">{this.state.territoire_array[0]}</text>


            <path   onClick={this.handleZoneClick}id="1" className={this.state.map_repartition.filter((item) => item.ter.includes("1")).map(({id}) => ({id}))[0].id }  ref={this.myRef} d="M4160 9025 c-6 -8 -16 -43 -20 -77 -12 -96 -44 -161 -90 -187 -21
  -12 -72 -58 -114 -102 -86 -91 -95 -119 -47 -143 16 -9 45 -34 64 -57 26 -30
  48 -44 84 -53 36 -9 49 -17 51 -33 2 -15 -4 -24 -25 -30 -41 -14 -129 31 -138
  70 -9 38 -22 41 -97 25 -60 -14 -63 -16 -66 -47 -3 -29 0 -33 37 -48 23 -9 41
  -19 41 -22 -1 -11 -35 -46 -62 -64 -37 -23 -38 -70 -3 -93 14 -9 25 -25 25
  -36 0 -38 125 -122 173 -117 39 5 65 -11 96 -57 37 -57 32 -77 -18 -68 -26 4
  -48 18 -77 50 l-40 44 -81 0 c-73 0 -89 -4 -179 -44 -84 -37 -99 -47 -102 -68
  -2 -18 4 -30 21 -41 14 -9 34 -32 46 -51 13 -21 36 -40 57 -48 20 -7 42 -26
  54 -45 13 -22 30 -35 50 -39 16 -4 30 -10 30 -15 0 -5 18 -20 40 -34 49 -31
  106 -33 160 -5 38 19 40 19 40 2 0 -10 5 -23 12 -30 17 -17 80 -15 114 3 16 8
  45 18 64 21 19 4 44 14 55 24 26 23 100 60 120 60 27 0 16 -18 -18 -29 -64
  -21 -127 -68 -127 -95 0 -33 79 -81 120 -72 23 4 35 -1 63 -29 32 -32 40 -35
  95 -35 56 0 61 2 86 35 32 42 66 53 98 31 25 -18 80 -21 108 -6 11 6 22 26 26
  48 10 54 31 85 72 107 32 18 38 26 42 65 5 44 6 45 45 50 49 7 59 13 124 72
  41 37 51 52 51 78 0 38 -25 90 -44 90 -7 0 -24 9 -38 19 -13 11 -36 23 -51 26
  l-26 7 30 25 c22 19 29 33 27 52 -2 21 -12 29 -53 43 -27 9 -63 17 -78 17 -16
  1 -54 8 -84 17 -42 12 -59 23 -72 46 -30 55 -51 77 -102 105 -28 15 -45 29
  -38 31 60 19 64 77 9 139 -57 65 -67 103 -41 154 41 78 24 299 -27 346 -38 35
  -81 31 -122 -12 -40 -41 -91 -47 -131 -17 -13 11 -41 22 -63 25 -21 3 -46 13
  -56 22 -21 19 -84 20 -100 0z"/>
            <text transform="scale(1,-1)"  z-index="5" position="relative" id="text"  y="-8000" x="4100"  font-size="500">{this.state.territoire_array[1]}</text>

            <path onClick={this.handleZoneClick} id="2" className={this.state.map_repartition.filter((item) => item.ter.includes("2")).map(({id}) => ({id}))[0].id }  d="M5070 7788 c-52 -16 -101 -31 -107 -33 -7 -3 -13 -16 -13 -30 0 -20
  -8 -29 -34 -40 -44 -19 -72 -55 -80 -104 -4 -28 -14 -46 -31 -57 -23 -15 -27
  -15 -50 0 -34 23 -117 21 -138 -2 -10 -10 -17 -26 -17 -34 0 -40 -117 -22
  -140 21 -14 26 -71 28 -130 5 -27 -11 -52 -14 -78 -9 -20 4 -82 8 -137 9
  l-100 1 -3 -33 c-3 -28 1 -34 25 -42 23 -8 49 -38 71 -81 5 -11 -66 -18 -123
  -12 -51 5 -59 9 -79 42 -13 20 -35 42 -48 50 -14 7 -41 40 -59 73 -27 48 -44
  66 -84 87 -28 14 -67 39 -87 55 -30 22 -52 29 -103 34 -46 3 -69 1 -81 -9 -9
  -7 -34 -15 -57 -18 -38 -6 -42 -9 -45 -38 -2 -25 2 -34 20 -44 35 -18 92 -81
  107 -117 10 -23 31 -41 80 -68 70 -38 101 -61 101 -76 0 -5 -9 -4 -19 2 -11 5
  -37 10 -59 10 -31 0 -41 4 -45 20 -5 18 -14 20 -84 20 -58 0 -90 -5 -119 -19
  -39 -19 -39 -19 -46 0 -6 17 -16 20 -50 17 -39 -3 -45 -7 -82 -64 -36 -54 -46
  -62 -81 -67 -43 -6 -85 -44 -85 -76 0 -40 -22 -81 -43 -81 -12 -1 -38 -9 -57
  -18 -45 -22 -51 -55 -16 -91 14 -15 31 -42 37 -61 7 -19 20 -43 30 -53 11 -10
  19 -29 19 -43 0 -13 6 -27 14 -30 26 -10 176 13 195 30 10 9 29 16 44 16 39 0
  77 17 77 35 0 21 27 30 45 15 8 -7 44 -15 80 -18 67 -5 76 -11 50 -32 -23 -19
  -18 -48 26 -138 l41 -84 52 6 c28 3 103 9 166 12 158 9 195 37 158 119 -10 23
  -10 28 5 36 9 6 17 18 17 29 0 16 11 20 71 26 65 6 75 10 112 46 40 37 41 38
  61 20 42 -36 138 -76 185 -76 45 -1 46 0 49 31 3 28 -2 35 -37 59 -48 32 -52
  55 -13 91 l27 25 3 -26 c6 -45 54 -69 147 -74 114 -6 118 -3 151 117 5 20 10
  23 42 18 40 -7 65 -26 44 -34 -8 -3 -29 -19 -48 -35 -44 -39 -46 -80 -6 -105
  15 -9 51 -39 80 -66 43 -40 58 -48 85 -45 28 3 32 7 35 36 2 18 -3 46 -12 62
  -16 33 -8 40 16 13 19 -22 66 -165 70 -213 3 -30 7 -35 31 -38 46 -5 59 14 54
  77 -2 31 -14 89 -25 128 -12 40 -22 76 -21 80 1 16 49 -100 65 -157 19 -67 32
  -83 66 -78 21 3 23 8 23 63 0 33 -4 70 -8 83 -11 29 13 30 31 2 7 -11 20 -20
  30 -20 14 0 16 -8 14 -55 -5 -74 11 -142 54 -228 20 -39 40 -85 43 -102 11
  -50 48 -46 95 11 l39 46 -7 102 c-4 55 -13 114 -21 129 -12 25 -12 32 0 50 34
  53 44 131 38 302 -6 153 -8 168 -30 197 -15 21 -23 46 -23 72 0 43 -23 131
  -39 150 -6 8 -3 27 10 55 24 54 24 67 -1 116 -11 22 -20 53 -20 71 0 42 -14
  52 -105 69 -97 19 -92 19 -205 -17z"/>
            <text transform="scale(1,-1)"  z-index="5" position="relative" id="text"  y="-7000" x="4100"  font-size="500">{this.state.territoire_array[2]}</text>


            <path onClick={this.handleZoneClick} id="3" className={this.state.map_repartition.filter((item) => item.ter.includes("3")).map(({id}) => ({id}))[0].id }  d="M5330 7588 c-23 -51 -25 -81 -6 -111 17 -26 46 -134 46 -171 0 -15
  10 -40 22 -56 20 -28 22 -41 22 -198 1 -163 0 -168 -26 -223 -32 -64 -34 -81
  -14 -112 8 -12 19 -58 25 -101 9 -64 9 -83 -3 -100 -18 -28 -90 -100 -160
  -161 -32 -27 -78 -72 -104 -98 -36 -38 -80 -65 -197 -123 -83 -41 -156 -74
  -163 -74 -12 0 -88 -31 -122 -49 -19 -10 -25 -65 -8 -78 17 -14 99 -39 175
  -54 50 -10 63 -17 65 -33 3 -19 11 -21 97 -24 69 -2 103 1 127 13 42 20 39 20
  87 -19 70 -57 189 -81 280 -55 32 9 41 7 67 -11 23 -17 30 -29 30 -55 0 -19 9
  -49 20 -67 15 -25 20 -51 20 -105 l0 -73 48 -24 c26 -13 66 -30 90 -37 44 -13
  88 -48 96 -78 2 -9 7 -37 11 -63 3 -26 10 -50 16 -53 5 -4 9 -23 9 -43 0 -25
  8 -44 25 -62 21 -21 27 -42 33 -98 10 -85 26 -107 88 -117 38 -5 54 -1 115 29
  61 31 82 36 140 36 l67 0 46 54 c36 41 46 61 46 89 0 19 3 43 6 52 8 19 55 45
  82 45 11 0 25 7 32 15 18 22 -23 188 -58 234 -20 28 -25 44 -23 84 1 35 -3 55
  -15 68 -17 19 -16 21 14 52 38 39 41 71 10 130 -19 36 -23 61 -26 187 -2 92
  -8 156 -17 175 -25 57 -47 189 -35 219 5 15 10 76 10 136 l0 109 -56 41 c-80
  60 -95 112 -46 158 63 60 122 143 122 172 0 36 -12 44 -80 50 -47 4 -55 8 -58
  27 -5 31 -92 83 -140 83 -46 0 -107 28 -153 67 -19 17 -43 32 -54 34 -27 6
  -61 61 -69 113 -13 85 -89 146 -181 146 -63 0 -100 15 -165 70 -51 42 -130 80
  -167 80 -19 0 -28 -10 -43 -42z"/>
            <text transform="scale(1,-1)"  z-index="5" position="relative" id="text"  y="-6000" x="5500"  font-size="500">{this.state.territoire_array[3]}</text>


            <path onClick={this.handleZoneClick} id="4" className={this.state.map_repartition.filter((item) => item.ter.includes("4")).map(({id}) => ({id}))[0].id }  d="M4701 5741 c-20 -15 -23 -24 -17 -53 8 -45 0 -51 -89 -73 -38 -10
  -77 -23 -85 -30 -23 -19 -101 -57 -107 -52 -2 3 1 15 7 27 6 11 10 33 8 47 -2
  21 -10 29 -37 35 -18 5 -47 8 -65 6 -27 -3 -31 -7 -34 -35 -2 -17 4 -45 12
  -61 14 -28 14 -30 -10 -41 -14 -6 -36 -11 -48 -11 -41 0 -161 -55 -222 -102
  -55 -42 -179 -108 -204 -108 -6 0 -18 16 -26 35 -8 19 -21 35 -29 35 -8 0 -30
  14 -50 31 -33 29 -39 31 -98 27 -52 -3 -72 -10 -126 -46 -36 -23 -81 -45 -100
  -48 -20 -4 -59 -26 -88 -50 -29 -23 -66 -45 -83 -49 -20 -4 -49 -27 -82 -66
  -39 -44 -64 -63 -99 -74 -57 -19 -71 -35 -67 -72 3 -27 5 -28 78 -35 41 -4
  151 -10 243 -12 150 -5 172 -7 203 -27 35 -21 39 -21 167 -10 128 11 133 12
  187 50 104 73 136 84 215 78 44 -3 86 -13 111 -26 23 -12 76 -28 119 -35 69
  -12 82 -18 105 -46 21 -26 32 -32 53 -28 18 3 32 -1 43 -13 23 -26 71 -23 119
  6 45 28 55 29 106 15 23 -6 40 -19 47 -35 14 -31 47 -33 127 -5 63 22 75 20
  75 -14 0 -28 23 -49 71 -66 49 -18 69 -8 69 31 l0 32 23 -20 c35 -33 76 -49
  172 -68 92 -18 225 -82 241 -115 4 -8 10 -62 13 -120 6 -99 7 -105 28 -108 16
  -2 41 12 78 44 57 50 87 91 98 136 8 31 49 48 113 48 35 0 47 5 59 24 9 14 30
  29 46 35 80 28 102 111 52 206 -15 31 -28 77 -33 119 -6 57 -12 73 -33 90 -18
  15 -26 34 -30 66 -9 84 -35 171 -56 194 -12 13 -41 29 -64 36 -23 7 -63 23
  -89 36 l-48 24 0 81 c0 44 -5 90 -11 101 -10 18 -17 20 -72 13 -34 -3 -70 -11
  -81 -17 -17 -9 -118 -37 -139 -38 -4 0 -17 21 -28 46 -11 25 -26 47 -33 50 -8
  3 -44 0 -82 -6 -38 -6 -89 -14 -114 -17 -27 -3 -55 -14 -70 -28 -19 -18 -125
  -55 -156 -55 -2 0 -3 28 -1 63 l2 62 -80 2 c-65 3 -84 0 -104 -16z"/>
            <text transform="scale(1,-1)"  z-index="5" position="relative" id="text"  y="-5000" x="5000"  font-size="500">{this.state.territoire_array[4]}</text>


            <path onClick={this.handleZoneClick} id="5" className={this.state.map_repartition.filter((item) => item.ter.includes("5")).map(({id}) => ({id}))[0].id }  d="M6756 5316 c-38 -82 -74 -126 -105 -126 -11 0 -32 16 -47 36 -28 36
  -29 36 -88 32 -74 -6 -106 -35 -106 -101 -1 -35 -8 -50 -44 -91 l-44 -49 -74
  -1 c-62 -1 -84 -6 -139 -33 -35 -18 -77 -34 -94 -35 -29 -3 -30 -5 -30 -48 0
  -58 -25 -96 -77 -120 -22 -10 -45 -28 -52 -41 -10 -21 -20 -25 -81 -29 l-70
  -5 -26 -55 c-16 -31 -52 -78 -84 -109 -54 -52 -58 -54 -71 -36 -10 13 -14 49
  -14 113 0 91 -10 132 -31 132 -6 0 -31 14 -56 31 -32 22 -76 38 -152 56 -58
  13 -123 33 -144 44 -63 32 -88 24 -102 -34 -4 -16 -14 -27 -24 -27 -9 0 -34
  -17 -55 -39 -29 -30 -37 -45 -34 -67 2 -23 9 -30 30 -32 27 -3 27 -4 12 -27
  -21 -32 -15 -99 9 -103 22 -4 87 25 87 38 0 6 5 10 11 10 6 0 1 -12 -10 -26
  -18 -23 -21 -41 -21 -121 0 -83 3 -98 25 -134 14 -22 30 -51 35 -64 20 -52
  103 -17 112 45 2 19 10 26 31 28 35 4 34 -5 -8 -68 -38 -57 -45 -103 -18 -118
  13 -8 16 -21 14 -57 -2 -53 18 -85 54 -85 34 0 113 38 125 60 15 28 12 86 -5
  100 -24 20 -14 51 25 73 19 10 49 32 65 48 64 60 97 23 41 -45 -45 -56 -56
  -84 -56 -151 0 -54 0 -54 -45 -81 -58 -33 -75 -59 -75 -109 0 -55 22 -112 59
  -153 l31 -35 112 7 113 7 46 52 47 52 68 -3 c38 -1 101 -7 140 -13 62 -10 76
  -9 108 6 21 10 44 29 53 41 20 31 43 31 43 1 0 -27 17 -47 40 -47 12 0 15 -8
  12 -33 -3 -30 1 -37 39 -65 48 -35 92 -41 138 -18 21 11 35 35 60 98 38 97 50
  112 108 138 48 21 76 60 99 137 16 55 25 66 66 82 23 9 34 5 81 -30 46 -33 63
  -39 104 -39 43 0 53 4 86 38 40 41 46 70 23 112 -11 22 -10 30 10 65 12 22 37
  90 55 150 44 148 84 190 193 204 46 5 50 9 58 38 9 36 41 63 76 63 38 0 62 18
  62 48 0 21 -18 43 -76 96 l-75 69 -80 -6 c-67 -4 -82 -2 -103 14 -19 15 -40
  19 -94 19 l-70 0 5 39 c5 38 4 40 -33 59 -22 11 -44 29 -51 40 -16 28 -44 136
  -52 202 -5 50 -8 55 -33 58 -25 3 -30 -3 -62 -72z"/>
            <text transform="scale(1,-1)"  z-index="5" position="relative" id="text"  y="-4400" x="6000"  font-size="500">{this.state.territoire_array[5]}</text>


            <path onClick={this.handleZoneClick} id="6" className={this.state.map_repartition.filter((item) => item.ter.includes("6")).map(({id}) => ({id}))[0].id }  d="M6964 4190 c-64 -59 -74 -59 -146 1 -51 43 -85 49 -141 25 -28 -11
  -37 -25 -65 -98 -32 -84 -33 -86 -85 -111 -66 -31 -70 -37 -112 -138 -27 -67
  -40 -87 -64 -98 -27 -13 -33 -12 -58 5 -73 48 -95 54 -198 54 -83 0 -105 -4
  -130 -20 -16 -11 -39 -20 -49 -20 -33 0 -119 -74 -144 -123 -19 -38 -22 -59
  -20 -124 l3 -77 53 -27 c67 -33 102 -64 102 -89 0 -10 9 -24 20 -30 11 -6 20
  -15 20 -19 0 -14 -78 -41 -118 -41 -81 0 -81 -41 -2 -130 l60 -67 120 -34 c66
  -18 120 -38 120 -45 0 -6 -9 -19 -20 -29 -24 -21 -26 -71 -5 -99 8 -11 15 -37
  15 -57 0 -21 5 -41 10 -44 25 -15 63 -93 69 -138 6 -48 8 -50 51 -66 42 -16
  48 -22 80 -91 4 -8 18 -17 31 -20 14 -3 45 -27 69 -53 87 -93 204 -161 296
  -172 61 -7 62 -7 85 27 13 18 33 53 45 78 12 25 31 53 42 64 30 26 36 71 19
  136 -14 53 -17 56 -81 94 -37 21 -65 40 -63 43 3 2 44 8 93 13 48 5 110 18
  138 29 28 11 71 25 96 33 37 11 46 18 48 39 3 22 -9 38 -67 90 -65 59 -69 65
  -54 81 14 15 34 18 133 18 109 0 118 2 138 23 20 21 22 34 22 135 0 99 -2 112
  -19 121 -14 8 -21 29 -29 82 -6 40 -15 76 -21 82 -6 6 -38 13 -72 15 l-60 5 6
  39 c5 25 3 44 -5 53 -10 12 -10 18 0 30 8 9 11 32 8 59 -5 43 -5 43 31 52 43
  11 51 41 27 99 -9 21 -16 53 -16 72 0 21 -6 36 -15 39 -8 4 -15 12 -15 19 0
  18 40 107 57 127 8 9 13 29 11 45 -3 26 -6 28 -57 31 l-53 3 6 51 c6 44 4 54
  -15 74 -34 36 -62 30 -125 -26z"/>
            <text transform="scale(1,-1)"  z-index="5" position="relative" id="text"  y="-3000" x="6300"  font-size="500">{this.state.territoire_array[6]}</text>


            <path onClick={this.handleZoneClick} id="7" className={this.state.map_repartition.filter((item) => item.ter.includes("7")).map(({id}) => ({id}))[0].id }  d="M5718 3533 c-30 -29 -40 -35 -50 -25 -7 7 -37 12 -68 12 -52 0 -61
  -4 -118 -47 -33 -27 -72 -56 -86 -66 -15 -10 -35 -36 -46 -57 -20 -39 -39 -49
  -115 -62 -16 -3 -20 -11 -20 -38 l0 -35 80 3 c104 3 135 -8 169 -61 22 -33 26
  -47 19 -67 -6 -19 -15 -24 -32 -22 -12 2 -45 -2 -73 -8 -42 -10 -58 -10 -104
  5 -40 13 -80 16 -161 13 l-108 -3 -64 -44 c-71 -48 -70 -48 -199 -32 -51 6
  -98 9 -103 6 -18 -12 -10 -64 14 -79 12 -8 30 -28 39 -44 15 -25 15 -32 4 -47
  -13 -18 -16 -18 -72 -2 -33 9 -106 19 -164 23 -98 6 -106 5 -123 -14 -10 -11
  -17 -31 -15 -44 3 -21 9 -24 73 -29 139 -11 169 -36 158 -130 -5 -40 -13 -59
  -40 -85 -48 -48 -46 -88 5 -110 71 -30 157 -54 197 -54 40 0 105 31 105 50 0
  5 11 17 25 26 22 14 32 15 90 3 77 -15 126 -4 161 38 21 25 40 29 121 25 28
  -1 51 -10 72 -28 30 -25 34 -25 121 -18 79 6 93 4 110 -11 17 -16 32 -17 112
  -12 51 4 105 10 119 13 20 4 34 -1 60 -24 19 -16 56 -39 83 -52 41 -18 60 -21
  110 -16 127 14 186 12 203 -6 23 -25 78 -22 142 7 l54 25 -7 57 c-8 67 -29 95
  -86 112 -39 11 -40 13 -40 57 0 46 -26 110 -54 133 -10 8 -16 29 -16 53 0 21
  -7 50 -16 64 -16 23 -16 26 5 48 23 25 28 68 9 84 -7 6 -54 22 -105 36 -51 14
  -103 31 -115 37 -27 13 -123 128 -114 137 4 3 33 9 66 13 103 12 140 59 85
  107 -14 12 -25 30 -25 41 0 26 -45 62 -113 92 -48 21 -56 28 -59 54 -3 25 -8
  30 -33 33 -23 2 -38 -5 -67 -35z"/>
            <text transform="scale(1,-1)"  z-index="5" position="relative" id="text"  y="-2600" x="5300"  font-size="500">{this.state.territoire_array[7]}</text>


            <path onClick={this.handleZoneClick} id="8" className={this.state.map_repartition.filter((item) => item.ter.includes("8")).map(({id}) => ({id}))[0].id }  d="M6949 7295 c-19 -19 -101 -34 -150 -28 -46 7 -105 -22 -200 -94 l-56
  -42 5 -123 c4 -106 1 -134 -18 -202 -12 -43 -20 -89 -17 -102 3 -19 0 -24 -18
  -24 -46 0 -72 -65 -40 -100 14 -16 14 -21 -6 -54 -19 -33 -21 -45 -15 -159 8
  -167 16 -229 31 -247 31 -36 35 -57 23 -114 -10 -53 -9 -58 15 -93 14 -21 31
  -58 36 -83 13 -56 14 -187 2 -194 -5 -3 -18 10 -30 29 -27 46 -57 46 -93 1
  -31 -39 -35 -71 -12 -101 10 -14 13 -32 8 -60 -5 -35 -1 -48 29 -92 19 -29 38
  -72 42 -95 9 -51 32 -109 64 -160 21 -35 26 -38 70 -38 68 0 92 30 161 207 18
  43 35 82 40 87 5 4 25 -17 46 -48 22 -34 44 -56 55 -56 10 0 46 21 79 46 55
  42 60 49 60 83 0 22 -6 44 -15 51 -11 9 -12 17 -4 31 8 16 14 17 30 9 11 -6
  32 -10 47 -8 26 3 27 5 25 58 -2 30 -10 69 -19 86 -16 28 -15 33 1 67 22 47
  64 77 115 84 33 5 40 3 40 -11 0 -9 15 -26 34 -37 19 -11 42 -31 50 -45 22
  -32 59 -31 105 5 31 24 48 29 118 34 102 6 137 22 141 62 2 17 12 55 22 85 11
  32 21 96 24 152 l4 97 -31 24 c-20 14 -52 26 -83 30 -54 6 -158 55 -199 93
  -36 33 -42 70 -16 104 24 34 28 82 6 100 -8 7 -15 23 -15 36 0 18 -10 28 -37
  41 -42 20 -36 0 -61 204 -11 89 -13 94 -55 115 -40 21 -47 31 -47 72 0 39 -20
  50 -63 34 -26 -10 -33 -8 -58 13 -16 13 -39 27 -51 30 -13 4 -30 14 -39 22
  -15 12 -14 16 11 43 29 31 54 103 48 141 -2 17 -10 25 -28 27 -14 2 -29 8 -34
  13 -15 14 -60 11 -77 -6z"/>
            <text transform="scale(1,-1)"  z-index="5" position="relative" id="text"  y="-6300" x="6650"  font-size="500">{this.state.territoire_array[8]}</text>


            <path onClick={this.handleZoneClick} id="9" className={this.state.map_repartition.filter((item) => item.ter.includes("9")).map(({id}) => ({id}))[0].id }  d="M8018 5966 c-15 -6 -42 -29 -60 -49 -35 -40 -30 -39 -223 -67 -33 -5
  -87 -15 -120 -24 -34 -9 -76 -13 -97 -10 -32 6 -43 2 -81 -30 l-44 -36 -22 31
  c-13 17 -35 35 -51 40 -15 6 -30 19 -33 30 -4 16 -14 19 -60 19 -46 0 -61 -5
  -88 -27 -53 -45 -77 -135 -45 -172 20 -23 30 -101 13 -101 -7 0 -18 5 -24 11
  -6 6 -23 9 -39 7 -42 -5 -54 -45 -28 -94 l19 -36 -29 -22 c-16 -11 -47 -36
  -68 -55 -33 -29 -38 -31 -38 -14 0 35 -57 103 -85 103 -21 0 -29 -9 -45 -46
  -24 -55 -25 -90 -5 -102 9 -5 22 -37 30 -73 27 -130 46 -172 90 -196 31 -17
  41 -29 45 -55 5 -32 6 -33 65 -38 35 -3 72 -13 88 -24 24 -16 39 -18 105 -12
  86 7 89 6 174 -68 97 -86 104 -89 161 -83 68 8 136 28 167 50 20 14 36 16 86
  11 37 -4 69 -2 81 4 25 14 165 43 172 37 2 -3 -10 -21 -29 -40 -33 -34 -33
  -34 -21 -87 6 -29 12 -78 14 -108 2 -52 3 -55 31 -58 47 -6 144 37 204 90 54
  47 56 48 107 42 68 -8 75 3 75 130 0 87 -2 97 -26 125 l-26 31 44 19 c23 11
  66 23 93 26 72 11 87 21 83 57 -3 27 -12 36 -68 65 -49 26 -67 42 -75 65 -10
  30 -22 41 -57 52 -15 4 -18 17 -18 76 0 58 -5 81 -34 142 -19 40 -38 93 -44
  116 -9 42 -9 44 22 63 17 10 48 19 68 19 27 0 40 6 48 19 11 22 13 120 2 137
  -4 7 -38 33 -76 59 -54 37 -82 49 -130 56 -83 12 -165 10 -198 -5z"/>
            <text transform="scale(1,-1)"  z-index="5" position="relative" id="text"  y="-5200" x="7500"  font-size="500">{this.state.territoire_array[9]}</text>


            <path onClick={this.handleZoneClick} id="10" className={this.state.map_repartition.filter((item) => item.ter.includes("10")).map(({id}) => ({id}))[0].id }  d="M7895 4929 c-84 -23 -77 -23 -145 -14 -51 7 -59 5 -87 -19 -18 -15
  -43 -26 -61 -26 -16 0 -46 -7 -65 -15 -20 -8 -50 -15 -66 -15 -16 0 -48 -9
  -72 -20 -24 -11 -53 -20 -65 -20 -24 0 -54 -29 -54 -52 0 -25 -35 -48 -74 -48
  -20 0 -49 -6 -64 -14 -34 -18 -78 -65 -85 -91 -33 -120 -63 -208 -84 -244 -26
  -45 -27 -74 -4 -133 7 -20 18 -28 35 -28 35 0 51 -26 51 -84 l0 -51 59 -3 c49
  -3 62 0 82 19 27 25 28 24 14 -17 -7 -19 -22 -34 -40 -41 -52 -19 -96 -164
  -55 -179 10 -4 15 -20 15 -51 0 -24 9 -62 19 -83 l19 -40 -23 0 c-72 0 -98
  -45 -51 -89 33 -31 136 -62 226 -67 60 -4 90 -1 150 18 74 24 75 24 75 58 0
  31 -7 39 -75 87 -41 29 -75 60 -75 69 0 10 14 21 34 28 39 12 75 73 87 143 l6
  40 -56 28 c-50 25 -56 32 -56 59 0 30 1 31 48 33 26 0 63 4 83 8 26 5 38 3 48
  -9 8 -9 26 -16 42 -16 24 0 31 7 44 36 8 20 15 50 15 67 0 17 8 39 17 49 13
  14 17 38 18 89 0 43 4 69 11 69 6 0 31 17 55 39 24 21 59 46 77 55 18 9 32 24
  32 34 0 39 24 72 53 72 44 0 59 49 55 179 -3 99 -2 107 20 130 14 16 22 35 20
  50 -3 23 -8 26 -43 28 -22 1 -71 -7 -110 -18z"/>
            <text transform="scale(1,-1)"  z-index="5" position="relative" id="text"  y="-4200" x="7100"  font-size="500">{this.state.territoire_array[10]}</text>


            <path onClick={this.handleZoneClick} id="11" className={this.state.map_repartition.filter((item) => item.ter.includes("11")).map(({id}) => ({id}))[0].id }  d="M7996 3826 c-27 -19 -69 -43 -95 -52 -25 -10 -50 -21 -54 -24 -5 -4
  -12 -39 -17 -76 -7 -54 -13 -72 -31 -84 -12 -8 -42 -35 -67 -59 -44 -42 -110
  -80 -142 -81 -8 0 -26 -9 -40 -20 -25 -19 -25 -19 -47 2 l-23 21 21 33 c24 39
  22 92 -3 108 -13 8 -39 3 -105 -18 l-89 -29 -73 17 c-41 9 -86 23 -102 31 -45
  24 -78 19 -90 -12 -6 -16 -8 -41 -4 -58 3 -16 9 -48 13 -70 7 -39 8 -40 58
  -48 65 -10 83 -30 93 -100 4 -31 16 -66 29 -82 18 -22 22 -41 22 -97 0 -129
  -31 -154 -179 -145 -87 5 -101 4 -115 -12 -28 -30 -20 -66 21 -97 38 -29 92
  -84 93 -95 0 -14 -229 -82 -295 -88 -66 -6 -70 -7 -73 -32 -3 -22 5 -32 43
  -57 26 -17 59 -34 75 -37 25 -6 29 -11 33 -53 4 -51 -2 -68 -51 -133 -25 -33
  -32 -51 -30 -79 3 -30 7 -35 31 -38 26 -3 26 -4 12 -25 -8 -12 -15 -38 -15
  -59 0 -41 -5 -35 190 -223 63 -60 127 -127 142 -149 34 -50 131 -160 226 -255
  l73 -74 59 6 c35 3 62 1 69 -6 5 -5 35 -14 65 -18 29 -4 84 -21 120 -39 37
  -17 77 -30 89 -28 19 3 22 10 25 52 3 40 -3 62 -30 115 -39 78 -145 191 -178
  191 -22 0 -23 1 -5 20 22 25 16 68 -20 148 -24 52 -25 58 -9 69 9 7 28 10 43
  7 15 -3 42 3 66 16 21 11 53 20 70 20 34 0 51 15 99 87 16 23 50 56 77 74 38
  24 106 93 135 138 2 2 16 -6 32 -18 37 -26 57 -26 89 -1 14 11 34 20 45 20 11
  0 28 5 39 10 11 6 68 13 127 15 105 4 212 24 263 51 15 7 59 43 98 78 l70 65
  33 -30 c36 -33 108 -69 139 -69 11 0 37 11 58 24 40 26 49 49 54 136 2 32 0
  35 -28 36 -70 2 -89 21 -115 116 -7 26 -19 53 -27 60 -8 6 -44 13 -81 15 -80
  3 -86 9 -102 105 -11 61 -16 72 -41 87 -16 9 -29 18 -29 21 1 3 19 18 41 33
  33 22 40 33 37 55 -3 29 -17 34 -144 48 -59 7 -71 22 -81 92 -3 26 -13 56 -23
  67 -33 37 -39 58 -30 105 14 69 12 90 -7 96 -10 3 -41 16 -69 30 -28 13 -66
  24 -85 24 l-34 0 4 46 c2 25 -1 50 -6 55 -5 5 -53 12 -106 16 -82 5 -100 3
  -115 -10 -17 -15 -18 -15 -14 16 3 23 12 37 33 49 20 12 29 25 29 42 0 31 -4
  33 -66 41 -45 6 -53 3 -98 -29z"/>
            <text transform="scale(1,-1)"  z-index="5" position="relative" id="text"  y="-2500" x="7500"  font-size="500">{this.state.territoire_array[11]}</text>


            <path onClick={this.handleZoneClick} id="12" className={this.state.map_repartition.filter((item) => item.ter.includes("12")).map(({id}) => ({id}))[0].id }  d="M7460 8556 c-13 -36 -35 -44 -135 -47 -69 -3 -101 1 -136 15 -25 10
  -59 16 -75 14 -26 -3 -29 -7 -29 -38 0 -31 5 -37 41 -55 l41 -20 -23 -37 c-13
  -20 -28 -39 -34 -43 -5 -3 -10 -27 -10 -52 0 -35 8 -58 32 -96 23 -36 33 -64
  36 -106 3 -42 9 -60 25 -73 20 -16 21 -19 8 -65 -8 -26 -17 -69 -21 -96 -3
  -26 -12 -53 -18 -59 -26 -26 -12 -62 43 -118 32 -31 57 -67 61 -85 4 -16 15
  -46 25 -66 16 -32 18 -53 13 -155 -4 -81 -13 -137 -26 -176 -21 -59 -61 -108
  -73 -89 -10 17 -50 13 -68 -7 -19 -20 -23 -77 -7 -87 6 -3 10 -21 10 -40 0
  -49 8 -63 47 -82 48 -23 65 -71 90 -256 4 -32 11 -41 44 -58 27 -13 39 -26 39
  -41 0 -12 7 -29 16 -39 15 -17 15 -21 -5 -52 -24 -38 -27 -90 -8 -126 15 -31
  143 -102 177 -99 21 3 25 9 28 39 3 37 23 63 65 83 28 14 35 61 12 86 -8 9
  -20 31 -24 48 -8 28 -6 33 27 55 25 17 58 28 102 32 36 4 75 11 88 16 16 6 30
  4 47 -7 38 -25 69 -15 73 22 4 40 27 61 78 72 36 7 40 11 58 63 25 73 19 89
  -37 89 -30 0 -53 7 -77 25 -28 20 -45 25 -97 25 l-64 0 35 36 c46 48 78 115
  75 157 -3 36 23 86 65 126 14 14 26 30 26 37 0 6 12 19 26 28 20 14 25 24 22
  49 -3 28 -10 35 -61 60 -55 26 -67 46 -29 47 9 1 51 18 92 38 l75 37 0 42 c0
  29 6 46 18 55 15 11 17 26 15 93 l-3 80 -48 25 c-42 22 -49 31 -65 80 l-17 55
  -141 5 c-160 6 -178 13 -216 82 -21 38 -28 43 -58 43 -31 0 -35 -3 -40 -30 -3
  -16 -8 -30 -12 -30 -33 0 -128 124 -128 169 0 10 10 36 22 57 16 29 28 39 46
  39 13 0 36 6 50 14 15 8 35 17 45 20 14 4 17 17 17 68 0 83 -15 134 -46 155
  -14 9 -32 29 -40 44 -20 39 -70 41 -84 5z"/>
            <text transform="scale(1,-1)"  z-index="5" position="relative" id="text"  y="-7500" x="7350"  font-size="500">{this.state.territoire_array[12]}</text>


            <path onClick={this.handleZoneClick} id="13" className={this.state.map_repartition.filter((item) => item.ter.includes("13")).map(({id}) => ({id}))[0].id }  d="M8270 6954 c-8 -4 -23 -14 -33 -22 -15 -13 -22 -14 -37 -4 -56 34
  -120 -5 -120 -73 0 -21 -10 -64 -21 -96 -19 -51 -25 -59 -48 -59 -14 0 -41 -9
  -58 -20 -25 -15 -33 -27 -33 -49 0 -36 -13 -46 -39 -29 -16 10 -29 10 -63 0
  -24 -7 -74 -18 -113 -24 -38 -6 -83 -20 -99 -31 -26 -18 -28 -24 -22 -65 3
  -25 15 -55 26 -67 23 -25 26 -45 6 -45 -8 0 -28 -12 -45 -26 -41 -34 -44 -89
  -6 -104 14 -5 44 -29 67 -52 40 -42 41 -44 40 -111 0 -41 -10 -95 -22 -132
  -12 -35 -20 -79 -18 -97 l3 -33 55 1 c30 0 84 4 119 9 55 7 68 13 100 45 58
  60 91 73 169 64 84 -8 100 -15 183 -70 71 -47 89 -78 73 -126 -9 -30 -22 -38
  -65 -38 -73 0 -112 -63 -73 -118 22 -31 107 -30 202 3 39 14 81 25 92 25 22 0
  61 -21 96 -53 14 -11 33 -17 50 -15 24 2 30 8 32 33 2 17 11 38 19 47 10 11
  13 27 10 45 -16 82 -24 99 -54 118 -31 20 -39 39 -50 121 -5 43 17 104 39 104
  9 0 102 -53 117 -66 2 -2 7 -21 10 -41 5 -32 11 -39 32 -41 22 -3 31 5 54 44
  15 26 30 70 34 98 6 48 8 51 41 57 19 4 53 5 75 2 22 -3 59 0 82 6 55 15 123
  60 123 82 0 9 7 22 16 29 8 8 14 25 12 39 -3 22 -10 27 -57 36 l-53 10 21 19
  c15 14 21 29 19 50 -3 28 -7 31 -38 33 -19 2 -72 6 -118 9 l-82 6 53 51 c35
  35 74 60 117 78 57 22 65 29 71 57 3 17 20 44 37 60 31 29 48 71 39 95 -8 22
  -162 30 -212 12 -22 -8 -51 -14 -65 -15 -27 0 -135 -48 -179 -79 -46 -33 -98
  -42 -145 -26 -22 8 -66 15 -96 15 -78 0 -97 8 -109 42 -9 26 -7 32 15 51 14
  12 48 44 75 72 61 61 64 88 14 128 -32 25 -43 28 -142 32 -60 3 -115 2 -123
  -1z"/>
            <text transform="scale(1,-1)"  z-index="5" position="relative" id="text"  y="-6000" x="8000"  font-size="500">{this.state.territoire_array[13]}</text>


            <path onClick={this.handleZoneClick}  id="14" className={this.state.map_repartition.filter((item) => item.ter.includes("14")).map(({id}) => ({id}))[0].id }  d="M9139 6214 c-7 -9 -34 -30 -58 -46 -40 -25 -54 -28 -125 -28 -93 0
  -130 -14 -134 -50 -1 -14 -5 -39 -7 -56 l-5 -32 -67 44 c-58 38 -74 44 -119
  44 -47 0 -55 -3 -73 -29 -18 -24 -21 -44 -21 -118 0 -105 16 -157 59 -190 31
  -24 37 -46 25 -90 l-6 -22 -31 20 c-47 28 -148 26 -233 -6 -40 -15 -87 -25
  -118 -25 -29 0 -57 -5 -64 -12 -24 -24 -14 -95 25 -169 27 -52 38 -86 42 -137
  6 -61 8 -68 34 -80 16 -8 35 -29 43 -48 10 -23 28 -41 61 -57 l46 -24 -59 -11
  c-32 -7 -74 -21 -91 -32 -29 -17 -33 -25 -33 -61 0 -29 7 -50 25 -71 23 -27
  25 -38 25 -122 0 -58 4 -96 12 -104 17 -17 103 -15 117 2 6 8 26 20 44 27 53
  21 67 38 67 83 l0 41 83 42 c83 43 109 67 200 188 20 27 37 52 37 55 0 3 22
  17 48 32 65 37 80 56 84 107 3 38 9 49 48 82 46 39 63 45 204 70 49 8 66 17
  97 49 20 21 48 41 61 45 12 4 35 19 51 33 21 20 27 35 27 67 0 22 -7 51 -16
  63 -29 42 -16 65 51 80 86 20 90 23 93 74 3 42 0 48 -57 111 -60 66 -91 114
  -91 139 0 7 -24 40 -54 73 l-53 60 -90 3 c-76 3 -91 1 -104 -14z"/>
            <text transform="scale(1,-1)"  z-index="5" position="relative" id="text"  y="-5400" x="8550"  font-size="500">{this.state.territoire_array[14]}</text>


            <path onClick={this.handleZoneClick} id="15" className={this.state.map_repartition.filter((item) => item.ter.includes("15")).map(({id}) => ({id}))[0].id }  d="M9070 5483 c-37 -5 -117 -58 -150 -100 -13 -16 -20 -41 -20 -67 0
  -40 -3 -43 -51 -71 -29 -17 -59 -41 -68 -55 -9 -14 -41 -58 -71 -98 -49 -64
  -65 -77 -155 -124 l-100 -53 -3 -64 c-2 -46 1 -68 12 -80 10 -11 12 -21 6 -31
  -5 -8 -10 -36 -10 -62 0 -37 5 -51 20 -60 11 -7 20 -18 20 -24 0 -6 9 -19 20
  -29 11 -10 20 -24 20 -30 0 -7 20 -29 44 -49 33 -26 54 -36 80 -36 31 0 36 -3
  36 -23 0 -27 17 -47 40 -47 8 0 20 -10 25 -22 7 -16 20 -24 44 -26 22 -2 41
  -12 53 -28 11 -13 28 -24 38 -24 11 0 31 -12 45 -26 l26 -26 127 7 c70 4 133
  12 140 18 9 7 13 30 10 72 -2 50 1 66 20 92 12 17 22 39 22 50 0 32 14 41 90
  59 41 9 81 21 88 26 7 6 12 33 12 63 0 56 4 62 84 118 16 11 26 28 26 42 0 18
  8 26 38 35 57 19 72 37 72 86 0 30 -5 47 -19 56 -10 7 -27 31 -39 54 -11 22
  -41 63 -67 92 -43 48 -50 52 -91 52 -42 0 -44 2 -44 28 0 38 -17 52 -61 52
  -34 0 -38 3 -44 33 -10 44 -43 107 -60 114 -9 3 -15 18 -15 37 0 17 -7 42 -16
  54 -13 19 -23 22 -77 20 -34 0 -78 -3 -97 -5z"/>
            <text transform="scale(1,-1)"  z-index="5" position="relative" id="text"  y="-4800" x="8700"  font-size="500">{this.state.territoire_array[15]}</text>


            <path onClick={this.handleZoneClick} id="16" className={this.state.map_repartition.filter((item) => item.ter.includes("16")).map(({id}) => ({id}))[0].id }  d="M8435 4871 c-22 -10 -48 -27 -58 -38 -15 -17 -27 -19 -97 -15 l-79 5
  -48 -43 c-54 -48 -158 -100 -201 -100 -28 0 -62 -26 -62 -48 0 -6 -20 -28 -45
  -49 -25 -20 -45 -45 -45 -55 0 -10 -6 -18 -14 -18 -7 0 -33 -17 -57 -38 -24
  -21 -59 -49 -78 -62 -33 -23 -33 -24 -28 -81 4 -48 2 -63 -14 -83 -10 -13 -19
  -33 -19 -44 0 -11 -3 -33 -6 -50 -5 -27 -9 -30 -29 -22 -38 15 -232 11 -245
  -5 -6 -8 -10 -44 -8 -91 l3 -78 52 -26 52 -26 -19 -41 c-14 -32 -26 -43 -57
  -53 -55 -18 -63 -28 -63 -74 0 -49 16 -67 118 -135 65 -44 72 -58 47 -101 -22
  -38 -19 -112 6 -144 17 -21 29 -26 67 -26 26 0 65 9 87 19 22 11 56 26 75 33
  19 7 58 33 86 58 29 25 64 53 77 63 19 12 27 29 32 65 13 92 21 106 70 121 25
  7 56 22 70 33 l25 19 0 -54 c0 -70 12 -81 82 -73 94 12 117 10 138 -9 11 -10
  20 -28 20 -40 0 -27 18 -45 44 -45 12 0 45 -11 74 -25 101 -47 203 -28 257 47
  65 89 68 101 60 217 -4 73 -11 111 -22 123 -14 16 -13 18 13 30 49 20 74 49
  74 83 0 47 23 71 81 85 40 10 71 29 145 92 l94 79 0 47 c0 58 -12 72 -62 72
  -24 0 -38 5 -38 13 0 6 -17 29 -39 50 -27 26 -47 37 -69 37 -17 0 -32 6 -36
  15 -3 8 -17 20 -31 25 -17 6 -25 17 -25 33 0 30 -18 47 -49 47 -30 0 -101 47
  -101 67 0 8 -14 32 -32 54 -28 35 -31 45 -29 95 1 32 -3 61 -9 70 -17 20 -87
  17 -135 -5z"/>
            <text transform="scale(1,-1)"  z-index="5" position="relative" id="text"  y="-4100" x="7800"  font-size="500">{this.state.territoire_array[16]}</text>


            <path onClick={this.handleZoneClick} id="17" className={this.state.map_repartition.filter((item) => item.ter.includes("17")).map(({id}) => ({id}))[0].id }  d="M9048 4350 c-10 -6 -25 -25 -33 -43 -26 -51 -140 -139 -213 -163 -80
  -27 -95 -42 -102 -101 -4 -42 -9 -50 -37 -64 -58 -29 -63 -37 -63 -101 0 -45
  5 -66 20 -85 43 -55 8 -156 -86 -247 l-47 -44 -5 -101 c-5 -99 -4 -100 27
  -147 21 -32 31 -60 31 -85 0 -30 6 -42 29 -58 16 -12 37 -21 48 -22 33 -1 88
  -25 75 -33 -7 -4 -12 -28 -12 -54 0 -40 4 -51 30 -72 24 -20 31 -37 39 -89 14
  -87 26 -98 117 -106 l75 -7 57 54 c68 66 109 88 156 88 30 0 39 6 60 38 42 66
  79 146 85 181 6 31 12 37 76 63 76 32 156 68 223 101 52 25 178 161 184 197 2
  18 13 28 43 38 68 24 139 55 158 71 9 8 17 24 17 37 0 13 5 26 10 29 6 3 10
  26 10 50 0 24 -4 47 -10 50 -5 3 -10 19 -10 34 0 36 -24 57 -91 81 -30 11 -55
  20 -56 20 -2 0 -3 6 -3 13 0 21 -43 56 -78 63 -17 4 -38 17 -47 30 -11 17 -25
  24 -45 24 l-30 0 20 40 c11 22 20 59 20 84 0 51 -23 76 -88 97 -20 6 -41 15
  -46 20 -15 14 -84 11 -148 -7 -73 -21 -88 -12 -88 56 0 30 -6 52 -15 60 -20
  17 -233 25 -257 10z"/>
            <text transform="scale(1,-1)"  z-index="5" position="relative" id="text"  y="-3600" x="8800"  font-size="500">{this.state.territoire_array[17]}</text>


            <path onClick={this.handleZoneClick} id="18" className={this.state.map_repartition.filter((item) => item.ter.includes("18")).map(({id}) => ({id}))[0].id }  d="M9688 3449 c-98 -123 -133 -146 -348 -231 -89 -35 -100 -43 -100 -73
  0 -12 -18 -57 -40 -100 -22 -43 -40 -86 -40 -96 0 -16 -8 -19 -53 -19 -49 0
  -57 -3 -120 -56 -66 -56 -67 -58 -67 -105 0 -36 5 -51 20 -62 10 -7 29 -40 41
  -73 30 -80 53 -104 101 -104 33 0 38 -3 38 -23 0 -13 -11 -34 -25 -47 -19 -18
  -25 -34 -25 -65 0 -56 22 -75 88 -75 l51 0 7 -37 c8 -45 57 -157 73 -167 6 -4
  11 -29 11 -55 0 -58 12 -71 66 -71 39 0 42 -2 48 -32 4 -23 33 -62 92 -126
  l87 -93 46 3 c41 3 48 7 62 36 9 18 32 43 50 55 33 22 34 25 34 90 0 58 3 67
  20 71 38 11 67 6 108 -18 33 -19 68 -27 164 -37 131 -13 149 -10 155 33 2 16
  24 30 89 57 114 47 129 62 129 121 0 25 -5 51 -12 58 -7 7 -38 12 -71 12 l-59
  0 29 34 c51 61 84 73 227 81 119 6 134 9 185 38 85 46 91 54 91 109 0 35 4 48
  14 48 34 0 46 41 46 151 0 83 3 109 15 119 20 17 19 88 -2 112 -10 11 -16 37
  -17 70 -1 49 -3 54 -41 80 -31 21 -52 27 -93 28 -48 0 -54 -3 -70 -30 -13 -23
  -24 -30 -48 -30 -37 0 -64 -27 -64 -63 0 -14 -4 -28 -9 -32 -17 -10 -100 126
  -115 190 -11 45 -24 55 -71 55 -49 0 -52 -3 -89 -90 -65 -149 -68 -153 -129
  -143 -35 5 -36 7 -22 26 11 16 15 50 15 122 l0 100 -37 36 c-21 20 -50 55 -65
  77 l-28 42 -74 0 c-59 0 -78 -4 -100 -21 l-26 -20 0 78 c0 48 -5 84 -12 91 -7
  7 -31 12 -54 12 -38 0 -47 -5 -76 -41z"/>
            <text transform="scale(1,-1)"  z-index="5" position="relative" id="text"  y="-2500" x="9500"  font-size="500">{this.state.territoire_array[18]}</text>


            <path onClick={this.handleZoneClick} id="19" className={this.state.map_repartition.filter((item) => item.ter.includes("19")).map(({id}) => ({id}))[0].id }  d="M8745 2549 c-64 -65 -118 -97 -208 -120 -53 -14 -89 -18 -134 -13
  -47 5 -77 1 -125 -14 -85 -27 -126 -33 -133 -22 -3 6 -28 10 -55 10 -45 0 -51
  -3 -82 -42 -18 -23 -48 -55 -67 -72 -58 -53 -135 -132 -157 -162 -21 -28 -76
  -47 -179 -61 -22 -3 -48 -12 -57 -21 -27 -23 -22 -84 12 -162 17 -38 30 -85
  30 -106 0 -32 8 -45 68 -103 89 -86 142 -185 142 -263 0 -48 4 -58 33 -84 17
  -17 48 -50 69 -75 31 -39 45 -48 100 -61 34 -9 108 -22 163 -28 127 -16 270
  -61 388 -123 79 -40 174 -48 272 -22 80 22 247 16 340 -12 46 -14 94 -18 207
  -18 147 0 148 0 175 27 32 33 45 100 47 248 1 77 -3 107 -22 158 -23 63 -23
  64 -5 100 14 29 18 60 18 144 0 100 2 109 23 123 17 13 22 26 22 58 -1 39 -7
  49 -90 134 -60 63 -91 103 -95 125 -11 48 -23 58 -71 58 l-44 0 0 49 c0 33 -5
  53 -17 62 -19 17 -57 99 -68 149 -10 49 -22 60 -62 60 -70 0 -222 60 -262 104
  -20 21 -33 26 -76 26 -48 0 -54 -3 -100 -51z"/>
            <text transform="scale(1,-1)"  z-index="5" position="relative" id="text"  y="-1600" x="8500"  font-size="500">{this.state.territoire_array[19]}</text>


            <path onClick={this.handleZoneClick} id="20" className={this.state.map_repartition.filter((item) => item.ter.includes("20")).map(({id}) => ({id}))[0].id }  d="M8848 8793 c-9 -10 -26 -38 -38 -63 -34 -68 -89 -139 -121 -155 -15
  -8 -43 -15 -62 -15 -20 0 -46 -9 -61 -21 -24 -19 -26 -26 -26 -96 0 -59 4 -81
  18 -96 17 -19 16 -20 -53 -13 -38 3 -95 9 -125 12 -44 5 -59 3 -69 -10 -8 -10
  -29 -16 -55 -16 -26 0 -63 -10 -97 -27 -52 -27 -54 -30 -57 -72 -3 -46 17 -81
  47 -81 10 0 2 -13 -23 -39 -33 -34 -37 -43 -34 -82 3 -38 8 -47 41 -69 l38
  -24 -7 -87 -6 -88 35 -43 c35 -42 35 -44 16 -56 -22 -14 -27 -90 -7 -110 19
  -19 0 -27 -20 -9 -12 11 -36 17 -70 17 -41 0 -54 -4 -66 -22 -9 -13 -53 -41
  -99 -63 l-82 -40 -3 -44 c-4 -50 13 -74 63 -92 31 -12 32 -13 18 -40 -8 -16
  -18 -29 -23 -29 -5 0 -24 -22 -44 -49 -29 -39 -36 -58 -36 -95 0 -53 -9 -74
  -56 -133 -26 -31 -34 -51 -34 -80 0 -50 14 -63 70 -63 25 -1 56 -7 70 -15 36
  -21 93 -19 114 4 10 10 32 22 49 25 18 3 43 14 57 23 16 11 40 16 78 14 36 -2
  59 2 70 12 42 38 169 34 208 -5 13 -13 11 -18 -14 -44 -17 -16 -44 -39 -61
  -52 -29 -22 -31 -27 -31 -91 0 -86 14 -101 92 -101 31 0 75 -7 98 -15 23 -8
  74 -15 113 -15 65 0 78 4 181 55 121 60 170 74 291 82 93 6 100 10 201 139 55
  70 64 88 64 123 0 37 3 41 24 41 34 0 48 22 44 72 -3 40 -6 44 -63 79 -46 27
  -61 42 -63 63 -2 18 2 28 15 33 40 14 53 35 53 84 0 47 -2 51 -85 135 -47 48
  -84 92 -82 98 2 5 52 34 111 64 63 32 129 74 161 104 52 47 55 53 55 97 0 51
  -13 71 -45 71 -25 0 -135 56 -152 78 -7 9 -13 30 -13 48 0 43 -20 57 -79 52
  l-49 -3 36 40 c19 22 41 44 49 48 23 14 63 112 63 154 0 55 -16 66 -90 61
  l-60 -3 0 41 c0 46 -12 61 -54 66 l-29 3 -1 92 c-1 83 -3 94 -26 118 -14 15
  -47 38 -75 52 -27 14 -60 38 -73 54 -19 24 -31 29 -66 29 -28 0 -48 -6 -58
  -17z"/>
            <text transform="scale(1,-1)"  z-index="5" position="relative" id="text"  y="-7500" x="8500"  font-size="500">{this.state.territoire_array[20]}</text>

            <path onClick={this.handleZoneClick} id="21" className={this.state.map_repartition.filter((item) => item.ter.includes("21")).map(({id}) => ({id}))[0].id }  d="M9523 8593 c-11 -17 -18 -46 -18 -82 0 -47 3 -57 21 -65 20 -9 21
  -15 16 -97 l-5 -88 36 -21 c40 -24 75 -98 84 -180 3 -25 9 -50 14 -56 5 -6 -4
  -29 -21 -55 -37 -54 -42 -125 -11 -153 16 -14 18 -22 9 -40 -9 -21 -13 -22
  -51 -13 -23 5 -68 11 -99 14 -50 4 -61 1 -90 -20 -18 -14 -62 -39 -98 -55 -36
  -17 -87 -45 -115 -64 -46 -31 -50 -36 -53 -78 -2 -44 -1 -46 93 -143 93 -95
  95 -97 71 -107 -14 -5 -30 -18 -35 -29 -15 -28 -14 -84 3 -118 8 -15 17 -35
  20 -44 7 -26 111 -79 154 -79 61 0 85 32 80 109 -2 49 0 61 12 61 8 0 34 9 58
  20 l42 19 0 -26 c0 -29 60 -90 97 -99 13 -4 23 -12 23 -18 0 -7 11 -23 25 -36
  20 -19 25 -33 25 -70 0 -36 5 -52 23 -68 31 -30 106 -31 132 -2 10 11 34 23
  54 26 47 9 71 30 71 66 0 33 0 33 47 13 68 -29 134 -14 196 43 21 20 27 35 27
  66 0 33 4 43 23 51 18 8 23 19 25 63 3 49 1 53 -27 70 -17 9 -31 19 -31 22 0
  17 45 73 72 90 40 25 65 22 161 -24 91 -43 211 -58 252 -32 20 14 25 25 25 61
  0 42 -3 47 -42 71 -23 15 -69 55 -103 88 -33 34 -71 69 -84 77 l-24 15 40 55
  c60 81 63 91 63 182 0 84 0 84 -50 161 -49 76 -50 76 -94 76 -26 0 -48 -6 -56
  -15 -19 -23 -27 -18 -34 19 -4 18 -35 89 -69 157 -61 120 -64 124 -97 127 -19
  2 -52 -1 -73 -8 -35 -10 -40 -9 -58 13 -10 14 -43 38 -72 55 -29 16 -59 37
  -66 46 -20 24 -106 22 -124 -4 -12 -18 -17 -18 -63 -6 -28 7 -59 18 -71 24
  -51 27 -164 62 -201 62 -34 0 -45 -5 -59 -27z"/>
            <text transform="scale(1,-1)"  z-index="5" position="relative" id="text"  y="-7500" x="9700"  font-size="500">{this.state.territoire_array[21]}</text>


            <path onClick={this.handleZoneClick} id="22" className={this.state.map_repartition.filter((item) => item.ter.includes("22")).map(({id}) => ({id}))[0].id }  d="M10360 7504 c-44 -30 -80 -68 -95 -98 -20 -40 -20 -140 0 -156 11 -9
  13 -16 5 -24 -5 -5 -10 -28 -10 -50 0 -48 -6 -57 -41 -73 -22 -10 -33 -8 -63
  8 -52 28 -130 26 -150 -3 -9 -12 -16 -34 -16 -48 0 -22 -8 -30 -50 -47 l-50
  -21 0 43 c0 35 -7 51 -42 94 -23 28 -48 51 -55 51 -29 0 -73 44 -79 79 -4 20
  -11 42 -17 49 -13 17 -107 15 -131 -3 -10 -8 -42 -22 -70 -31 -75 -25 -79 -29
  -74 -98 3 -33 -1 -75 -8 -95 -10 -30 -17 -37 -45 -39 -51 -5 -61 -19 -57 -77
  3 -56 -9 -79 -94 -172 -24 -27 -38 -53 -38 -70 -1 -42 -22 -82 -50 -96 -17 -9
  -26 -22 -28 -43 -3 -28 -10 -34 -78 -64 -97 -42 -154 -104 -154 -166 0 -25 6
  -47 15 -54 8 -7 53 -15 100 -18 l85 -5 0 -43 c0 -47 17 -65 72 -78 17 -4 28
  -14 30 -27 3 -24 18 -35 61 -44 42 -9 106 -73 133 -132 13 -30 51 -85 86 -123
  61 -67 65 -70 109 -70 63 0 73 14 66 91 -4 43 -14 75 -34 108 l-30 47 64 -4
  c41 -3 68 0 78 8 13 10 15 9 15 -12 0 -34 18 -48 63 -48 27 0 48 8 69 25 63
  53 108 39 156 -50 23 -42 33 -51 62 -56 41 -6 91 -31 109 -53 10 -12 33 -16
  96 -16 78 0 86 -2 131 -33 l49 -34 3 -64 c2 -35 7 -69 13 -75 5 -6 39 -14 74
  -16 53 -3 68 -8 81 -26 12 -17 25 -22 62 -22 37 0 73 13 170 60 117 57 126 60
  198 60 75 0 77 1 167 56 51 31 113 72 140 91 43 32 47 38 47 78 0 68 -2 69
  -238 62 -114 -4 -227 -10 -252 -13 -37 -5 -43 -4 -32 7 6 7 12 32 12 55 l0 41
  79 42 c44 22 91 41 104 41 13 0 32 9 42 20 15 17 17 31 11 107 -5 62 -13 95
  -27 115 -11 15 -25 28 -30 28 -5 0 -9 20 -9 45 0 38 -4 48 -30 67 -26 19 -30
  28 -30 68 0 25 -5 51 -12 58 -7 7 -44 12 -94 12 l-83 0 -5 93 c-9 165 -17 211
  -38 234 l-20 21 49 22 c26 11 63 35 81 52 28 28 32 38 32 84 0 47 -3 55 -35
  83 -34 30 -35 32 -35 109 0 52 -4 83 -12 90 -7 5 -42 12 -78 14 -49 3 -85 14
  -145 43 -66 32 -93 39 -155 43 -59 2 -80 0 -100 -14z"/>
            <text transform="scale(1,-1)"  z-index="5" position="relative" id="text"  y="-6500" x="9700"  font-size="500">{this.state.territoire_array[22]}</text>


            <path onClick={this.handleZoneClick} id="23" className={this.state.map_repartition.filter((item) => item.ter.includes("23")).map(({id}) => ({id}))[0].id }  d="M9678 6143 c-27 -27 -28 -27 -63 -10 -45 22 -138 23 -155 2 -24 -29
  -7 -118 34 -185 44 -70 51 -113 21 -117 -39 -6 -140 -37 -152 -46 -16 -12 -18
  -173 -3 -182 17 -11 11 -23 -18 -33 -15 -5 -49 -30 -74 -56 -26 -25 -55 -46
  -66 -46 -36 0 -45 -25 -38 -102 5 -55 12 -79 29 -98 13 -14 31 -43 42 -65 10
  -22 21 -47 25 -55 4 -8 26 -18 48 -23 34 -7 43 -13 48 -35 10 -41 23 -52 63
  -52 30 0 44 -8 76 -40 21 -21 50 -61 64 -87 35 -64 67 -80 176 -88 l90 -7 42
  36 c38 33 46 36 105 36 77 0 130 27 170 86 21 32 44 48 98 73 85 38 109 39
  140 6 35 -37 104 -35 164 6 26 17 46 38 46 48 0 10 7 24 15 31 34 28 58 183
  33 208 -7 7 -41 12 -82 12 l-71 0 1 60 c0 53 5 67 36 108 l35 47 1 122 1 122
  -62 43 c-60 41 -65 42 -144 43 -59 1 -88 6 -100 17 -30 26 -80 48 -110 48 -24
  0 -31 6 -41 34 -29 80 -96 126 -184 126 -31 -1 -61 -7 -72 -15 -27 -21 -36
  -19 -36 8 0 33 -19 47 -65 47 -31 0 -47 -7 -67 -27z"/>
            <text transform="scale(1,-1)"  z-index="5" position="relative" id="text"  y="-5500" x="9700"  font-size="500">{this.state.territoire_array[23]}</text>


            <path onClick={this.handleZoneClick} id="24" className={this.state.map_repartition.filter((item) => item.ter.includes("24")).map(({id}) => ({id}))[0].id }  d="M10544 5181 c-55 -26 -64 -27 -77 -14 -10 10 -42 17 -98 19 -81 5
  -86 4 -159 -33 -56 -29 -82 -48 -104 -81 -43 -66 -74 -81 -152 -74 -61 5 -67
  3 -104 -27 -32 -26 -47 -31 -91 -31 -37 0 -64 -7 -93 -24 -23 -13 -52 -27 -66
  -31 -36 -11 -60 -35 -60 -61 0 -14 -9 -28 -22 -35 -13 -7 -40 -26 -61 -43 -38
  -30 -38 -32 -35 -87 l3 -57 -46 -5 c-77 -9 -118 -31 -136 -74 -8 -21 -24 -51
  -36 -67 -18 -25 -19 -38 -14 -119 5 -69 11 -97 26 -118 13 -17 21 -44 21 -67
  0 -29 7 -45 28 -65 34 -33 88 -35 171 -8 53 17 57 17 105 -1 28 -10 52 -18 54
  -18 1 0 -4 -13 -13 -30 -22 -44 -19 -93 8 -118 13 -12 31 -22 40 -22 11 0 17
  -8 17 -23 0 -28 22 -50 71 -70 20 -8 49 -31 64 -51 15 -20 34 -36 42 -36 7 0
  31 -9 53 -20 60 -31 124 -27 167 10 30 27 41 30 97 30 67 0 138 20 168 47 21
  19 25 92 6 111 -7 7 -41 12 -81 12 -63 0 -73 3 -123 38 -29 20 -53 40 -51 44
  1 4 28 36 60 72 l58 66 106 0 c89 0 109 3 130 20 14 11 41 22 62 26 20 4 42
  11 49 17 15 12 16 89 1 104 -8 8 -3 16 20 27 17 9 37 29 45 44 8 15 42 55 75
  89 l61 61 0 71 0 71 -40 25 c-23 14 -46 37 -52 50 -6 14 -31 41 -56 60 l-45
  35 89 0 c115 0 134 11 134 80 0 45 2 49 32 59 51 18 68 39 68 86 0 35 -7 50
  -41 89 -23 26 -54 53 -70 61 -47 25 -135 18 -205 -14z"/>
            <text transform="scale(1,-1)"  z-index="5" position="relative" id="text"  y="-4500" x="9700"  font-size="500">{this.state.territoire_array[24]}</text>


            <path onClick={this.handleZoneClick} id="25" className={this.state.map_repartition.filter((item) => item.ter.includes("25")).map(({id}) => ({id}))[0].id }  d="M10618 4031 c-25 -16 -49 -34 -52 -40 -4 -6 -26 -11 -50 -11 -52 0
  -197 -58 -234 -93 -43 -41 -115 -67 -188 -67 l-64 0 -50 -52 c-43 -45 -50 -58
  -50 -92 0 -22 7 -47 16 -57 15 -17 12 -20 -51 -48 -37 -17 -86 -36 -109 -42
  -22 -6 -47 -16 -53 -21 -18 -15 -16 -93 2 -108 11 -9 15 -34 15 -100 0 -106 6
  -114 85 -108 40 3 62 11 81 29 22 21 33 23 82 20 207 -17 283 0 407 90 111 80
  208 187 283 310 26 43 30 120 7 139 -29 24 -18 63 35 115 44 44 50 54 50 92 0
  32 -5 46 -22 57 -35 25 -88 20 -140 -13z"/>
            <text transform="scale(1,-1)"  z-index="5" position="relative" id="text"  y="-3400" x="9900"  font-size="500">{this.state.territoire_array[25]}</text>


            <path onClick={this.handleZoneClick} id="26" className={this.state.map_repartition.filter((item) => item.ter.includes("26")).map(({id}) => ({id}))[0].id }  d="M10905 3915 c-139 -29 -246 -101 -300 -202 -60 -114 -142 -212 -238
  -285 -111 -85 -182 -111 -280 -101 -85 8 -107 -8 -107 -74 0 -39 5 -49 55
  -100 65 -67 69 -90 25 -154 -33 -49 -41 -118 -16 -138 8 -7 63 -15 125 -18
  143 -8 152 -2 207 136 9 22 12 20 48 -39 21 -34 52 -78 68 -96 27 -30 35 -34
  82 -34 61 0 94 26 105 82 6 29 11 33 41 36 19 2 43 10 52 19 25 22 38 8 38
  -41 0 -26 6 -48 14 -55 12 -10 14 -41 9 -172 -3 -113 -2 -164 7 -174 8 -10 43
  -14 144 -14 l134 -1 46 36 c42 32 46 38 46 79 0 37 -5 47 -31 68 -29 23 -31
  27 -31 96 0 39 5 78 12 86 15 18 61 3 113 -38 38 -29 40 -30 125 -23 58 4 92
  12 104 23 16 15 20 15 36 0 14 -13 43 -15 174 -14 177 2 181 4 223 87 13 25
  33 51 44 58 12 7 21 23 21 37 0 20 5 25 24 25 33 0 56 35 56 82 0 38 -10 55
  -114 183 -13 17 -57 50 -97 74 -62 37 -84 45 -142 49 -49 3 -85 0 -127 -13
  -48 -15 -62 -16 -75 -5 -23 19 -19 26 28 45 56 22 192 102 213 126 12 14 19
  43 22 99 6 106 -5 120 -94 120 -50 0 -70 5 -99 24 -20 14 -62 32 -93 41 -31 9
  -78 25 -104 35 -26 11 -60 20 -77 20 -17 0 -69 9 -116 20 -96 22 -208 24 -300
  5z"/>
            <text transform="scale(1,-1)"  z-index="5" position="relative" id="text"  y="-3100" x="10700"  font-size="500">{this.state.territoire_array[26]}</text>


            <path onClick={this.handleZoneClick} id="27" className={this.state.map_repartition.filter((item) => item.ter.includes("27")).map(({id}) => ({id}))[0].id }  d="M10659 2485 c-59 -36 -104 -42 -227 -29 -47 5 -58 3 -101 -26 -27
  -17 -66 -51 -87 -76 -35 -43 -36 -48 -31 -100 7 -67 19 -84 61 -84 26 -1 20
  -6 -44 -34 -71 -32 -82 -41 -94 -78 -8 -26 -97 -14 -170 23 -51 25 -70 29
  -145 29 -62 0 -96 -5 -121 -18 -32 -16 -35 -21 -38 -68 -2 -36 1 -54 12 -63
  14 -12 12 -16 -16 -35 -18 -12 -35 -30 -38 -41 -3 -11 -29 -42 -57 -69 -52
  -48 -53 -50 -53 -105 0 -31 4 -72 10 -90 8 -30 6 -43 -20 -94 -37 -74 -38
  -120 -5 -179 13 -24 31 -68 38 -98 12 -47 13 -59 1 -82 -17 -34 -18 -112 -1
  -126 15 -13 225 -14 232 -1 4 5 20 9 36 9 49 0 165 74 189 120 20 40 28 44 96
  55 89 14 132 71 185 247 16 52 33 81 77 130 83 95 148 135 311 195 94 35 98
  36 241 35 137 -2 148 0 205 25 79 35 144 37 179 4 27 -26 125 -50 205 -51 34
  0 47 -5 63 -25 17 -22 27 -25 82 -25 98 0 106 17 132 267 5 48 4 53 -31 91
  l-36 41 25 50 c31 60 35 130 9 154 -10 8 -47 23 -83 32 -36 9 -86 22 -111 30
  -61 19 -142 19 -180 -1 -34 -17 -52 -14 -106 23 -37 25 -39 25 -165 19 l-126
  -7 -43 30 c-39 29 -48 31 -123 30 -74 -1 -86 -4 -137 -34z"/>
            <text transform="scale(1,-1)"  z-index="5" position="relative" id="text"  y="-1700" x="10000"  font-size="500">{this.state.territoire_array[27]}</text>


            <path onClick={this.handleZoneClick} id="28" className={this.state.map_repartition.filter((item) => item.ter.includes("28")).map(({id}) => ({id}))[0].id }  d="M11020 8985 c-6 -8 -14 -42 -17 -76 -4 -43 -11 -62 -22 -67 -22 -8
  -187 -148 -206 -175 -17 -25 -20 -99 -5 -128 7 -11 8 -45 4 -85 -9 -89 -39
  -125 -110 -133 -51 -6 -45 -1 -111 -106 -38 -60 -31 -99 32 -184 36 -48 55
  -83 55 -102 0 -18 -20 -58 -55 -109 -46 -68 -55 -88 -55 -125 0 -40 4 -47 42
  -77 23 -18 67 -58 97 -89 31 -31 73 -69 94 -84 37 -27 37 -27 37 -101 0 -68 2
  -75 26 -91 23 -15 37 -15 142 -4 65 7 198 16 297 21 235 11 296 25 409 93 55
  34 62 36 122 30 44 -4 68 -2 79 7 21 17 20 99 -2 130 -13 19 -17 41 -14 94 l3
  68 -48 49 c-27 27 -54 49 -60 49 -16 0 -25 52 -12 67 6 7 11 58 12 112 l1 100
  35 6 c62 11 80 30 80 81 0 47 -7 60 -76 142 -17 20 -41 55 -52 78 -11 22 -28
  46 -36 53 -9 8 -16 21 -16 31 0 28 -57 70 -94 70 -27 0 -40 9 -75 50 -29 35
  -50 50 -67 50 -24 0 -32 14 -14 25 6 3 10 28 10 54 0 49 -20 81 -51 81 -9 0
  -22 15 -30 33 -14 31 -16 32 -90 38 -42 4 -82 10 -88 13 -6 4 -11 22 -11 41 0
  27 -7 39 -33 59 -39 30 -107 36 -127 11z"/>
            <text transform="scale(1,-1)"  z-index="5" position="relative" id="text"  y="-8000" x="11000"  font-size="500">{this.state.territoire_array[28]}</text>


            <path onClick={this.handleZoneClick} id="29" className={this.state.map_repartition.filter((item) => item.ter.includes("29")).map(({id}) => ({id}))[0].id }  d="M11590 7408 c-113 -63 -178 -78 -385 -88 -184 -10 -370 -35 -392 -52
  -19 -15 -16 -98 3 -119 14 -16 14 -19 -9 -34 -14 -9 -50 -25 -79 -37 -71 -27
  -78 -34 -78 -82 0 -36 6 -48 39 -80 35 -34 40 -45 45 -100 9 -86 9 -114 1
  -173 -11 -75 -1 -83 96 -83 l79 0 0 -45 c0 -42 3 -48 35 -66 31 -19 35 -25 35
  -64 0 -38 4 -46 44 -79 28 -23 47 -47 51 -67 8 -37 -4 -49 -53 -49 -20 0 -58
  -14 -90 -33 -32 -18 -70 -40 -87 -48 -29 -14 -30 -17 -39 -117 -8 -92 -7 -104
  9 -122 26 -29 131 -27 405 6 30 4 146 1 257 -6 229 -15 254 -12 325 45 129
  102 142 108 238 115 58 4 112 2 150 -6 75 -15 195 -61 210 -80 22 -26 249 -12
  288 19 6 5 12 29 12 53 0 38 -4 46 -37 71 -21 15 -58 45 -82 65 -24 21 -65 44
  -91 52 -63 19 -120 49 -146 78 -12 12 -36 58 -54 101 -23 54 -49 96 -91 142
  -43 48 -59 73 -59 94 0 16 25 105 55 199 60 188 81 316 71 421 -7 66 -37 152
  -65 184 -16 19 -11 19 -212 1 -46 -4 -82 -1 -119 10 -30 9 -88 16 -129 16 -70
  0 -82 -3 -151 -42z"/>
            <text transform="scale(1,-1)"  z-index="5" position="relative" id="text"  y="-6600" x="11200"  font-size="500">{this.state.territoire_array[29]}</text>


            <path onClick={this.handleZoneClick} id="30" className={this.state.map_repartition.filter((item) => item.ter.includes("30")).map(({id}) => ({id}))[0].id }  d="M11971 6113 c-66 -4 -80 -8 -120 -38 -26 -18 -55 -43 -66 -56 -11
  -12 -42 -32 -68 -44 -44 -21 -58 -22 -177 -17 l-130 5 -58 -46 c-32 -25 -100
  -70 -152 -101 -94 -56 -95 -56 -176 -56 -78 0 -85 -2 -191 -54 -108 -53 -109
  -53 -132 -35 -28 23 -147 27 -173 7 -9 -7 -39 -43 -66 -79 l-50 -67 -7 -109
  c-9 -137 -8 -138 106 -128 77 6 81 5 74 -12 -4 -10 -10 -39 -13 -66 -5 -50 14
  -87 46 -87 25 0 96 -40 115 -65 l17 -24 -47 -23 c-48 -23 -48 -23 -48 -73 0
  -27 -4 -53 -10 -57 -5 -4 -51 -8 -101 -8 -107 0 -124 -11 -124 -78 0 -37 4
  -45 33 -61 62 -37 94 -66 104 -92 6 -15 29 -38 52 -50 32 -19 41 -30 41 -50 0
  -45 29 -68 95 -79 111 -18 134 -14 215 37 104 64 127 72 234 82 98 10 179 41
  242 94 l29 25 85 -19 c99 -22 151 -24 168 -7 15 15 16 100 2 114 -17 17 -2 39
  33 52 18 7 86 61 151 122 l117 110 77 0 c93 0 124 14 133 58 4 18 14 41 22 50
  9 9 20 29 26 45 6 15 21 31 33 36 58 22 118 121 118 193 0 41 4 50 33 72 17
  13 54 33 82 43 29 11 54 28 61 41 6 13 20 33 31 45 11 12 25 37 32 56 6 19 31
  69 56 112 53 92 61 156 24 204 -20 24 -27 26 -68 22 -25 -3 -75 -13 -110 -23
  -60 -16 -66 -16 -90 -1 -123 78 -218 93 -510 80z"/>
            <text transform="scale(1,-1)"  z-index="5" position="relative" id="text"  y="-5300" x="11200"  font-size="500">{this.state.territoire_array[30]}</text>


            <path onClick={this.handleZoneClick} id="31" className={this.state.map_repartition.filter((item) => item.ter.includes("31")).map(({id}) => ({id}))[0].id }  d="M11391 4785 c-72 -57 -143 -85 -241 -95 -106 -11 -122 -17 -213 -77
  l-72 -46 -105 2 -105 2 -69 -78 c-47 -53 -86 -86 -120 -103 l-51 -25 0 -55 c0
  -52 -2 -56 -35 -79 -32 -22 -44 -24 -133 -22 l-98 2 -89 -91 c-86 -87 -90 -93
  -90 -135 0 -43 1 -44 81 -101 l81 -57 131 7 c93 5 142 12 171 25 61 28 134 51
  159 51 20 0 22 -5 22 -64 1 -38 6 -70 14 -80 20 -24 109 -22 135 3 47 44 256
  102 293 82 22 -12 128 -32 201 -38 49 -5 56 -2 83 25 33 34 191 100 319 133
  75 19 111 22 295 22 123 0 215 4 223 10 6 5 12 30 12 56 0 43 -5 53 -75 136
  -62 74 -83 91 -118 101 -84 24 -92 27 -108 41 -9 7 -22 42 -28 76 -7 34 -14
  70 -16 80 -2 12 10 26 36 43 38 23 39 26 39 78 0 70 -29 108 -103 132 -29 9
  -57 21 -64 26 -19 15 -201 48 -261 47 -49 0 -63 -5 -101 -34z"/>
            <text transform="scale(1,-1)"  z-index="5" position="relative" id="text"  y="-4200" x="11000"  font-size="500">{this.state.territoire_array[31]}</text>


            <path onClick={this.handleZoneClick} id="32" className={this.state.map_repartition.filter((item) => item.ter.includes("32")).map(({id}) => ({id}))[0].id }  d="M12201 3138 c-24 -16 -54 -23 -112 -26 -50 -3 -83 -10 -90 -18 -6 -8
  -24 -14 -40 -14 -20 0 -35 -9 -50 -29 -12 -16 -30 -32 -40 -34 -11 -3 -29 -28
  -44 -61 -13 -30 -32 -59 -42 -64 -10 -5 -58 -8 -106 -7 -72 2 -93 6 -117 24
  -38 27 -106 29 -134 2 -12 -11 -39 -21 -62 -22 -33 -2 -48 3 -73 24 -18 15
  -39 27 -47 27 -8 0 -24 11 -36 25 -29 34 -95 35 -125 3 -28 -32 -43 -62 -43
  -91 0 -15 -10 -31 -25 -41 -21 -14 -25 -24 -25 -66 0 -27 5 -52 10 -55 6 -3
  10 -22 10 -42 0 -20 7 -45 17 -55 9 -10 14 -20 11 -23 -3 -3 -70 -8 -149 -11
  -167 -7 -179 -12 -179 -81 0 -38 4 -46 30 -61 17 -9 56 -41 88 -70 l57 -53
  135 6 135 6 55 -30 c63 -35 137 -41 197 -16 40 17 115 9 203 -20 l48 -16 -19
  -50 c-11 -27 -19 -72 -19 -100 0 -46 4 -55 48 -105 l47 -54 61 0 c45 0 77 7
  116 25 30 14 88 30 129 35 116 15 313 86 334 120 4 6 28 20 53 32 52 24 92 55
  92 73 0 7 9 20 21 31 19 17 20 28 17 111 -3 83 -6 94 -29 120 -23 24 -27 40
  -32 107 l-6 79 -61 61 c-49 49 -58 62 -43 65 28 5 43 21 43 46 0 14 13 30 38
  46 33 21 37 29 40 71 3 47 3 47 -75 123 -76 73 -79 75 -128 75 -34 0 -61 -7
  -84 -22z"/>
            <text transform="scale(1,-1)"  z-index="5" position="relative" id="text"  y="-2350" x="11500"  font-size="500">{this.state.territoire_array[32]}</text>


            <path onClick={this.handleZoneClick} id="33" className={this.state.map_repartition.filter((item) => item.ter.includes("33")).map(({id}) => ({id}))[0].id }  d="M12300 9866 c-14 -9 -41 -16 -60 -16 -19 0 -51 -5 -70 -10 -19 -5
  -91 -23 -160 -40 -124 -30 -125 -31 -165 -13 -59 27 -184 25 -222 -3 -24 -18
  -28 -28 -28 -70 0 -47 2 -49 43 -72 27 -15 42 -30 42 -43 0 -11 12 -38 27 -62
  23 -36 27 -51 24 -100 -2 -48 1 -63 17 -80 32 -34 42 -72 42 -161 0 -81 1 -83
  34 -112 29 -26 35 -41 47 -103 12 -72 12 -74 -10 -92 -16 -13 -39 -19 -75 -19
  -54 0 -116 -28 -116 -54 0 -14 -48 -26 -111 -26 -43 0 -79 -34 -79 -74 0 -18
  -9 -35 -25 -48 -21 -16 -25 -28 -25 -69 0 -42 5 -54 36 -89 26 -29 44 -40 65
  -40 40 0 78 -19 85 -44 3 -12 14 -30 24 -41 10 -11 26 -36 35 -55 19 -37 56
  -85 116 -151 33 -35 42 -39 83 -39 31 0 56 7 74 20 24 18 32 19 61 9 46 -16
  367 -4 396 15 11 7 43 32 71 54 l51 40 7 91 c4 50 12 93 17 96 5 4 9 33 9 66
  0 44 4 59 14 59 8 0 45 34 82 75 37 41 72 75 79 75 28 0 108 65 150 122 l46
  63 -3 117 c-3 102 -6 120 -25 146 l-22 30 55 37 c73 49 117 133 112 216 -2 45
  -7 56 -25 64 -13 5 -23 17 -23 27 0 9 -6 20 -12 25 -27 17 -126 36 -202 38
  -52 2 -82 8 -87 17 -5 7 -9 47 -9 89 0 94 -9 104 -104 113 -38 4 -77 11 -86
  16 -10 5 -53 12 -96 15 -60 4 -85 2 -104 -9z"/>
            <text transform="scale(1,-1)"  z-index="5" position="relative" id="text"  y="-8800" x="12000"  font-size="500">{this.state.territoire_array[33]}</text>


            <path onClick={this.handleZoneClick} id="34" className={this.state.map_repartition.filter((item) => item.ter.includes("34")).map(({id}) => ({id}))[0].id }  d="M12987 8422 c-10 -10 -17 -35 -17 -55 0 -26 -6 -39 -20 -47 -30 -16
  -100 6 -162 52 l-53 40 -95 -4 c-81 -4 -101 -9 -138 -31 -23 -15 -42 -31 -42
  -36 0 -5 -23 -26 -51 -47 -44 -32 -60 -38 -108 -39 -31 -1 -77 -10 -103 -20
  -42 -17 -52 -18 -100 -6 -29 7 -82 15 -117 18 -57 4 -66 2 -90 -20 -14 -14
  -39 -27 -56 -30 -49 -8 -164 -53 -185 -72 -14 -13 -20 -31 -20 -61 0 -35 5
  -47 25 -60 17 -11 25 -25 25 -45 0 -19 -9 -37 -25 -51 -20 -17 -25 -31 -25
  -70 0 -40 4 -50 25 -64 14 -9 25 -22 25 -28 0 -6 23 -34 50 -61 l50 -49 -6
  -64 c-6 -54 -4 -66 13 -85 12 -12 28 -37 37 -54 28 -55 55 -66 177 -71 115 -5
  154 3 197 41 l22 20 0 -45 c0 -27 6 -50 14 -57 8 -7 54 -16 101 -21 66 -7 96
  -15 124 -33 20 -14 59 -32 88 -42 38 -12 58 -25 72 -48 45 -74 105 -107 190
  -107 42 0 52 5 112 59 45 41 69 72 78 99 25 74 46 89 149 106 50 9 111 16 135
  16 53 0 67 13 67 61 0 44 27 69 75 69 17 0 36 5 43 12 15 15 16 180 1 195 -7
  7 0 15 26 27 52 25 85 83 85 150 0 36 -5 58 -15 66 -14 12 -13 15 5 35 14 15
  20 35 20 71 0 52 -12 74 -42 74 -9 0 -32 13 -50 29 -21 17 -49 30 -76 34 -73
  9 -115 37 -131 88 -7 24 -18 52 -22 61 -5 10 -9 31 -9 47 0 43 -21 54 -90 49
  -42 -3 -64 0 -72 9 -16 20 -92 17 -111 -5z"/>
            <text transform="scale(1,-1)"  z-index="5" position="relative" id="text"  y="-7700" x="12300"  font-size="500">{this.state.territoire_array[34]}</text>


            <path onClick={this.handleZoneClick} id="35" className={this.state.map_repartition.filter((item) => item.ter.includes("35")).map(({id}) => ({id}))[0].id }  d="M12181 7394 c-20 -15 -22 -22 -17 -73 20 -189 20 -189 -19 -321 -21
  -69 -48 -161 -61 -205 -16 -54 -24 -106 -24 -161 0 -74 2 -82 26 -105 39 -36
  108 -137 136 -199 45 -101 98 -146 214 -184 34 -11 77 -39 127 -82 114 -99
  113 -96 61 -181 -24 -39 -46 -83 -50 -97 -3 -14 -12 -30 -20 -37 -8 -7 -14
  -30 -14 -59 0 -43 4 -50 36 -75 35 -27 36 -27 150 -20 l115 7 76 -38 c72 -37
  81 -39 170 -39 88 0 96 2 114 24 10 13 19 35 19 50 0 40 50 118 144 223 47 54
  86 103 86 110 0 16 81 96 123 121 23 15 27 24 27 61 0 24 -6 48 -12 54 -7 5
  -75 12 -151 14 l-139 3 -24 30 c-13 17 -35 44 -49 61 -20 25 -25 43 -25 86 0
  45 -4 59 -24 77 l-25 23 27 22 c15 12 39 30 55 39 24 16 27 23 27 77 0 66 -32
  174 -60 203 -13 14 -38 20 -114 24 -89 6 -99 4 -126 -16 -29 -21 -32 -21 -87
  -7 -32 8 -82 17 -111 20 -88 11 -89 15 -23 58 82 54 91 68 91 154 0 82 -19
  117 -70 127 -22 5 -39 20 -64 60 -41 63 -49 71 -101 87 -22 7 -57 23 -77 37
  -29 19 -58 28 -123 34 -47 5 -94 13 -105 19 -28 15 -83 12 -109 -6z"/>
            <text transform="scale(1,-1)"  z-index="5" position="relative" id="text"  y="-6300" x="12300"  font-size="500">{this.state.territoire_array[35]}</text>


            <path onClick={this.handleZoneClick} id="36" className={this.state.map_repartition.filter((item) => item.ter.includes("36")).map(({id}) => ({id}))[0].id }  d="M12575 5680 c-11 -5 -39 -14 -61 -20 -23 -5 -65 -28 -93 -51 -50 -40
  -51 -41 -51 -96 0 -70 -34 -129 -97 -166 -23 -15 -43 -32 -43 -40 0 -7 -11
  -28 -25 -47 -14 -19 -25 -46 -25 -61 0 -32 -8 -35 -129 -45 l-84 -7 -106 -100
  c-58 -55 -124 -108 -146 -118 -56 -25 -95 -78 -95 -128 0 -34 5 -44 35 -67 22
  -16 35 -35 35 -49 0 -27 13 -39 62 -54 40 -13 59 -32 39 -39 -6 -2 -25 -15
  -42 -29 -27 -23 -30 -30 -27 -77 2 -42 7 -53 26 -61 16 -7 22 -18 23 -45 0
  -19 8 -57 17 -85 20 -60 60 -85 138 -85 57 0 74 12 74 54 0 16 11 44 26 63 38
  50 96 75 192 83 79 7 85 9 123 46 22 21 42 48 45 59 3 11 20 27 39 36 28 13
  50 14 149 6 141 -12 149 -8 144 70 l-3 53 87 0 86 0 52 60 c29 34 79 81 111
  107 l59 46 0 74 c0 47 6 85 16 104 19 37 15 119 -6 130 -8 4 -37 18 -65 30
  l-50 22 65 10 c36 5 77 18 93 29 23 16 27 26 27 66 -1 37 -7 54 -30 82 -24 27
  -30 44 -30 81 0 54 -11 67 -87 99 -29 12 -58 28 -64 36 -9 11 -43 14 -145 14
  -78 0 -135 4 -139 10 -8 12 -92 12 -120 0z"/>
            <text transform="scale(1,-1)"  z-index="5" position="relative" id="text"  y="-5000" x="12300"  font-size="500">{this.state.territoire_array[36]}</text>


            <path onClick={this.handleZoneClick} id="37" className={this.state.map_repartition.filter((item) => item.ter.includes("37")).map(({id}) => ({id}))[0].id }  d="M12425 4660 c-4 -6 -24 -19 -45 -30 -24 -12 -45 -33 -57 -57 -28 -58
  -73 -83 -152 -83 -82 -1 -149 -34 -198 -98 -28 -37 -33 -52 -33 -97 0 -53 1
  -55 81 -147 102 -116 119 -144 119 -190 0 -41 35 -78 93 -97 24 -8 36 -21 45
  -44 34 -95 254 -267 342 -267 10 0 43 -10 74 -21 47 -18 65 -33 106 -85 40
  -51 56 -64 78 -64 15 0 56 -16 92 -35 67 -37 135 -46 158 -23 19 19 14 90 -13
  172 -14 42 -25 79 -25 81 0 3 11 5 24 5 28 0 43 16 48 50 3 23 6 21 37 -25 19
  -27 50 -67 69 -87 32 -33 42 -38 82 -38 60 0 80 21 80 80 0 46 -30 120 -63
  157 -25 28 -19 30 93 35 47 3 99 11 115 19 29 14 30 17 35 94 5 73 7 80 27 83
  35 5 40 21 47 138 6 98 5 112 -11 126 -23 21 -95 50 -258 104 -434 144 -506
  174 -600 257 -55 47 -110 67 -190 67 -43 0 -66 5 -75 15 -14 17 -115 21 -125
  5z"/>
            <text transform="scale(1,-1)"  z-index="5" position="relative" id="text"  y="-4000" x="12400"  font-size="500">{this.state.territoire_array[37]}</text>


            <path onClick={this.handleZoneClick} id="38" className={this.state.map_repartition.filter((item) => item.ter.includes("38")).map(({id}) => ({id}))[0].id }  d="M11930 4059 c-306 -14 -394 -30 -545 -98 -79 -36 -89 -50 -81 -108 6
  -47 29 -83 51 -83 30 0 145 -42 178 -64 28 -19 52 -26 104 -28 66 -3 68 -4 71
  -30 2 -19 -4 -34 -20 -49 -31 -29 -132 -87 -193 -111 -72 -28 -85 -43 -85 -96
  0 -37 6 -50 34 -78 32 -32 38 -34 97 -34 35 1 82 7 104 15 46 16 91 8 140 -25
  17 -12 44 -27 61 -34 19 -8 46 -36 68 -69 51 -77 116 -134 161 -143 63 -12
  163 3 210 31 24 14 50 25 58 25 8 0 20 7 28 16 16 20 75 11 105 -17 15 -14 35
  -19 76 -19 61 0 111 -14 147 -42 28 -21 159 -26 179 -6 17 17 15 88 -3 108
  -28 31 -10 45 50 42 71 -5 85 7 85 68 0 46 -3 51 -52 94 -29 25 -56 46 -60 46
  -5 0 -8 25 -8 54 0 51 -3 59 -50 115 -44 53 -58 63 -108 77 -114 31 -170 54
  -228 90 -64 40 -137 120 -169 185 -16 34 -30 45 -75 64 -49 21 -55 26 -58 57
  -2 18 -8 39 -14 45 -11 14 -12 14 -258 2z"/>
            <text transform="scale(1,-1)"  z-index="5" position="relative" id="text"  y="-3500" x="11800"  font-size="500">{this.state.territoire_array[38]}</text>


            <path onClick={this.handleZoneClick} id="39" className={this.state.map_repartition.filter((item) => item.ter.includes("39")).map(({id}) => ({id}))[0].id }  d="M13072 3768 c-7 -7 -12 -29 -12 -50 0 -35 -2 -38 -28 -38 -15 0 -33
  -5 -40 -12 -24 -24 -12 -143 24 -233 7 -18 6 -18 -30 3 -49 29 -137 30 -183 2
  -29 -17 -33 -25 -33 -64 0 -43 2 -46 57 -85 l58 -41 -36 0 c-51 0 -99 -51 -99
  -106 0 -22 5 -45 12 -52 19 -19 -6 -14 -33 7 -16 12 -50 21 -104 26 -64 5 -85
  11 -105 31 -20 18 -41 25 -98 30 -87 8 -102 0 -102 -62 0 -39 4 -46 50 -85 55
  -46 62 -64 28 -75 -36 -10 -58 -35 -58 -64 0 -22 -6 -29 -27 -35 -43 -10 -53
  -24 -53 -70 0 -39 5 -47 79 -121 l78 -79 -5 -62 c-4 -61 -3 -64 32 -103 36
  -40 40 -53 36 -138 -2 -61 11 -72 84 -71 45 0 75 7 116 27 l55 27 3 56 c2 48
  6 58 26 67 13 6 40 25 60 42 33 30 36 36 36 89 0 33 7 70 18 91 21 44 101 89
  155 90 26 0 51 9 75 27 73 53 92 75 92 108 0 29 4 33 53 48 30 9 67 17 83 17
  28 1 145 37 172 53 6 5 12 27 12 51 l0 42 53 -8 c179 -27 187 -25 187 52 0 44
  -3 50 -45 85 -25 20 -54 54 -65 74 -10 21 -26 43 -34 50 -10 8 -16 29 -16 54
  0 31 -8 50 -36 84 -51 62 -144 123 -188 123 -30 0 -39 6 -72 53 -20 28 -60 76
  -88 105 -45 46 -55 52 -91 52 -23 0 -46 -5 -53 -12z"/>
            <text transform="scale(1,-1)"  z-index="5" position="relative" id="text"  y="-3000" x="12800"  font-size="500">{this.state.territoire_array[39]}</text>


            <path onClick={this.handleZoneClick} id="40" className={this.state.map_repartition.filter((item) => item.ter.includes("40")).map(({id}) => ({id}))[0].id }  d="M13861 9554 c-12 -15 -21 -30 -21 -35 0 -5 -37 -26 -83 -49 -45 -22
  -99 -55 -120 -74 -32 -29 -37 -40 -37 -77 -1 -67 -19 -84 -193 -172 -96 -49
  -97 -51 -97 -118 0 -41 -4 -59 -12 -59 -16 1 -59 39 -74 66 -9 16 -23 19 -77
  19 -46 1 -72 6 -84 17 -30 27 -93 48 -142 48 -68 0 -91 -27 -91 -105 0 -47 -5
  -66 -25 -96 -27 -39 -76 -80 -137 -118 -21 -12 -41 -29 -45 -36 -5 -7 -27 -34
  -51 -59 -39 -42 -47 -46 -91 -46 -58 0 -71 -12 -71 -67 0 -34 5 -46 24 -58 21
  -14 23 -21 19 -63 -3 -26 -9 -51 -14 -56 -13 -15 -11 -90 3 -104 15 -15 120
  -16 135 -1 6 6 30 15 54 19 38 7 47 4 102 -31 33 -21 67 -39 76 -39 9 0 29 -7
  45 -15 57 -30 166 -12 197 33 11 14 28 21 66 23 l52 4 15 -40 c8 -22 18 -53
  22 -68 10 -41 72 -83 143 -95 40 -7 67 -19 84 -36 15 -14 31 -26 38 -26 8 0 6
  -7 -4 -18 -11 -12 -17 -36 -17 -70 0 -41 4 -54 23 -69 13 -10 29 -34 35 -53
  14 -39 49 -80 69 -80 8 0 33 -10 56 -22 33 -17 65 -22 152 -26 89 -4 115 -8
  138 -24 35 -25 149 -37 172 -18 8 7 15 26 15 42 0 18 8 36 22 47 13 11 23 34
  27 62 6 44 6 44 51 49 36 4 47 10 57 31 7 15 32 49 56 75 24 27 58 75 75 106
  28 51 32 67 32 132 0 72 1 75 27 88 15 7 30 24 34 38 12 41 10 115 -3 128 -20
  20 -90 14 -128 -11 -33 -22 -43 -23 -147 -19 -82 3 -113 8 -113 17 0 7 -7 18
  -15 25 -10 8 -15 30 -15 64 0 42 -5 57 -23 74 -20 19 -35 22 -111 22 -95 0
  -132 12 -160 54 -9 14 -37 36 -62 49 l-45 23 54 17 c64 20 177 91 177 111 0
  18 43 46 73 46 12 0 28 5 35 12 18 18 14 89 -8 133 -11 22 -20 46 -20 55 0 9
  -5 21 -11 27 -7 7 6 17 44 32 62 25 104 65 116 107 7 26 12 30 62 35 30 3 74
  17 99 31 41 22 45 28 48 67 2 23 -2 48 -7 55 -7 8 -51 15 -118 19 -86 6 -111
  11 -128 27 -29 27 -99 50 -156 50 -39 0 -51 -4 -68 -26z"/>
            <text transform="scale(1,-1)"  z-index="5" position="relative" id="text"  y="-8500" x="13000"  font-size="500">{this.state.territoire_array[40]}</text>


            <path onClick={this.handleZoneClick} id="41" className={this.state.map_repartition.filter((item) => item.ter.includes("41")).map(({id}) => ({id}))[0].id }  d="M13498 7840 c-7 -12 -31 -31 -53 -44 -68 -40 -87 -67 -83 -117 2 -34
  8 -46 26 -54 15 -7 22 -18 22 -37 0 -26 -3 -28 -38 -28 -54 0 -92 -40 -92 -98
  l0 -42 -77 -1 c-105 -1 -186 -19 -218 -49 -14 -13 -33 -46 -43 -74 -14 -40
  -31 -61 -94 -115 l-78 -66 0 -53 c0 -50 -2 -53 -41 -80 -22 -15 -58 -42 -80
  -61 -36 -31 -39 -37 -39 -86 0 -33 5 -57 14 -64 8 -6 51 -16 97 -21 46 -5 99
  -14 117 -19 17 -5 68 -13 112 -17 73 -6 83 -5 103 14 19 17 29 19 65 12 53 -9
  53 -10 83 -85 33 -85 33 -85 105 -85 61 0 64 -1 64 -24 0 -46 111 -116 184
  -116 39 0 52 6 85 36 22 19 51 55 66 79 30 52 60 75 96 75 39 0 79 36 79 71 0
  19 6 32 18 36 9 3 36 22 58 42 23 20 54 45 69 55 27 19 27 19 21 105 -6 70
  -11 90 -30 109 l-23 23 21 44 c19 40 25 44 57 45 43 0 59 15 59 55 0 17 11 46
  25 65 19 26 25 46 25 87 0 39 6 62 21 82 15 20 19 39 17 72 -3 42 -5 44 -63
  74 -58 29 -60 32 -65 74 -3 25 -11 47 -20 51 -8 4 -35 16 -60 28 -33 15 -72
  22 -147 25 -90 3 -107 7 -142 30 -23 15 -47 27 -54 27 -8 0 -26 9 -40 20 -35
  28 -112 28 -129 0z"/>
            <text transform="scale(1,-1)"  z-index="5" position="relative" id="text"  y="-7000" x="13300"  font-size="500">{this.state.territoire_array[41]}</text>


            <path onClick={this.handleZoneClick} id="42" className={this.state.map_repartition.filter((item) => item.ter.includes("42")).map(({id}) => ({id}))[0].id }  d="M14520 7701 c-8 -5 -31 -11 -51 -15 -21 -4 -42 -13 -49 -21 -9 -11
  -17 -12 -30 -5 -10 6 -41 10 -69 10 -45 0 -58 -5 -111 -47 -33 -25 -60 -53
  -60 -62 0 -9 -14 -34 -30 -55 -25 -33 -30 -49 -30 -96 0 -44 -4 -61 -20 -75
  -13 -12 -20 -31 -20 -56 l0 -38 -47 -3 -48 -3 -37 -69 c-49 -90 -50 -128 -4
  -176 58 -59 56 -77 -10 -132 -31 -27 -62 -48 -69 -48 -17 0 -45 -33 -45 -53 0
  -28 -37 -57 -73 -57 -44 0 -72 -22 -107 -84 -17 -29 -40 -62 -53 -74 l-22 -21
  -39 22 c-22 12 -43 30 -48 40 -4 9 -12 25 -17 35 -7 14 -24 17 -105 20 -107 3
  -118 -1 -213 -92 -40 -37 -43 -44 -43 -94 0 -48 3 -55 28 -69 27 -15 28 -19
  24 -71 -4 -52 -3 -55 37 -95 22 -23 52 -55 65 -72 l24 -30 176 -3 c112 -2 222
  2 305 12 116 13 139 19 212 55 45 23 94 41 109 41 15 0 32 6 38 13 5 6 12 61
  14 120 5 106 5 108 38 142 18 18 46 39 62 46 25 10 32 9 52 -10 16 -15 35 -21
  67 -21 42 0 49 4 105 63 79 80 94 104 94 145 0 24 7 40 23 52 16 13 28 38 36
  77 16 71 61 159 112 216 l37 43 67 -4 67 -4 59 58 c53 52 59 63 59 100 0 26
  -6 46 -17 56 -29 25 -80 48 -108 48 -27 0 -33 8 -37 49 -2 19 3 26 21 31 51
  12 105 169 69 198 -7 5 -47 12 -88 14 -56 4 -88 12 -125 31 -51 28 -141 37
  -175 18z"/>
            <text transform="scale(1,-1)"  z-index="5" position="relative" id="text"  y="-7000" x="14100"  font-size="500">{this.state.territoire_array[42]}</text>


            <path onClick={this.handleZoneClick} id="43" className={this.state.map_repartition.filter((item) => item.ter.includes("43")).map(({id}) => ({id}))[0].id }  d="M14862 7229 c-40 -39 -56 -49 -65 -40 -6 6 -32 11 -58 11 -45 0 -50
  -3 -97 -56 -63 -70 -106 -150 -128 -237 -13 -52 -23 -72 -45 -88 -24 -17 -29
  -27 -29 -63 0 -45 -25 -89 -73 -127 -15 -11 -27 -30 -27 -42 0 -19 -4 -17 -38
  16 -51 50 -91 50 -167 1 -82 -52 -95 -79 -95 -196 0 -109 -9 -128 -64 -128
  -18 0 -62 -15 -97 -33 -74 -39 -126 -54 -222 -62 -57 -6 -75 -12 -105 -38 -78
  -66 -152 -142 -152 -158 0 -9 -32 -50 -71 -90 -38 -41 -91 -105 -117 -142 -43
  -63 -47 -74 -47 -130 0 -56 2 -61 30 -78 19 -11 52 -18 90 -18 56 -1 63 2 88
  30 23 26 31 30 59 24 18 -4 58 -22 90 -41 31 -19 60 -34 65 -34 5 0 24 -11 43
  -25 30 -22 44 -25 124 -25 70 0 87 -3 78 -12 -17 -17 -15 -79 4 -106 11 -17
  25 -22 57 -22 23 0 49 5 57 10 10 6 21 3 37 -12 31 -29 122 -37 154 -14 31 21
  37 20 41 -5 2 -12 10 -27 19 -32 29 -18 428 19 519 48 10 3 31 20 46 38 25 30
  30 32 86 29 73 -5 88 6 88 64 0 36 -6 51 -35 83 -21 23 -32 42 -25 46 6 3 10
  45 10 98 0 77 -5 104 -28 165 -15 41 -41 90 -58 110 -16 20 -32 53 -36 72 -18
  97 -31 126 -85 181 l-54 55 27 40 c36 55 51 64 103 64 25 0 89 12 141 26 52
  14 105 28 116 31 12 3 49 27 83 54 59 49 61 51 61 98 0 54 -23 92 -71 117
  l-30 15 29 37 c27 33 31 48 37 134 5 63 12 102 21 109 8 6 14 29 14 50 0 32 5
  40 28 51 23 11 27 20 30 64 2 33 -2 55 -10 61 -29 24 -167 66 -228 69 l-65 5
  -53 -52z"/>
            <text transform="scale(1,-1)"  z-index="5" position="relative" id="text"  y="-5800" x="14000"  font-size="500">{this.state.territoire_array[43]}</text>


            <path onClick={this.handleZoneClick}  id="44" className={this.state.map_repartition.filter((item) => item.ter.includes("44")).map(({id}) => ({id}))[0].id }  d="M13372 5675 c-18 -8 -35 -21 -38 -30 -5 -11 -21 -15 -60 -15 -36 0
  -64 -7 -86 -20 -18 -11 -47 -20 -64 -20 -19 0 -39 -9 -52 -23 -31 -32 -31
  -125 -1 -174 23 -37 23 -38 -7 -47 -14 -4 -27 0 -39 14 -21 23 -103 28 -123 8
  -7 -7 -12 -39 -12 -75 l0 -63 49 -38 c26 -21 61 -44 77 -50 l29 -12 -1 -91 0
  -91 -66 -56 c-36 -32 -82 -76 -103 -99 -44 -51 -79 -56 -115 -18 -19 20 -33
  25 -71 25 -62 0 -79 -22 -79 -103 l0 -59 80 -88 c114 -125 154 -146 490 -255
  157 -51 321 -107 365 -124 97 -38 183 -48 264 -31 72 15 89 31 93 90 3 40 6
  45 28 48 57 6 188 45 225 67 45 26 81 62 119 119 34 51 37 155 5 217 l-20 41
  35 51 c28 40 36 62 36 96 0 34 6 51 31 78 28 32 30 41 27 92 -3 54 -2 56 27
  64 78 23 79 25 89 125 11 122 11 122 -115 122 -97 0 -98 0 -111 28 -13 27 -15
  27 -105 27 -50 0 -95 3 -99 8 -4 4 -34 7 -66 7 l-58 0 0 49 c0 28 -6 53 -13
  60 -8 6 -47 10 -94 8 -71 -2 -85 1 -110 20 -15 13 -46 32 -68 44 -22 12 -47
  28 -56 35 -24 21 -128 54 -168 54 -20 -1 -51 -7 -69 -15z"/>
            <text transform="scale(1,-1)"  z-index="5" position="relative" id="text"  y="-4700" x="13400"  font-size="500">{this.state.territoire_array[44]}</text>


            <path onClick={this.handleZoneClick} id="45" className={this.state.map_repartition.filter((item) => item.ter.includes("45")).map(({id}) => ({id}))[0].id }  d="M14243 4618 c-5 -7 -15 -31 -22 -53 -35 -102 -111 -161 -256 -196
  -121 -29 -133 -38 -137 -95 -3 -46 -4 -47 -48 -60 -25 -8 -72 -14 -106 -14
  -83 0 -98 -16 -92 -104 4 -63 3 -64 -27 -78 -30 -13 -30 -14 -33 -99 l-3 -86
  -52 -7 c-29 -3 -82 -6 -118 -6 -87 0 -119 -22 -119 -82 0 -33 7 -49 38 -83 43
  -48 74 -100 82 -135 3 -17 27 -40 71 -70 83 -56 119 -104 119 -158 0 -24 6
  -45 16 -53 8 -7 24 -30 35 -51 11 -21 42 -55 70 -75 29 -22 52 -48 55 -63 10
  -45 13 -49 53 -70 56 -28 137 -26 226 5 77 27 118 69 131 135 8 42 21 60 44
  60 9 0 33 18 54 40 20 22 42 40 47 40 6 0 22 9 36 19 20 16 34 19 74 14 28 -3
  59 -1 72 5 20 10 41 15 122 28 160 25 156 24 275 103 l115 78 3 44 c3 44 1 46
  -60 100 -34 30 -79 62 -99 71 -24 10 -48 33 -65 60 -41 66 -65 88 -95 88 -15
  0 -35 3 -44 6 -14 6 -13 8 7 18 18 9 24 21 26 59 l3 47 68 0 c58 0 71 3 89 23
  25 26 31 104 10 125 -9 9 7 12 73 12 53 0 90 5 97 12 7 7 12 31 12 54 0 36 -5
  47 -40 78 -22 20 -45 36 -50 36 -6 0 -63 50 -127 110 -65 61 -140 124 -168
  139 -47 27 -60 29 -201 35 -117 5 -153 3 -161 -6z"/>
            <text transform="scale(1,-1)"  z-index="5" position="relative" id="text"  y="-3800" x="14000"  font-size="500">{this.state.territoire_array[45]}</text>


            <path onClick={this.handleZoneClick} id="46" className={this.state.map_repartition.filter((item) => item.ter.includes("46")).map(({id}) => ({id}))[0].id }  d="M15303 7272 c-21 -26 -44 -43 -65 -47 -18 -4 -44 -15 -58 -25 -14 -9
  -44 -29 -67 -44 -39 -23 -43 -30 -43 -65 0 -23 -6 -44 -16 -52 -14 -11 -15
  -27 -9 -106 l7 -93 -37 -51 c-31 -44 -36 -57 -33 -97 3 -43 6 -48 46 -70 23
  -13 42 -30 42 -37 0 -27 -129 -105 -173 -105 -12 0 -44 -7 -71 -15 -27 -8 -71
  -15 -98 -15 -67 0 -81 -10 -123 -84 -28 -50 -35 -74 -35 -116 0 -51 2 -55 60
  -112 45 -45 60 -67 60 -88 0 -15 7 -33 15 -40 8 -7 15 -27 15 -44 0 -18 5 -37
  12 -44 25 -25 100 -13 201 30 93 40 100 41 135 28 20 -7 66 -35 102 -62 l65
  -49 75 4 c81 4 151 31 170 66 13 26 36 32 128 36 169 7 214 15 262 50 66 47
  97 61 175 75 39 8 78 20 88 28 23 20 24 104 1 123 -9 7 -53 15 -99 18 -66 5
  -90 11 -115 30 -29 21 -40 23 -99 18 -36 -4 -79 -9 -96 -13 -29 -7 -30 -6 -12
  13 20 23 23 93 5 111 -7 7 -22 12 -35 12 -19 0 -16 6 26 45 l48 45 90 0 c56 0
  93 4 101 12 7 7 12 33 12 58 0 48 -13 70 -41 70 -9 0 -22 6 -28 14 -6 7 -36
  16 -67 20 -31 3 -65 11 -76 17 -20 11 -20 11 3 35 18 19 33 24 72 24 33 0 58
  7 78 21 25 18 29 27 29 69 0 56 -16 73 -84 85 -49 8 -120 44 -165 83 -32 27
  -35 33 -32 80 2 42 -1 53 -18 64 -16 10 -21 23 -21 54 0 61 -13 68 -154 72
  l-121 4 -32 -40z"/>
            <text transform="scale(1,-1)"  z-index="5" position="relative" id="text"  y="-6400" x="15200"  font-size="500">{this.state.territoire_array[46]}</text>



            <path onClick={this.handleZoneClick} id="47" className={this.state.map_repartition.filter((item) => item.ter.includes("47")).map(({id}) => ({id}))[0].id }  d="M14874 6017 c-50 -23 -99 -48 -108 -56 -27 -23 -20 -85 19 -167 48
  -101 52 -125 26 -167 -23 -38 -28 -106 -9 -125 9 -9 5 -12 -20 -12 -26 0 -36
  -7 -56 -38 -34 -54 -45 -61 -127 -72 -120 -16 -128 -20 -179 -68 -40 -39 -49
  -54 -52 -87 -2 -31 -8 -41 -23 -43 -11 -2 -35 -15 -52 -29 -28 -20 -33 -31
  -33 -64 0 -21 5 -48 12 -59 10 -15 9 -22 -4 -37 -8 -10 -18 -39 -20 -65 -4
  -34 -18 -64 -52 -113 -58 -82 -61 -124 -16 -190 50 -72 70 -81 199 -89 92 -5
  119 -10 143 -27 24 -17 40 -20 80 -17 44 5 56 1 102 -28 28 -18 65 -44 81 -57
  49 -40 94 -58 154 -64 68 -7 100 -22 158 -76 42 -39 47 -41 122 -45 77 -4 78
  -4 99 26 15 21 22 45 22 79 0 58 22 98 97 171 59 58 107 82 126 63 6 -6 37
  -11 70 -11 56 0 61 2 122 53 35 28 84 67 109 86 45 32 46 35 46 87 0 46 -3 56
  -25 70 -14 9 -25 26 -25 39 0 22 -23 49 -48 57 -8 2 -20 18 -28 36 l-13 32 47
  0 c70 0 94 20 90 78 -3 51 2 47 -123 104 l-70 32 60 8 c33 5 92 11 130 14 39
  3 76 10 83 16 7 6 12 33 12 63 0 57 -11 72 -67 94 -17 7 -39 21 -49 32 -16 18
  -16 19 15 19 65 0 151 64 151 112 0 26 3 28 38 28 53 0 72 23 72 87 0 57 -10
  70 -60 75 l-34 3 3 57 c2 51 0 58 -23 73 -17 12 -43 16 -88 14 -70 -2 -120 5
  -191 28 -33 10 -69 13 -120 9 -39 -3 -88 -5 -107 -4 -92 5 -188 1 -217 -9 -30
  -10 -35 -8 -91 37 -88 71 -110 80 -194 79 -64 0 -84 -5 -164 -42z"/>
            <text transform="scale(1,-1)"  z-index="5" position="relative" id="text"  y="-5000" x="15000"  font-size="500">{this.state.territoire_array[47]}</text>

          </g>
        </svg>
      </div>
    }


    const ph = this.state.phase;


    return(


//classe principale
        <div class="map" id="map" >

          {/* Gérer les différentes  phases  */}


          <div class="phase">
            {ph===1 || ph===2 ? (
                <img alt="img" onClick={() => this.handlePhase()} class="playerPhasebtn" src={passerphase}/>
            ) : (
                <img alt="img" onClick={() =>this.handlePhase()} class="playerPhasebtn" src={passertour}/>
            )}
            <p>Phase: {this.state.explication_phase}</p>
          </div>






          {/* JOUEUR COURANT */}
          {/* A remplacer par le nombre de region posséder par le joueur courant */}
          <InfosPanel  key={this.state.arr_self}  ter={this.state.arr_self} />

          {/* A remplacer par le nombre de soldats posséder par le joueur courant modulo 10 */}
          <InfosPanelSoldats  key={this.state.arr_self_soldats}  soldats={this.state.arr_self_soldats} />





          {/* SVG */}
          {comp}





          {/* AUTRES JOUEURS */}
          {rows}



          {/* DIV INFOS */}
          <div class="current_turn"><h4>Tour: {this.state.current_player_name}</h4></div>



          {/* Quitter la partie */}

          <div class="info" >
            <button  onClick={() => this.handleClick_Quitter()} id="restart" class="restart">Quitter la partie</button>
          </div>


          <div className="timer-wrapper">

            {/*Animations pour la phase 1*/}
            <Popup
                open={this.state.isOpen}
                onOpen={this.handleOpen}
                position='top center'
                onClose={this.handleClose}
            >
              <ModalImage
                  small={character1}
                  large={character1}
                  hideDownload={true}
                  showRotate={false}
                  imageBackgroundColor={"rgba(255,255,255,0)"}
              />;

            </Popup>

            {/*Message d'erreur*/}
            <Popup
                open={this.state.Open}
                onOpen={this.handleOpen_err}
                position='top center'
                onClose={this.handleClose}
            >
              <p>{this.state.err}</p>
            </Popup>


            {/*Message notification*/}

            <Popup
                open={this.state.popOpen}
                onOpen={() => this.closenotif()}
                position='top center'
                //onClose={this.handleClose}
            >
              <p>{this.state.notif}</p>
            </Popup>




          </div>


        </div>

    );
  } }

export default withRouter(Map)
