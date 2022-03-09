import Modal from 'react-bootstrap/Modal'
import React, { useState } from "react";
import Button from 'react-bootstrap/Button';


require('./Modale.css');
function ModaleRegle() {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
      <>
        <Button variant="primary" onClick={handleShow} className="regle">
          Règles du jeu
        </Button>
  
        <Modal show={show} onHide={handleClose} animation={false}>
          <Modal.Header>
            <Modal.Title>Règles de Risking !</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            - 2 à 6 joueurs sur une carte <br/><br/>
            - Les territoires de la carte sont répartis entre les joueurs, aléatoirement<br/><br/>
            - Chaque joueur a un certain nombre d’unités (dépend du nombre de joueurs et de la carte) qui sont posés aléatoirement ou non sur leurs territoires <br/><br/>
            - Au début du tour le joueur reçoit des unités à placer sur ses territoires :<br/><br/>
                - S’il possède un continent en entier il reçoit des unités en plus<br/>
                - Il reçoit aussi son nombre de territoires possédés divisé par 3, d’unités <br/><br/>
            - Une fois les unités placées, il peut attaquer les territoires des autres joueurs adjacents à ces territoires<br/><br/>
                Une attaque se fait à 3 unités maximum, pour la défense par contre c’est 2 unités, si il y a plus d’unités qui attaquent ou défendent, on répète l’attaque jusqu’à la disparition d’un des 2 régiments<br/>
                On lance un dé pour chaque unité qui attaque et chaque unité qui défend, on compare les dés 1 à 1 et celui qui a le meilleur score reste vivant<br/><br/>
                Quand on compare les dés, on compare ensemble les 2 dés avec la plus grande valeur (par exemple, attaque : 6/2/4 et défense : 5/4, on a 6 supérieur à 5 donc l’attaquant gagne le premier combat et le défenseur perd une unité, 4 = 4 donc le défenseur gagne le deuxième combat et l’attaquant perd une unité)<br/><br/>
            - Si une attaque est remportée le territoire est récupéré et l’attaquant doit déposer au moins une unité sur le territoire conquis, puis peut continuer d’attaquer d’autres territoires<br/><br/>
            - Une fois les combats terminés, le joueur peut renforcer un territoire en déplaçant des unités sur un territoire adjacent, mais une seule fois par tour<br/><br/>
            - Ensuite on passe au tour du joueur suivant, jusqu’à qu’il ne reste plus qu’un seul joueur<br/><br/>
  </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  export default ModaleRegle;