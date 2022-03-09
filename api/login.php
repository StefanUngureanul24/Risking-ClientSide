<?php

require_once '_std_header.php';
require_once 'utils.php';
require_once 'config.php';
require_once 'jwt.php';

//
// CONNEXION
//      - Si réussit renvoie un JWT
//      - Sinon une erreur

$lang = [
    "fr" => [
        "req" => "Champs requis incomplets.",
        "lenpwd" => "Doit contenir 8 caractères",
        "lenps" => "Doit contenir 5 caractères",
        "faux" => "Le nom de compte ou mot de passe est faux !",
    ],
    
];

$words = $lang["fr"];
$pseudo  = get_var($_POST,'gamertag');
$pwd = get_var($_POST, 'pwd');


if ( $pwd == '' || $pseudo == '')
    die($words["req"]);
    
if(strlen($pwd) <8)
    die($words["lenpwd"]);

if(strlen($pseudo) <5)
    die($words["lenps"]);


$prepg = $pdo->prepare('SELECT HEX(id) FROM user WHERE gamertag = :nom  AND password =:mdp');
$prepg->bindValue(":nom", $pseudo);
$prepg->bindValue(":mdp", hash('sha3-512' , $pwd));
$prepg->execute();
$vid = $prepg->fetch(PDO::FETCH_ASSOC);
//var_dump($vid);
if (!$vid)
    die($words["faux"]);
//var_dump($vid);
$vid = $vid["HEX(id)"];
$prepg->closeCursor();

create_logged_token($vid,$pseudo );
echo "OK";
?>