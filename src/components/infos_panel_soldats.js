import  React  from 'react';


//importer les soldats
import card0 from "./battle/player_ally_profil.png"
import card1 from "./battle/card1.png"
import card2 from "./battle/card2.png"
import card3 from "./battle/card3.png"
import card4 from "./battle/card4.png"
import card5 from "./battle/card5.png"





 class Infos_panel_soldats extends React.Component {
    constructor(props) {
      super(props);
     
      this.state = {
        soldats: props.soldats 
      };
      global.Infos_panel=this;
    }   
    

render(){
    if(this.state.soldats === 0){
    return (
    <div>
            
             <img   alt="img" class="playerPhasebtn_other" src={card0}/>
    </div>
    )}

    else if(this.state.soldats === 1){
        return (
        <div>
                        <img   alt="img" class="playerPhasebtn_other_soldats" src={card1}/>

        </div>
        )}

    else if(this.state.soldats === 2){
            return (
            <div>
                        <img   alt="img" class="playerPhasebtn_other_soldats" src={card2}/>
            </div>
            )}

    else if(this.state.soldats === 3){
                return (
                <div>
                        <img   alt="img" class="playerPhasebtn_other_soldats" src={card3}/>
                </div>
                )}


     else if(this.state.soldats === 4){
                    return (
                    <div>
                        
                        <img   alt="img" class="playerPhasebtn_other_soldats" src={card4}/>
                    </div>
                    )}

    else if(this.state.soldats === 5){
                        return (
                        <div>
                            
                            <img   alt="img" class="playerPhasebtn_other_soldats" src={card5}/>
                        </div>
                        )}
    
}}


export default Infos_panel_soldats;
