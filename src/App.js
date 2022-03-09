import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Inscription from './components/Inscription';
import Map  from './components/Map'
import {BrowserRouter as Router, Route} from 'react-router-dom';
//import test from './components/phase_button'
//import {Game_data,Lobby} from "./components/module_logique";
//import * as Logique  from "./components/module_logique";
//import mapstream from "./1.txt";
import Create_lobby from './components/create_lobby' ;
import Parametre_lobby from './components/parametre' ;
import Lobby_interface from './components/Lobby';
import Signup from "./components/Signup";
import Login from "./components/Login";
import Index from "./components/Index";
import  "./components/GlobalVariables";
import ModaleRegle from "./components/Modale";
import CookiesFooter from "./components/CookiesFooter";

/*window.lobby = new Lobby()
window.lobby.current_JWT = "abcd"
window.new_game_data = new Game_data()
window.info_phase = [-1,-1];

window.websocket = new WebSocket("wss://wssrisking.zefresk.com:42424");
window.websocket.binaryType = "arraybuffer";

window.websocket.onopen = function(e) {
  console.log("connected")
};

window.websocket.onmessage = function(event) {
  //alert(`[message] Data received from server: ${event.data}`);
  console.log(event.data)
  var buffer = new Uint8Array(event.data)
  Logique.parser(buffer, window.new_game_data, window.lobby,mapstream)
};

window.websocket.onclose = function(event) {
  if (event.wasClean) {
    alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
  } else {
    // e.g. server process killed or network down
    // event.code is usually 1006 in this case
    alert('[close] Connection died');
  }
};

window.websocket.onerror = function(error) {
  alert(`[error] ${error.message}`);
}
*/

function App() {
  return (
    <Router>
    <div className="App">
      <div className="container">
        <div className="row justify-content-center ">
        <Route exact path="/" component={Index}/>
        <Route exact path="/Inscription" component={Inscription}/>
        <Route exact path="/Map" component={Map}/>
        <Route exact path="/Lobby_creation" component={Create_lobby} />
        <Route exact path="/Lobby_parametre" component={Parametre_lobby} />
	      <Route exact path="/Lobby_interface" component={Lobby_interface} />
        <Route exact path="/login" component={Login} />
	      <Route exact path="/signup" component={Signup} />
        </div>
      </div>
      <div className ="Btn_regle">
      <ModaleRegle></ModaleRegle>
      </div>
      <CookiesFooter/>
    </div>

    </Router>
  );
}

export default App;
