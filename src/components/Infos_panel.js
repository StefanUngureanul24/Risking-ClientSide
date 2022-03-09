import  React  from 'react';



//importer les région
import hp0 from "./battle/player_ally_profil.png"
import hp1 from "./battle/hp1.png"
import hp2 from "./battle/hp2.png"
import hp3 from "./battle/hp3.png"
import hp4 from "./battle/hp4.png"
import hp5 from "./battle/hp5.png"
import hp6 from "./battle/hp6.png"
import hp7 from "./battle/hp7.png"
import hp8 from "./battle/hp8.png"


 class Infos_panel extends React.Component {
    constructor(props) {
      super(props);
     
      this.state = {
        territoire_nb: props.ter 
      };
      global.Infos_panel=this;
    }   
    

render(){
    if(this.state.territoire_nb === 0){
    return (
    <div>
            
             <img   alt="img" class="playerPhasebtn_other" src={hp0}/>
    </div>
    )}

    else if(this.state.territoire_nb === 1){
        return (
        <div>
            
            <img   alt="img" class="playerPhasebtn_other" src={hp1}/>

        </div>
        )}

    else if(this.state.territoire_nb === 2){
            return (
            <div>
                
                <img   alt="img" class="playerPhasebtn_other" src={hp2}/>
            </div>
            )}

    else if(this.state.territoire_nb === 3){
                return (
                <div>
                    <img  alt="img"  class="playerPhasebtn_other" src={hp3}/>
                </div>
                )}


     else if(this.state.territoire_nb === 4){
                    return (
                    <div>
                        
                        <img  alt="img" class="playerPhasebtn_other" src={hp4}/>
                    </div>
                    )}

    else if(this.state.territoire_nb === 5){
                        return (
                        <div>
                            
                            <img  alt="img" class="playerPhasebtn_other" src={hp5}/>
                        </div>
                        )}
    
    else if(this.state.territoire_nb === 6){
                            return (
                            <div>
                                
                                <img  alt="img" class="playerPhasebtn_other" src={hp6}/>
                            </div>
                            )}

    else if(this.state.territoire_nb === 7){
                                return (
                                <div>
                                    
                                    <img   alt="img" class="playerPhasebtn_other" src={hp7}/>
                                </div>
                                )}

    else if(this.state.territoire_nb === 8){
                                    return (
                                    <div>
                                        <img  alt="img" class="playerPhasebtn_other" src={hp8}/>
                                    </div>
                                    )}


}}


export default Infos_panel;
