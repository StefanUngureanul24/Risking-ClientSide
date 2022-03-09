import React from 'react';
import LogoRisking from '../components/templates/logo.png';
//import Profile from '../components/templates/profile.png';
import {Link} from "react-router-dom";
import  "./GlobalVariables"
//import Map from '../templates/map.png';
import * as Logique  from "./module_logique"
import { withRouter } from 'react-router-dom';
//import mapstream from '../1';


/*
import Australia from '../templates/australia.png';
import Europe from '../templates/europe.png';
import Mexico from '../templates/mexico.png';
*/


//import SettingsTime from '../components/SettingsTime'
//import SettingsPic from '../templates/settings.png';
import JoinGame from '../components/templates/joingame.png';
import Back from '../components/templates/back.png';

require('../components/lobby.css');

class Lobby extends React.Component {
    
    constructor() {
        super();
        /*this.state = {
            showSettings: false,
            
        };
        this.displaySettings = this.displaySettings.bind(this);*/
       
        this.state = { 
            go: false,
            listPlayers: [],
            numberPlayers: 0,
            numberPlayermax:6,
        }
    }
    


    join() {
        var message = Logique.create_Message(0x20)
        console.log(message)
        global.websocket.send(message)
    }
    
    quit() {
        Logique.clear_lobby(global.lobby)
        var message = Logique.create_Message(0x15,global.lobby.current_player)
        console.log(message)
        global.websocket.send(message)
        //window.ws.send(message)
    }

    /*displaySettings(name) {
        switch(name) {
            case "showSettings":
                this.setState({ showSettings: !this.state.showSettings });
                break;
            default:
        }
    }*/
    
    change(){
        this.setState({go :global.new_game_data.go})
        const { history } = this.props;
        if(this.state.go === true){
           global.new_game_data.go = false;
           this.setState({go :false})
           history.push('/Map')
       }
    }   

    componentDidMount() {
        this.interval = setInterval(() =>  this.change(), 400);

        this.interval_2 = setInterval(() => this.setState({listPlayers: global.lobby.tab_Player_name}), 400);
        this.interval_3 = setInterval(() =>  this.setState({numberPlayers: global.lobby.nb_player}), 400);
        this.interval_4 = setInterval(() =>  this.setState({numberPlayermax: global.lobby.nb_player_max}), 400);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
        clearInterval(this.interval_2);
        clearInterval(this.interval_3);
        clearInterval(this.interval_4);
    }

    /*parse(){
        var message = new Uint8Array([0x21,74,111,104,110,32,68,111,101,0,74,111,104,110,32,68,111,101,0,1,10,0,2,10,0,1,10,0,2,10,0,1,10,0,2,10,0,1,10,0,2,10,0,1,10,0,2,10,0,1,10,0,2,10,0,1,10,0,2,10,0,1,10,0,2,10,0,1,10,0,2,10,0,1,10,0,2,10,0,1,10,0,2,10,0,1,10,0,2,10,0,1,10,0,2,10,0,1,10,0,2,10,0,1,10,0,2,10,0,1,10,0,2,10,0,1,10,0,2,10,0,1,10,0,2,10,0,1,10,0,2,10,0,1,10,0,2,10,0,1,10,0,2,10,0,1,10,0,2,10,0,1,10,0,2,10,0,1,10,0,2,10,0])
        Logique.parser(message,global.new_game_data,global.lobby, mapstream)
    }*/

    render() {
        //const { showSettings } = this.state;
        //{ showSettings && <SettingsTime /> }
        /*<div className="mapsLobby">
                    <p>Choose map :</p>
                    <img onClick={() =>this.map()}  src={Map} alt="Map1" />
                    <img src={Map} alt="Map2" />
                    <img src={Map} alt="Map3" />
                </div>*/
        return (
        <div>
            <div className="containerLobby">
                <img className="logoRiskingLobby" src={LogoRisking} alt="Risking" />
                {/*<img /*onClick={() => this.displaySettings("showSettings") className="settingsLobby" src={SettingsPic} alt="Settings" />*/}
                <Link to="/Lobby_creation"><img onClick={() =>this.quit()} /*link to= "/Index"*/ className="backLobby" src={Back} alt="Go back" /></Link>

                <div className="infoLobby">
                    <div className="gameIDLobby">
                        <p>{global.lobby.room_Id32}</p>
                    </div>
                    <p className="multiplayerLobby">- Multiplayer -</p>
                    <p className="nbPlayersLobby"> {this.state.numberPlayers}/{this.state.numberPlayermax} Players</p>
                </div>
                <div className="containerLobbyPlayers">
                    <div className="containerLobbyItem">
                        <div className="Item1">
                            <p> {this.state.listPlayers[0]} </p>
                        </div>
                    </div>
                    <div className="containerLobbyItem">
                        <div className="Item2">
                            <p> {this.state.listPlayers[1]} </p>
                        </div>
                    </div>
                    <div className="containerLobbyItem">
                        <div className="Item3">
                            <p> {this.state.listPlayers[2]} </p>
                        </div>
                    </div>
                    <div className="containerLobbyItem">
                        <div className="Item4">
                            <p> {this.state.listPlayers[3]} </p>
                        </div>
                    </div>
                    <div className="containerLobbyItem">
                        <div className="Item5">
                            <p> {this.state.listPlayers[4]} </p>
                        </div>
                    </div>
                    <div className="containerLobbyItem">
                        <div className="Item6">
                            <p> {this.state.listPlayers[5]} </p>
                        </div>
                    </div>            
                </div>
                <img onClick={() =>this.join()} className="joingameLobby" src={JoinGame} alt="Join Game" />
            </div>       
            {/*<Link  to="/Map" onClick={() => this.parse()}> (temp) page suivante </Link>*/}
   
        </div>
        );
    }
}

export default withRouter(Lobby)