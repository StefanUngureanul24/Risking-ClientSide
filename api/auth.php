<?php

/*
   Gère l'authentification d'un utilisateur.
        - Si elle réussie on envoie un JWT au format:
            JWT_<TYPE>\n
            <JWT>
        - Sinon rien
*/

require_once  '_std_header.php';
require_once 'jwt.php';
require_once 'utils.php';

$lang = [
    "fr" => [
        "?" => "???",
        "pos" => "Données fournies invalides.",
        "unk" => "Email ou mot de passe erronés."
    ],
    "en" => [
        "?" => "???",
        "pos" => "Data sent are invalid.",
        "unk" => "Bad email or password."
    ]
];
$words = $lang[$cur_lg];

//var_dump($_POST);
$asking = get_var($_POST, 'asking');

if ($asking == '')
    die($words["?"]);

if ($asking == 'login') {
    $userid = get_var($_POST, 'userid');
    $password = get_var($_POST, 'password');
    $remember = get_var($_POST, 'remember');
    if ($userid == '' || $password == '') {
        die($words["pos"]);
    }

    // recherche dans la base
    $req = 'SELECT userid, password FROM users WHERE userid=:id AND password=:pwd';
    $prep = $pdo->prepare($req);
    $prep->bindValue('id', $userid);
    $prep->bindValue(':pwd', $password);
    $prep->execute();

    $ret = $prep->fetch(PDO::FETCH_ASSOC);

    // check
    if ($ret == false) {
        die($words["unk"]);
    }

    create_logged_token($userid);
    echo "JWT\n";

    // Création d'un JWT pour se souvenir
    if ($remember == "on") {
        $jwt = create_rem_token($userid);
        print_r($jwt);
    }
} elseif ($asking == "auto") { // connexion from jwt_rem
    $jwt = get_var($_POST, 'jwt');
    $jwt_dec = (array)JWT::decode($jwt, $rs_pub, array('RS256'));

    create_logged_token($jwt_dec["id"]);
    echo "JWT\n";
} elseif ($asking == "deco") { //deconnexion
    session_start();
    setcookie("JWT_logged", "", ['expires' => time() - 3600, 'samesite' => 'Strict']);
    unset($_COOKIE["JWT_logged"]);
    unset($_SESSION["connected"]);
    echo "OK";
} else {
    die($words["?"]);
}
?>

