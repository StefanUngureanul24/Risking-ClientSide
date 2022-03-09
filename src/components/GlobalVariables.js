import {Game_data,Lobby} from "./module_logique";
import * as Logique  from "./module_logique";
import mapstream from "../1";

global.new_game_data = new Game_data()
global.lobby = new Lobby()
global.info_phase = [-1,-1];
//global.lobby.current_JWT = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIiLCJzdWIiOiIwMTAxMDEwIiwibmFtZSI6IkVyaWMiLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MjAwMDAwMDAwMCwibmJmIjoxMjE2MjM5MDIyLCJqdGkiOiI1NDU0NTQ1ODQifQ.baME654L6mlolBOLI7mf0Hu0M8QRAMLMYmA3dq2CP6xd7PGzVvkEV_drf6w6Wo07or73wCjGJjBJDII7C8KdnMN7xy54l_VMQhIcYI9IuoN2yJ7GwYUxg1hYj3VuUOjo6OYjtH4oygOeyoGBJ3cruNOWZflZCUpxVK7LEiQqDenfNT9TixXuggGVcMA94U3KSUeyIGi-ssUsMvxUn8ubORT6S1epfP1VKYtqvIcT6ZpcuBjWA77dmy6qG6K1HOpQ8lesm69CC9a84pRtefnXpDNngmD8ilfsJdCD2fVbYwMCCaaA_Cl8aJcL0rdyx7jNlPXy7riz1528Lu-V6-X19sDbRSX54kYJcxv8z9ZYTiNr61CJ03iIH3Z4e1yJp4XUYgCRY5epMMUXIW4UhLPVOBEkkDwP8P9WpGQe2leq9edc8wfO_mgV0IW-_R5facWE27b2kAlTXu763rGeLuULSEQhePoM4DOBXWkmc5G2uujlwZamrh5a2BwJT2GrmBHvPF3PhbkIql2m7ux-Dk2aeRlqfStvPB9XQSYlKbT4brVKoxbqA_cy5UbjA4sVtWj2SQ1UdQV3TeaGpIxWlASYioo6klpMnlCFy3MyMLc0QRFQdRFBS5Nz-xeuglzHyo8ARNJXJlRFs_YiqFuswOTR0In_efoK5L6ZZInY8EO73xA"
global.websocket = new WebSocket("wss://wssrisking.zefresk.com:42424");
global.websocket.binaryType = "arraybuffer";

global.websocket.onopen = function(e) {
    console.log("connected")
  };
  
  global.websocket.onmessage = function(event) {
    //alert(`[message] Data received from server: ${event.data}`);
    console.log(event.data)
    var buffer = new Uint8Array(event.data)
    Logique.parser(buffer, global.new_game_data, global.lobby,mapstream)
  };
  
  global.websocket.onclose = function(event) {
    if (event.wasClean) {
      alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    } else {
      // e.g. server process killed or network down
      // event.code is usually 1006 in this case
      alert('[close] Connection died');
    }
    console.log(event.code)
  };
  
  global.websocket.onerror = function(error) {
    alert(`[error] ${error.message}`);
  }