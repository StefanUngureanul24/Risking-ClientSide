<?php

require_once '_std_header.php';
require_once 'utils.php';
require_once 'config.php';
require_once 'jwt.php';

/*
   Crée un nouveau compte
        - Si réussite renvoie OK
        - Sinon une erreur
*/
//var_dump($_POST);
$lang = [
    "fr" => [
        "req" => "Champs requis incomplets.",
        "pas" => "Mots de passe différents.",
        "gamertag" => "Username déjà utilisée",
        "alr" => "Email déjà utilisé.",
        "err" => "Impossible d'enregistrer le compte.",
        "lenpwd" => "Doit contenir 8 caractères",
        "lenps" => "Doit contenir 5 caractères minimum"
    ],
    
];
$words = $lang["fr"];
$email = get_var($_POST, 'email');
$pseudo  = get_var($_POST,'gamertag');
$pwd = get_var($_POST, 'pwd');
$pwdr = get_var($_POST, 'pwdr');

// checks
if ($email == '' || $pwd == '' | $pwdr == '' || $pseudo == '')
die($words["req"]);

if ($pwd != $pwdr)
die($words["pas"]);
    
if(strlen($pwd) <8)
die($words["lenpwd"]);

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

//verifier si l'email est dejà utilisé ou pas
$prepemail = $pdo->prepare('SELECT id FROM user WHERE email = :mail');
$prepemail->bindValue(":mail", $email);
$prepemail->execute();
$uid = $prepemail->fetch(PDO::FETCH_ASSOC);
if ($uid != '')
die($words["alr"]);
$prepemail->closeCursor();


$uid = random_bytes(16);

// tout est bon
$prep_adduser = $pdo->prepare('INSERT INTO user (id,gamertag,password,email) VALUES (:uid, :pseudo, :pwd, :mail)');
//echo hash('sha3-512' , $pwd);
if (!$prep_adduser->execute(array(
    ':mail' => $email,
    ':uid' => $uid,
    ':pwd' => hash('sha3-512' , $pwd),
    ':pseudo'=>$pseudo)))
    die($words["err"]);

// conversion uid en hexa
/*$chars = array_map("chr", $uid);
$bin = join($chars);
$hex = bin2hex($bin);*/
create_logged_token(bin2hex($uid), $pseudo);

echo "OK";
?>
