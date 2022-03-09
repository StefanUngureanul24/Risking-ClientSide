import React from "react";

export default class SettingsTime extends React.Component
{
    duration(){
        window.lobby_param.time = parseInt(document.getElementById("duration_time").value,10)
    }

    player(){
        window.lobby_param.nb_p = parseInt(document.getElementById("numbers_players").value,10)
    }

    render()
    {
        return (
            <div className="settingsContainerLobby">
                <p>Duration (seconds)</p>
                <input onChange={() =>this.duration()} id="duration_time" className="inputLobbyTime" type="number" name="time" step="30" min="30" max="180" defaultValue="30" />
            
                <p>Number of Players</p>
                <input onChange={() =>this.player()} id="numbers_players" className="inputLobbyTime" type="number" name="players" step="1" min="2" max="6" defaultValue="6"></input>
            </div>
        );
    }
}
