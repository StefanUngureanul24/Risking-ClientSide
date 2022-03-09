import 'reactjs-popup/dist/index.css';
import * as bigintConversion from 'bigint-conversion'
import * as base32 from 'base32-encode'
import * as basedecode from 'base32-decode'
import * as smalltalk from 'smalltalk'


/*-----------------------------CLASSE DE BASE----------------------------------*/

/* classe de la partie*/
export class Game_data {
    constructor(){
        this.tab_Territory = [] //tableau de territoire 1 territoire = 1 objet class Territory
        this.tab_Player = [] //tableau de player 1 player = 1 objet class Player
        this.tab_Area = [] //tableau de Area 1 area = 1 objet class Area
        this.id_current_player = 0 //id du joueur local
        this.current_player = "" //tag du joueur local
        this.map_Id = 0 //identifiant de la map
        this.time_round = 0 //nombre de seconde dans un tour
        this.time_remaining = 0 //nombre de seconde restant dans le tour
        this.current_turn = -1 //id du joueur à qui c'est le tour
        this.current_name = "" //nom du joueur à qui c'est le tour
        this.t_toplace = 0 //troupe à placer
        this.winner = "" //nom du gagant
        this.file = new File_data("",0,0) //Fichier contenant les informations de la map(instance de la classe File_Data)
        this.dice_att = [] //Liste des attaques
        this.dice_def = [] //Liste des def
        this.phase = 0 //Liste des phases 0=Placement | 1=Attaque | 2=Transfert
        this.error = false //boolean popup
        this.mess_err = "" //message d'erreur à afficher
        this.notif = false
        this.mess_notif = ""
        this.go = false;
    }
}

export class Territory {
    constructor(id_territory,nb_soldier, id_user, tableau){
        this.id_territory = id_territory; //id du territoire
        this.nb_soldier = nb_soldier; //nombre de soldats dans le territoire
        this.id_user = id_user; //id du joueur à qui appartient le territoire
        this.tableau = tableau; //territoire adjacent
        this.done = false; //bool pour parcours en longeur
    }
}

export class Player{
    constructor(id_player, name, classement){
        this.id_player = id_player //id du joueur
        this.name = name //nom du joueur
        this.alive = true //status ingame
        this.classement = classement //classement général
        this.list_area = [] //liste des régions lui appartenant
        this.ter = [] //liste de territoires possédés
    }
}

export class Area {
    constructor(name, value){
        this.name = name //nom de la région
        this.value = value //valeur de la région
        this.territory = [] //id des territoires dans la région
    }
}

export class File_data {
    constructor(card_name, nb_territory, nb_terr_group){
        this.card_name = card_name //nom de la carte
        this.nb_territory = nb_territory //nombre de territoire de la map
        this.nb_terr_group = nb_terr_group //nombre de région de la map
        this.tab = [] //tableau d'adjacence
    }
}

export class Lobby {
    constructor(){
        this.tab_Player_name = [] //Liste des pseudos des joueurs
        this.room_Id = -1 //Id de la room
        this.room_Id32 = "" //Id de la room en 32
        this.master = "" //Chef du lobby
        this.current_JWT = "" //JWT du joueur
        this.nb_player = 0 //nombre de joueur dans le lobby 
        this.current_player = "" //nom du joueur local
        this.nb_player_max = 2;
    }
}


/*matrix tableau d'adjacence | list_obj tableau de territoire*/ 
/*Cree une instance de Territory et compléte son tableau de territoire adjacent pour chaque ligne dela matrix*/ 
//export function build(matrix, list_obj) {
export function build(game, list_obj) {    
    //console.log(window.new_game_data.file.nb_territory.valueOf())
    for (var j=0; j<game.file.nb_territory; j++){
        list_obj.push(new Territory(j,0,0,[]))
        for (var i=0; i<game.file.nb_territory; i++){
            
            if (game.file.tab[j][i] === 1){
            
                list_obj[j].tableau.push(i)
            }
        }
    }
}
/*game instance de la Classe Game_data*/
/*Reset toutes les informations dans l'instance*/ 
export function clear_game(game){
    game.tab_Territory = [] //tableau de territoire 1 territoire = 1 objet class Territory
    game.tab_Player = [] //tableau de player 1 player = 1 objet class Player
    game.tab_Area = [] //tableau de Area 1 area = 1 objet class Area
    game.id_current_player = 0 //id du joueur local
    //game.current_player = "" //tag du joueur local
    game.map_Id = 0 //identifiant de la map
    game.time_round = 0 //nombre de seconde dans un tour
    game.time_remaining = 0 //nombre de seconde restant dans le tour
    game.current_turn = -1 //id du joueur à qui c'est le tour
    game.current_name = "" //nom du joueur à qui c'est le tour
    game.t_toplace = 0 //troupe à placer
    game.winner = "" //nom du gagant
    game.file = new File_data("",0,0) //Fichier contenant les informations de la map(instance de la classe File_Data)
    game.dice_att = [] //Liste des attaques
    game.dice_def = [] //Liste des def
    game.phase = 0 //Liste des phases 0=Placement | 1=Attaque | 2=Transfert
    game.error = false //boolean popup
    game.mess_err = "" //message d'erreur à afficher
    game.notif = false
    game.mess_notif = ""
    game.go = false;
}

export function clear_lobby(lobby){
    lobby.tab_Player_name = [] //Liste des pseudos des joueurs
    lobby.room_Id = -1 //Id de la room
    lobby.room_Id32 = "" //Id de la room en 32
    lobby.master = "" //Chef du lobby
    //lobby.current_JWT = "" //JWT du joueur
    lobby.nb_player = 0 //nombre de joueur dans le lobby 
    //lobby.current_player = "" //nom du joueur local
    lobby.nb_player_max = 2
}

/*list_obj tableau de territoire | id_ter_1 indice de la case source | id_ter_2 indice de la case destination | numbers nombre de troupe*/ 
/*Tranferer dans joueur d'une case à l'autre*/ 
export function move_soldier(list_obj, id_ter_1, id_ter_2, numbers){
    
    if (numbers <= list_obj[id_ter_1].nb_soldier){
        list_obj[id_ter_1].nb_soldier -= numbers
        list_obj[id_ter_2].nb_soldier += numbers
    }
}

/*list_obj tableau de territoire | id_ter_1 indice de la case source | id_ter_2 indice de la case destination */ 
/*Parcours en longueur pour savoir si un territoire est joignalble*/
export function joinable(list_obj, id_ter_1, id_ter_2){

    list_obj[id_ter_1].done = true;
    if (list_obj[id_ter_1].tableau.indexOf(id_ter_2) !== -1){
        return true;
    }
    else {
        for (var i=0; i<list_obj[id_ter_1].tableau.length; i++){
            if (list_obj[list_obj[id_ter_1].tableau[i]].done === false){
                if (joinable(list_obj,list_obj[id_ter_1].tableau[i],id_ter_2) === true)
                    return true
            }
        }
    }
    return false
}

/*list_obj tableau de territoire | id_ter_1 indice de la case | numbers nombre de troupe*/
/*ajouter des soldats dans une case*/
export function add_soldier(list_obj, id_ter_1, numbers){ 
    if (typeof numbers === 'number' && numbers%1 === 0){
        if (numbers > 0){
            list_obj[id_ter_1].nb_soldier += numbers
        }
        else {
            if (Math.abs(numbers) <= list_obj[id_ter_1].nb_soldier){
                list_obj[id_ter_1].nb_soldier += numbers
            }
        }
    }
}

/*list_obj tableau de territoire | id_ter_1 indice de la case | id_new_user id du nouveau user*/
/*Changer le propriétaire du territoire*/
export function change_owner(list_obj, id_ter, id_new_user){
    if (typeof id_new_user === 'number' && id_new_user%1 === 0){
        if (id_new_user >= 0){
            list_obj[id_ter].id_user = id_new_user
        }
    }
}

/*player_name liste de prénom des joueurs | list_player liste d'instance des joueurs | classement classement des joueurs*/
/*Pour chaque nom dans la liste crée une instance de Player et le rajoute au tableau*/
export function creat_players(player_name, game){
    for (var i=0; i<player_name.length; i++){
        if (player_name[i] === game.current_player){
            game.id_current_player = i
        }
        game.tab_Player.push(new Player(i,player_name[i]))
    }
}

/*list_player liste d'instance des joueurs | name nom d'un joueur*/
/*ajouter un joueur au tableau d'instance de Player*/
export function add_player(list_player, name){
    list_player.push(new Player(list_player.length, name))
}

/*list_player liste d'instance des joueurs | id_intable id du joueur*/
/*Tue un joueur*/
export function kill_player(list_player, id_intable){
    list_player[id_intable].alive = false;
}

/*game Instance de la classe Game_data | name nom d'un joueur*/
/*retourne l'id du joueur en fonction de son nom*/
export function get_player_id(name, game){
    var id_play
    for (var i=0; i<game.tab_Player.length; i++){
        if (game.tab_Player[i].name === name){
            id_play = i
            break;
        }
    }
    return id_play
}

/*message message recu*/
/*retourne la liste de nom sous forme de string à partir d'un Uint8array contenant les noms*/
export function get_player(message){

    var id1 = 0
    var name
    var player = { name: [], ind:0 }
    for (var i=0; i<message.length; i++){
        if (message[i] === 0) {
            name = message.slice(id1,i)
            var temp = new TextDecoder("utf-8").decode(name)
            if (temp.match(/[a-z]/i)){
                //console.log(temp)
                player.name.push(temp)
                if (i !== message.length-1){
                    id1 = i+1
                    i++
                }
            }
            else 
                break;
        }
    }
    player.ind = id1;
    return player
}

/*game Instance de la classe Game_data */
/*Creer les régions en fonction des informations dans le file*/
export function create_Area(game){
    for (var i=0; i<game.file.nb_terr_group; i++){
        game.tab_Area.push(new Area(" ", 0))
    }
}

/*terr_id id du territoire | game Instance de la classe Game_data */
/*retourne l'id de la region auquel appartient le territoire*/
export function get_area_id(terr_id, game){
    for (var i = 0; i<game.tab_Area.length; i++){
        if (game.tab_Area[i].territory.indexOf(terr_id) >= 0)
            return i
    }
}

/*id_case identifiant de la case | game Instance de la classe Game_data | id_player identifiant du joueur*/
/*verifie si le joueur possède tous les territoires d'une région et si oui rajoute la région dans sa liste de région*/
export function verif_area_player(game,id_case,id_player){
    var id_area = get_area_id(id_case,game)

    var barr = 0;

    for (var i=0; i<game.tab_Area[id_area].territory.length; i++){
        if (game.tab_Territory[game.tab_Area[id_area].territory[i]].id_user === id_player){
            barr ++;
            if (barr === game.tab_Area[id_area].territory.length){
                if (game.tab_Player[id_player].list_area.indexOf(id_area) === -1){
                    game.tab_Player[id_player].list_area.push(id_area)
                }
            }
        }
    }
}


/*game Instance de la classe Game_data | origin id case attanquant | destination id case defenseur | result resultat du fight | a_lost nb troupe perdu en attaque | d_lost nb troupe perdu en defense*/
/*effectue l'attaque demandé*/
export function attack(game, origin, destination , result, a_lost, d_lost){

    var attacker = game.tab_Territory[origin].id_user
    var defenser = game.tab_Territory[destination].id_user
    game.tab_Territory[origin].nb_soldier -= a_lost
    game.tab_Territory[destination].nb_soldier -= d_lost

    if (result === 1){
        battle_victory(game,game.tab_Player[attacker].name); //Fonction pour avertir de la victoire
        change_owner(game.tab_Territory,destination,attacker)
        game.tab_Territory[origin].nb_soldier--
        game.tab_Territory[destination].nb_soldier = 1
        game.tab_Player[attacker].ter.push(destination.toString())
        var inde = game.tab_Player[defenser].ter.indexOf(destination.toString())
        if (inde > -1){
            game.tab_Player[defenser].ter.splice(inde, 1)
        }
        verif_area_player(game,destination,attacker)
    }   
    else if (result === 0){
        //battle_victory(game.tab_Territory[destination].id_user); 
    }

}

/*str string*/ 
/*return l'indice du premier \n du string*/
export function line_skip(str){
    for (var i=0; i<str.length; i++){
        if (str[i] === "\n")
            return i;
    }
}

/*test nom du flux apres import | game instance de Game_data*/ 
/*extrait les informations du fichier txt*/
export async function test_txt(test,game,attrib){

    return await fetch(test,game)
        .then(stream => stream.text())
        .then(text => {
            //console.log(text)
            var text_id = line_skip(text)
            game.file.card_name = text.slice(0,text_id)
            
            var rest = text.slice(text_id+1)
            text_id = line_skip(rest)
            game.file.nb_territory = parseInt(rest.slice(0,text_id),10)
           
            rest = rest.slice(text_id+1)
            text_id = line_skip(rest)
            game.file.nb_terr_group = parseInt(rest.slice(0,text_id),10)
            
            create_Area(game)
        
            for (var i=0; i<game.file.nb_terr_group; i++){
            
                rest = rest.slice(text_id+1)
                text_id = line_skip(rest)
                game.tab_Area[i].value = parseInt(rest.slice(0,text_id),10)
            }

            rest = rest.slice(text_id+1)
            text_id = line_skip(rest)
        
            
            for (var k=0; k<game.file.nb_terr_group; k++){
               
                var temporary = rest.slice(0,text_id)

                var nums = temporary.match(/\d+/g)
                
                for (var j=0; j<nums.length; j++){
                    game.tab_Area[k].territory.push(parseInt(nums[j],10))
                }
               
                rest = rest.slice(text_id+1)
                text_id = line_skip(rest)
            }

            for (var x=0; x<game.file.nb_terr_group; x++){
            
                game.tab_Area[x].name = rest.slice(0,text_id)
                rest = rest.slice(text_id+1)
                text_id = line_skip(rest)
            }

            for (var a=0; a<game.file.nb_territory; a++)
                game.file.tab[a] = new Array(game.file.nb_territory)
            
            for (var b=0; b<game.file.nb_territory; b++) {
            
                var line = rest.slice (0,text_id)
                var adja = line.match(/\d/g)
                
                for (var h=0; h<adja.length; h++){
                    adja[h] = parseInt(adja[h],10)
                }

                game.file.tab[b] = adja

                rest = rest.slice(text_id+1)
                text_id = line_skip(rest)
            }

            build(game, game.tab_Territory)
            //console.log(window.new_game_data.file.tab[0])

            attribution(attrib,game)
            game.go = true;
            //console.log(game.tab_Player[0].ter)
        })

        .catch(function(error) {
            console.log(error);
        });  
    
}

export function tab_nb(game){
    var tab = []
    
    for (var i=0; i<game.tab_Territory.length; i++){
        
        tab.push(game.tab_Territory[i].nb_soldier)
    }
    
    return tab;
}

export function map_repart(game){
    var tab = []

    for (var i=0; i<game.tab_Player.length; i++){
        var obj = {
            id: game.tab_Player[i].name,
            ter: game.tab_Player[i].ter
        }
        tab.push(obj)
    }

    if (tab.length < 6){
        while (tab.length !== 6){
            var empty = {
                id: "player",
                ter: []
            }
            tab.push(empty)
        }
    }

    return tab
}

export function nb_soldat_total(game){
    var obj = {
        tab: [],
        id:-1
    }

    for(var i=0; i<game.tab_Player.length; i++){
        if (game.tab_Player[i].name === game.current_player){
            obj.id = i;
        }
        var somme;
        for(var j=0; j<game.tab_Player[i].ter.length; j++){
            somme += game.tab_Territory[j].nb_soldier
        }
        obj.tab.push(somme%10)
    }

    return obj
}

/*informe de la reussite de la bataille*/ 
export function battle_victory(game,id){
    //alert("Victoire du joueur " + id)
    game.mess_notif = "Victoire de " + id
    game.notif = true
}

/*message message recu | game instance Game_data*/ 
/*Attribut un nombre de soldat à chaque territoire en fonction du file*/ 
export function attribution(message, game){
    var k = 0
    //console.log(game.file.nb_territory)
    for (var i=0; i<game.file.nb_territory; i++){
        game.tab_Territory[i].id_user = message[k]-1
        var temp = message.slice(k+1,k+3)
        var tempo = new Uint16Array(temp.buffer)
        game.tab_Territory[i].nb_soldier = tempo[0]
        game.tab_Player[game.tab_Territory[i].id_user].ter.push(i.toString())
        k += 3
    }
}

/*PARSER*/
/*message message à parser | game instance de la classe Game_data | lobby Instance de la classe Lobby*/ 
/*Parse les messages en entréé et modifie les données en concéquence*/
export function parser(message, game, lobby, map_stream){ //game == Gama_data instance arg2 = lobby object

    var entete = message[0]
    var id_room

    if (entete !== 0x0){
        switch (entete){
            case 0x11:
                 id_room = message.slice(1)
                var int64 = bigintConversion.bufToBigint(id_room)
                console.log(int64)
                lobby.room_Id = int64
                lobby.room_Id32 = base32(id_room,'Crockford')
                console.log(lobby.room_Id32)
                //alert("id room = " + lobby.room_Id)
                console.log(global.new_game_data.go)
                game.go = true;
                break;
            
            case 0x13:
                var param = message.slice(1)
                lobby.nb_player_max = param[0]
                var map = param.slice(1,3)
                var int16 = new Uint16Array(map.buffer)
                game.map_Id = int16[0]
                var time = param.slice(3)
                int16 = new Uint16Array(time.buffer)
                game.time_round = int16[0]
                //document.location.href = url + "Map"
                //alert("vous avez rejoins")
                game.go = true;
                break;
            
            case 0x14:
                var p = message.slice(1)
                var temp = get_player(p)
                lobby.tab_Player_name = []
                lobby.tab_Player_name = temp.name
                lobby.nb_player = lobby.tab_Player_name.length
                //creat_players(tab_p, lobby.tab_Player)
                lobby.master = lobby.tab_Player_name[0]
                break;

            case 0x16:
                var p1 = message.slice(1, message.length-1)
                var ban_cause = new TextDecoder("utf-8").decode(p1)
                console.log(ban_cause)
                //alert("tu es ban car " + ban_cause) //a changer 
                //game.winner = "BANNED"
                break;

            case 0x19:
                id_room = message.slice(1)
                if (id_room[0] === 0){
                    game.mess_err = "pas de salon disponible"
                    game.error = true;
                }
                else {
                // on rejoint direct
                lobby.room_Id32 = base32(id_room, "Crockford")
                var msg = create_Message(0x12, base32(id_room, "Crockford"), lobby.current_JWT);
                global.websocket.send(msg);
                }
                break;
            
            case 0x21: 
                clear_game(game)
                var p2 = message.slice(1)
                var temp2 = get_player(p2)
                creat_players(temp2.name,game)
                //get_map_info(map_stream,game)
                var attrib = message.slice(temp2.ind+1)
                test_txt(map_stream,game,attrib)
                //document.location.href = url + "Map"
                //attribution(attrib,game)
                break;
            
            case 0x22:
                var p3 = message.slice(1, message.length-1)
                var name = new TextDecoder("utf-8").decode(p3)
                game.winner = name
                //alert(game.winner + " a gagné la partie")
                game.mess_notif = game.winner + " a gagné la partie"
                game.notif = true
                //clear_game(game)
                //clear_lobby(lobby)
                game.go = true
                break;

            case 0x23:
                var p4 = message.slice(1, message.length-1)
                var name1 = new TextDecoder("utf-8").decode(p4)
                var id = get_player_id(name1, game)
                game.tab_Player[id].alive = false;
                //alert("un joueur est mort")
                game.mess_notif = name1 + " est mort"
                game.notif = true
                break;
            
            case 0x30:
                var i = message.indexOf(0)
                var name2 = message.slice(1,i)
                var name_var = new TextDecoder("utf-8").decode(name2)
                var nb_sol = message.slice(i+1)
                var id2 = get_player_id(name_var, game)
                game.current_name = name_var
                game.current_turn = id2
                game.t_toplace = nb_sol[0]
                game.phase = 0
                //alert("cest au tour de " + game.current_name + " troupe = " + game.t_toplace)
                game.mess_notif = "c'est au tour de " + game.current_name + " troupe = " + game.t_toplace
                game.notif = true
                break;

            case 0x41:
                //var id_c = message.slice(1,3)
                var id1 = new Uint16Array(message.slice(1,3).buffer)
                var nb_s = new Uint16Array(message.slice(3).buffer)
                game.tab_Territory[id1].nb_soldier += nb_s[0]
                game.t_toplace -= nb_s[0]
                //game.phase = 1
                break;

            case 0x51: 
                
                var param_case = message.slice(1,5)
                var uint16 = new Uint16Array(param_case.buffer)
                var ori_case = uint16[0] //id case d'origine atta
                var des_case = uint16[1] //id case d'origine def
                var res = message[5] //resultat
                var param2 = message.slice(6,12)
                uint16 = new Uint16Array(param2.buffer)
                var t_lost_a = uint16[0] //troupe perdu att
                var t_lost_d = uint16[1] //troupe perdu def
                var nb_dice_a = uint16[2] //nb des att
                var index = 12+nb_dice_a
                var param3 = message.slice(12,index)
                game.dice_att = []
                for (var j=0; j<param3.length; j++){
                    game.dice_att.push(param3[j])
                }   
                var param4 = message.slice(index,index+2)
                uint16 = new Uint16Array(param4.buffer)
                //var nb_dice_d = uint16[0] //nb des def
                var param5 = message.slice(index+2)
                game.dice_def = []
                for (var k=0; k<param5.length; k++){
                    game.dice_def.push(param5[k])
                } 
                var defenser = game.tab_Territory[des_case].id_user
                attack(game, ori_case, des_case, res, t_lost_a, t_lost_d)
                if (game.tab_Player[defenser].ter.length !== 0){
                    if (game.current_name === game.current_player){
                        if (res === 1){
                            smalltalk
                                .prompt('Transfert apres attaque','Nombre de troupe entre 0 et ' + (game.tab_Territory[ori_case].nb_soldier-1).toString(),'0')
                                .then((value) =>{
                                    var sold_trans = parseInt(value);
                                    var message_trans = create_Message(0x60, ori_case, des_case, sold_trans)
                                    console.log(message_trans)
                                    global.websocket.send(message_trans)
                                })
                                .catch(() =>{
                                    global.info_phase[0] = -1
                                    global.info_phase[1] = -1
                                })
                            
                        }
                    }
                }
                break;
                
            case 0x61:
                var origin = message.slice(1,3)
                origin = new Uint16Array(origin.buffer)
                var dest = message.slice(3,5)
                dest = new Uint16Array(dest.buffer)
                var nb_renfort = message.slice(5)
                //console.log(origin)
                nb_renfort = new Uint16Array(nb_renfort.buffer)
                //console.log(origin[0] + "+" + dest[0])
                
                move_soldier(game.tab_Territory,origin[0],dest[0],nb_renfort[0])
                /*if(game.phase === 2)
                    game.phase = 0*/
                break;
            
            case 0x71:
                var phase = message.slice(1,2)
                game.phase = phase[0]-1
                var rem = message.slice(2)
                rem = new Uint16Array(rem.buffer)
                game.time_remaining = rem[0]
                break;

            default : 
                break;
        }
    }
    else { //erreur
        
        var errcode = message[1]
        game.error = true;
        debuggeur(message, errcode, game);
    }
}

/*message message recu | errcode code d'erreur du message*/ 
/*return un div à afficher en popup si c'est une erreur utilisateur*/
export function debuggeur(message, errcode, game){
    switch (errcode){
        case 0x0:
            var err_message = message.slice(2)
            var a_afficher = new TextDecoder("utf-8").decode(err_message)
            console.log(a_afficher)
            break;

        case 0x1:
        case 0x10:
            console.log("Message erroné : JWT incorrect ")
            game.mess_err = "Message erroné : JWT incorrect "
            break;

        case (errcode>0x2 && errcode<0xF):
            console.log("Message erroné : Paramètre erroné = " + errcode)
            game.mess_err = "Message erroné : Paramètre erroné"
            break;

        case 0x11:
            console.log("Id salon incorrect")
            game.mess_err = "Id salon incorrect"
            break;

        case 0x12:
            console.log("Salon plein")
            game.mess_err = "Salon plein"
            
            break;

        case 0x13:
            console.log("Game déja lancé")
            game.mess_err = "Game déja lancé"
            
            break;

        case 0x14:
            console.log("Joueur exclus")
            game.mess_err = "Joueur exclus"
            
            break;

        case 0x15:
            console.log("Le joueur n’a pas le droit d’expulser")
            game.mess_err = "Le joueur n’a pas le droit d’expulser"
            
            break;

        case 0x16:
            console.log("Le joueur n’existe pas dans ce salon")
            game.mess_err = "Le joueur n’existe pas dans ce salon"
            
            break;
        
        case 0x17:
            console.log("Nombre maximum de salons atteint")
            game.mess_err = "Nombre maximum de salons atteint"
            
            break;

        case 0x20:
            console.log("Pas assez de joueurs")
            game.mess_err = "Pas assez de joueurs"
            
            break;
        
        case 0x21:
            console.log("Pas le droit de lancer la partie")
            game.mess_err = "Pas le droit de lancer la partie"
            
            break;

        case 0x40:
            console.log("La case n’est pas au joueur")
            game.mess_err = "La case n’est pas au joueur"
           
            break;

        case 0x41:
            console.log("Pas assez de troupes")
            game.mess_err = "Pas assez de troupes"
           
            break;

        case 0x50:
        case 0x60:
            console.log("Mauvaise case d’origine")
            game.mess_err = "Mauvaise case d’origine"
            break;

        case 0x51:
        case 0x61:
            console.log("Mauvaise case de destination")
            game.mess_err = "Mauvaise case de destination"

            break;

        case 0x52:
        case 0x62:
            console.log("Nombre de troupes erroné")
            game.mess_err = "Nombre de troupes erroné"
            
            break;

        case 0x63:
            console.log("Troupes déjà déplacées ce tour")
            game.mess_err = "Troupes déjà déplacées ce tour"
            
            break;

        case 0x70:
            console.log("Ce n’est pas votre tour")
            game.mess_err = "Ce n’est pas votre tour"
            
            break;

        case 0x71:
            console.log("Phase non passable")
            game.mess_err = "Phase non passable"
            
            break;

        default:
            break;
    }
}

/* Creation message*/
/*entete entete du message à envoyer*/ 
/*creer un message en fonction de l'entete, LES ARGUMENTS SUPPLEMENTAIRES SONT INDIQUE DANS LA FONCTION */ 
export function create_Message(entete){
    var taille2
    var message
    var buffer2
    var chaine2
    var jwt2
    var id_room

    switch (entete){ //entete 1octet
        case 0x10: //arg1 = nbjoueur max 1octet  arg2 = idmap 2octets arg3 = temps tour 2octets arg4 = JWT indefini
            var taille = 6 + arguments[4].length + 1
            message = new Uint8Array(taille)
            var buffer = new Uint8Array(2)
            buffer[0] = entete
            buffer[1] = arguments[1]
            var param = new Uint16Array(2)
            param[0] = arguments[2]
            param[1] = arguments[3]
            var parameter = new Uint8Array(param.buffer, param.byteOffset, param.byteLength)
            var chaine = arguments[4].concat("\0")
            var jwt = new Uint8Array(chaine.length)
            jwt = new TextEncoder("uft-8").encode(chaine)
            message.set(buffer)
            message.set(parameter, buffer.length)
            message.set(jwt, buffer.length + parameter.length)
            break;
        
         
        case 0x12: //arg1 = id du salon 8octets arg2 = JWT string
            var taille1 = 9 + arguments[2].length + 1
            message = new Uint8Array(taille1)
            var buffer1 = new Uint8Array(1)
            buffer1[0] = entete
            var argument1 = basedecode(arguments[1],'Crockford')
            id_room = new Uint8Array(argument1)
            var chaine1 = arguments[2].concat("\0")
            var jwt1 = new TextEncoder("uft-8").encode(chaine1)
            message.set(buffer1)
            message.set(id_room, buffer1.length)
            message.set(jwt1, buffer1.length + id_room.length)
            break;


        case 0x15: //arg1 = nom du joueur string
            taille2 = 1 + arguments[1].length + 1
            message = new Uint8Array(taille2)
            buffer2 = new Uint8Array(1)
            buffer2[0] = entete
            chaine2 = arguments[1].concat("\0")
            jwt2 = new TextEncoder("uft-8").encode(chaine2)
            message.set(buffer2)
            message.set(jwt2, buffer2.length)
            break;

        case 0x18: //arg1 = JWT
            taille2 = 1 + arguments[1].length + 1
            message = new Uint8Array(taille2)
            buffer2 = new Uint8Array(1)
            buffer2[0] = entete
            chaine2 = arguments[1].concat("\0")
            jwt2 = new TextEncoder("uft-8").encode(chaine2)
            message.set(buffer2)
            message.set(jwt2, buffer2.length)
            break;
        
        case 0x31:
        case 0x70:
        case 0x20:
            message = new Uint8Array(1)
            message[0] = entete
            break;

        case 0x40: // arg1 = idcase 2 octets arg2 = nbtroupe 2octets
            message = new Uint8Array(5)
            message[0] = entete
            var buffer3 = new Uint16Array(2)
            buffer3[0] = arguments[1]
            buffer3[1] = arguments[2]
            var param2 = new Uint8Array(buffer3.buffer, buffer3.byteOffset, buffer3.byteLength)
            message.set(param2, 1)
            break;
        
        case 0x50: //arg1= id_case_source 2octet arg2= id_case_dest 2octet arg3= nbtroupe 2octet
        case 0x60:
            message = new Uint8Array(7)
            message[0] = entete
            var buffer4 = new Uint16Array(3)
            buffer4[0] = arguments[1]
            buffer4[1] = arguments[2]
            buffer4[2] = arguments[3]
            var param3 = new Uint8Array(buffer4.buffer, buffer4.byteOffset, buffer4.byteLength)
            message.set(param3, 1)
            break;

        default :   
            message = "entete incorrect"

    }

    return message
}

/* TEST*/

/*------------------------------------------------------------------Test structure-------------------------------------------------------------*/
//var tab_Territory = new Array() //tableau d'objet Territory
//                             0                         1                        2                         3                          4                                  5                    6                                 7                     8                             9                         10                              11                       12                   
//var test_tab =[[0,1,1,1,0,0,0,0,0,0,0,0,0],[1,0,1,0,1,1,1,0,0,0,0,0,0],[1,1,0,1,0,0,1,1,0,0,0,0,0],[1,0,1,0,0,0,0,1,0,0,0,0,0],[0,1,0,0,0,1,0,0,0,0,0,0,0],[0,1,0,0,1,0,1,0,1,0,0,0,0],[0,1,1,0,0,1,0,1,1,1,0,0,0],[0,0,1,1,0,0,1,0,0,1,0,0,0],[0,0,0,0,0,1,1,0,0,1,1,0,0],[0,0,0,0,0,0,0,1,1,0,1,1,0],[0,0,0,0,0,0,0,0,1,1,0,1,0],[0,0,0,0,0,0,0,0,0,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0]]
//console.log(test_tab)
/* ------------BUILD----------------*/
/*build(test_tab, tab_Territory)

console.assert(tab_Territory.length == 13)
console.assert(tab_Territory[0].tableau.length == 3)
console.assert(tab_Territory[0].tableau.indexOf(3) == 2)
console.assert(tab_Territory.length == 13)
console.assert(tab_Territory[2].tableau.length == 5)
console.assert(tab_Territory[2].tableau.indexOf(6) == 3)
console.assert(tab_Territory[1].tableau.indexOf(10) == -1)

/* ------------MOVE----------------*/
/*move_soldier(tab_Territory,0,1,10)
move_soldier(tab_Territory,1,2,5)
move_soldier(tab_Territory,2,3,20)


console.assert(tab_Territory[0].nb_soldier == 0)
console.assert(tab_Territory[1].nb_soldier == 15)
console.assert(tab_Territory[2].nb_soldier == 15)
console.assert(tab_Territory[3].nb_soldier == 10)

move_soldier(tab_Territory,1,0,5)
move_soldier(tab_Territory,2,0,5)

move_soldier(tab_Territory,0,4,5)
move_soldier(tab_Territory,1,9,5)
move_soldier(tab_Territory,0,12,5)

console.assert(tab_Territory[4].nb_soldier == 15)
console.assert(tab_Territory[9].nb_soldier == 15)
console.assert(tab_Territory[12].nb_soldier == 10)

move_soldier(tab_Territory,4,0,5)
move_soldier(tab_Territory,9,1,5)

/* ------------ADD----------------*/
/*add_soldier(tab_Territory,0,500)
add_soldier(tab_Territory,1,-10)
add_soldier(tab_Territory,2,2.5)
add_soldier(tab_Territory,3,-100)

console.assert(tab_Territory[0].nb_soldier == 510)
console.assert(tab_Territory[1].nb_soldier == 0)
console.assert(tab_Territory[2].nb_soldier == 10)
console.assert(tab_Territory[3].nb_soldier == 10)

add_soldier(tab_Territory,0,-500)
add_soldier(tab_Territory,1,10)

/*------------CHANGE----------------*/
/*change_owner(tab_Territory,0,1022)
change_owner(tab_Territory,1,-1022)
change_owner(tab_Territory,2,1022.5)

console.assert(tab_Territory[0].id_user == 1022)
console.assert(tab_Territory[1].id_user == 0)
console.assert(tab_Territory[2].id_user == 0)

change_owner(tab_Territory,0,0)

console.assert(tab_Territory[0].id_user == 0)

/*-----------------------------------------------------------------------Test Joueur-----------------------------------------------------------*/

//var tab_Player = new Array() //Table des joueurs 

//var test_Player = ['Eric', 'Stephan', 'Abdelhak', 'Fred', 'Yuquan', 'Mickeal']

/*-------------PLAYERS-------------*/
/*creat_players(test_Player, tab_Player)

console.assert(tab_Player[0].name === 'Eric' && tab_Player[0].id_player === 0 && tab_Player[0].alive == true)
console.assert(tab_Player[3].name === 'Fred' && tab_Player[3].id_player === 3 && tab_Player[0].alive == true)

add_player(tab_Player,"karim")

/*-------------KILL----------------*/
/*kill_player(tab_Player, 0)
kill_player(tab_Player, 3)

console.assert(tab_Player[0].alive == false)
console.assert(tab_Player[3].alive == false)

tab_Player[0].alive == true
tab_Player[3].alive == true

/*---------------------------------------------------------------------Test Parser-------------------------------------------------------------*/

/*-----------Generation de message TEST-------------------*/

/*var message = create_Message(0x10, 5, 60000, 60, "ehvsihlsehqhqHDLIeheffbskvsv")
console.log(message)

var message2 = create_Message(0x10, 6, 60000, 60000, "zifhzkeifjbzekugehkjrgherjhgr")
console.log(message2)

var message3 = create_Message(0x12, 6000000, "rtjrjrjrjeztzeghtjyujtj")
console.log(message3)

var message4 = create_Message(0x12, 6455346846546654, "epofjzporgjmggljdlkhjeijh")
console.log(message4)

var message5 = create_Message(0x15, "DarkSasukedu67")
console.log(message5)

var message6 = create_Message(0x15, "Herskill")
console.log(message6)

var message7 = create_Message(0x20, 5)
console.log(message7)

var message8 = create_Message(0x20)
console.log(message8)

var message9 = create_Message(0x31)
console.log(message9)

var message10 = create_Message(0x40, 60000, 30000)
console.log(message10)

var message11 = create_Message(0x50, 60000, 50000, 40000)
console.log(message11)

var message12 = create_Message(0x60, 60000, 50000, 40000)
console.log(message12)

var message13 = create_Message(0x70)
console.log(message13)*/

/*------------------------------PARSER---------------------------------*/

/*var game_info = new Game_data()
var lobby = new Lobby()

var message15 = new Uint8Array([0x11,0,0,1,0,0,0,0,0])
parser(message15, game_info, lobby)
console.log(game_info)

var message16 = new Uint8Array([0x13,6,16,0,60,0])
parser(message16, game_info, lobby)
//console.log(game_info)

var message17 = new Uint8Array([0x14,101,114,105,99,0,97,98,99,0,108,101,111,0])
parser(message17, game_info, lobby)
//console.log(game_info)

var message18 = new Uint8Array([0x16,116,117,32,101,115,32,99,111,110,0])
parser(message18, game_info, lobby)
//console.log(game_info)

var message19 = new Uint8Array([0x21,101,114,105,99,0,97,98,99,0,108,101,111,0,2,10,0,1,10,0,3,15,0,1,10,0,2,10,0,3,10,0,1,10,0,2,10,0,3,10,0,1,10,0,2,10,0,3,10,0,1,10,0])
parser(message19, game_info, lobby)
console.log(game_info)

var message20 = new Uint8Array([0x22,101,114,105,99,0])
parser(message20, game_info, lobby)
//console.log(game_info)

var message21 = new Uint8Array([0x23,101,114,105,99,0])
parser(message21, game_info, lobby)
//console.log(game_info)

//game_info.tab_Territory = tab_Territory
var message22 = new Uint8Array([0x41,6,0,5,0])
parser(message22, game_info, lobby)
//console.log(game_info, lobby)

var message23 = new Uint8Array([0x51,0,0,1,0,5,0,1,0,2,0,2,6])
parser(message23,game_info, lobby)
console.log(game_info)
*/
