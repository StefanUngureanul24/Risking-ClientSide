import  React  from 'react';
//importer map

import hp1 from "./battle/hp1.png"
import hp2 from "./battle/hp2.png"
import hp3 from "./battle/hp3.png"
import hp4 from "./battle/hp4.png"
import hp5 from "./battle/hp5.png"
import hp6 from "./battle/hp6.png"
import hp7 from "./battle/hp7.png"
import hp8 from "./battle/hp8.png"





class Joueurs extends React.Component {
    constructor(props) {
      super(props);
     
      this.state = {
        territoire_nb: props.ter 
      };
    }   
    

render(){
    if(this.state.territoire_nb === 0){
    return (
    <div>
            
             <img  alt="img" class="playerPhasebtn_j" src={hp1}/>
    </div>
    )}

    else if(this.state.territoire_nb === 1){
        return (
        <div>
            
            <img alt="img"  class="playerPhasebtn_j" src={hp1}/>
        </div>
        )}

    else if(this.state.territoire_nb === 2){
            return (
            <div>
                
                <img  alt="img" class="playerPhasebtn_j" src={hp2}/>
            </div>
            )}

    else if(this.state.territoire_nb === 3){
                return (
                <div>
                    
                    <img  alt="img" class="playerPhasebtn_j" src={hp3}/>
                </div>
                )}


     else if(this.state.territoire_nb === 4){
                    return (
                    <div>
                        
                        <img alt="img"  class="playerPhasebtn_j" src={hp4}/>
                    </div>
                    )}
                    else if(this.state.territoire_nb === 5){
                        return (
                        <div>
                            
                            <img  alt="img" class="playerPhasebtn_j" src={hp5}/>
                        </div>
                        )}
    
    else if(this.state.territoire_nb === 6){
                            return (
                            <div>
                                
                                <img  alt="img" class="playerPhasebtn_j" src={hp6}/>
                            </div>
                            )}

    else if(this.state.territoire_nb === 7){
                                return (
                                <div>
                                    
                                    <img alt="img"  class="playerPhasebtn_j" src={hp7}/>
                                </div>
                                )}

    else if(this.state.territoire_nb === 8){
                                    return (
                                    <div>
                                        
                                        <img  alt="img" class="playerPhasebtn_j" src={hp8}/>
                                    </div>
                                    )}












}}




export default Joueurs;
