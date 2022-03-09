import React from "react";
import ReactDOM from "react-dom";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

import "./Timer.css";

const renderTime = ({ remainingTime }) => {
  if (remainingTime === 0) {
    return <div className="timer">Trop tard...</div>;
  }
  return (
    <div className="timer">
      <div className="text">Jouez</div>
      <div className="value">{remainingTime}</div>
      <div className="text">secondes</div>
    </div>
  );
};




function Timer() {
  return (
    
      <div className="timer-wrapper">
        <CountdownCircleTimer
          isPlaying
          duration={10}
          colors={[["#004777", 0.33], ["#F7B801", 0.33], ["#A30000"]]}
          onComplete={() => [true, 1000]}
        >
          {renderTime}
        </CountdownCircleTimer>
      </div>
    
  );
}

export default Timer;
