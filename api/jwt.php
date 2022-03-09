<?php

require_once '_std_header.php';

/* clés */
$path_pri = $_SERVER['DOCUMENT_ROOT'] . "/certs/pri.key";
$path_cert = $_SERVER['DOCUMENT_ROOT'] . "/certs/certificate.cert";
$fpri = fopen($path_pri, "r") or die("Unable to open file: " . $path_pri);
$rs_pri = fread($fpri, filesize($path_pri));
$fcert = fopen($path_cert, "r");
$cert = fread($fcert, filesize($path_cert));
$pub = openssl_pkey_get_public($cert);
$pub_data = openssl_pkey_get_details($pub);
$rs_pub = $pub_data['key'];

/*var_dump($rs_pri, $rs_pub);*/

require '../vendor/autoload.php';

use \Firebase\JWT\JWT; /* REQUIS */

function get_logged_token() {
    global $rs_pub;
    if (!isset($_COOKIE["JWT_logged"]))
        return null;

    try {
        $jwt = $_COOKIE["JWT_logged"];
        return (array) JWT::decode($jwt, $rs_pub, array("RS256"));
    } catch (Exception $e) {
        return null;
    }
}

function create_token($uid, $seconds, $gamertag) {
    //var_dump($uid, $seconds, $gamertag);
    global $rs_pri;
    // Création d'un cookie
    $iat = time();
    $exp = $iat + $seconds;
    $token_payload = [
        'iss' => 'risk.zefresk.com',
        'name' =>$gamertag,
        'sub' => $uid,
        'id' => $uid,
        'iat' => $iat,
        'nbf' => $iat,
        'exp' => $exp, // 12h
        'jti' => base64_encode(random_bytes(8))
    ];
    JWT::$leeway = 60;
    return JWT::encode($token_payload, $rs_pri, 'RS256');
}

function create_logged_token($userid,$gamertag) {
    $jwt = create_token($userid, 60*60*12, $gamertag);
    setcookie("JWT_logged", $jwt, ['expires' => time() + 60*60*12, 'samesite' => 'Strict', 'path' => '/']);
    $_SESSION["connected"] = true;
}

function create_rem_token($userid) {
    return create_token($userid, 60*60*24*90, "remember");
}
?>
