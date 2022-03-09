
import  React  from 'react';
import * as Logique  from "./module_logique";

// Not focused phase
import normalPhaseArrow_1 from "./battle/normalphase1arrow.png"
import normalPhaseArrow_2 from "./battle/normalphase2arrow.png"

//  focused phase
import playerPhaseArrow_1 from "./battle/playerphase1arrow.png"
import playerPhaseArrow_3 from "./battle/playerphase3arrow.png"

// Passer la phase
import passerphase from "./battle/playerphasesuivant-bouton.png"

// Passer le tour 
import passertour from "./battle/playerfindutour-bouton.png"

import  Map from "./Map"


require("./phase_Button.css")



class Phase_button extends React.Component {
  constructor(props) {
    super(props);
 

    this.state = {
      count: props.count //phase
    };
  }
  

  //Gérer les clics sur les phases
  handlePhase=()=> {
    if (global.new_game_data.current_name === global.new_game_data.current_player){
      if (global.new_game_data.phase !== 0){
        global.new_game_data.phase = (global.new_game_data.phase + 1) % 3;
        console.log(global.new_game_data);
        var message3 = Logique.create_Message(0x70);
        console.log(message3);
      }
    }
    else {
      alert("Ce n'est pas ton tour")
    }
  };


  

  render() {




//etat initale 
  if(this.state.count === 0){return(

    <div class="header">
      <img alt="img" class="phase_1" src={normalPhaseArrow_1}/>
      <img alt="img" class="phase_2" src={normalPhaseArrow_1}/>
      <img  alt="img" class="phase_3" src={normalPhaseArrow_2}/>
      {/*<img alt="img" onClick={Map.handlePhase()} class="playerPhasebtn" src={passerphase}/>*/}

    </div>

  );
  }

// Première phase  
  else if(this.state.count === 1){return(

    <div class="header">
      <img alt="img" class="phase_1" src={playerPhaseArrow_1}/>
      <img alt="img" class="phase_2" src={normalPhaseArrow_1}/>
      <img  alt="img" class="phase_3" src={normalPhaseArrow_2}/>
      <img alt="img"  onClick={() => Map.handlePhase} class="playerPhasebtn" src={passerphase}  />
    </div>

  );
  }

  //Deuxième phase 
  else if(this.state.count === 2){return(
    <div class="header">
    <img alt="img" class="phase_1" src={normalPhaseArrow_1}/>
    <img alt="img" class="phase_2" src={playerPhaseArrow_1}/>
    <img alt="img" class="phase_3" src={normalPhaseArrow_2}/> 
    <img alt="img" onClick={() => Map.handlePhase} class="playerPhasebtn" src={passerphase}  />
    </div>
    );
  }


  //Troisième phase 
  else if(this.state.count === 3){return(
    <div class="header">
    <img alt="img" class="phase_1" src={normalPhaseArrow_1}/>
    <img alt="img" class="phase_2" src={normalPhaseArrow_1}/>
    <img alt="img" class="phase_3" src={playerPhaseArrow_3}/>  
    <img alt="img" onClick={() => Map.handlePhase} class="playerPhasebtn" src={passertour} />
    </div>
  );
}}}

  export default Phase_button;