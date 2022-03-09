<?php

require_once '_std_header.php';
require_once 'utils.php';
require_once 'config.php';
require_once 'jwt.php';

//var_dump($_POST);
$lang = [
    "fr" => [
        "req" => "Champs requis incomplets.",
        "gamertag" => "Username déjà utilisée.",
        "err" => "Impossible d'enregistrer le compte.",
        "lenps" => "Doit contenir 5 caractères"
    ],
    
];
$words = $lang["fr"];
$pseudo  = get_var($_POST,'gamertag');

// checks
if ($pseudo == '')
die($words["req"]);

if(strlen($pseudo) <5)
die($words["lenps"]);



//verifier si le gamertag existe ou pas
$prepg = $pdo->prepare('SELECT id FROM user WHERE gamertag = :nom ');
$prepg->bindValue(":nom", $pseudo);
$prepg->execute();
$vid = $prepg->fetch(PDO::FETCH_ASSOC);
if ($vid !='')
die($words["gamertag"]);
$prepg->closeCursor();



$uid = random_bytes(16);

// tout est bon donc on creer le compte ici
$prep_adduser = $pdo->prepare('INSERT INTO user (id,gamertag,password,email) VALUES (:uid, :pseudo, NULL, NULL)');
if (!$prep_adduser->execute(array(
    ':uid' => $uid,
    ':pseudo'=>$pseudo)))
    die($words["err"]);    


$prepg = $pdo->prepare('SELECT HEX(id) FROM user WHERE gamertag = :nom');
$prepg->bindValue(":nom", $pseudo);
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