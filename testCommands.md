%-- USERS REGISTER --%

curl -X POST http://localhost:9721/register -d '{"username":"MattiKettu","email":"mathieu.dvs@gmail.com","password":"123@abC","firstname":"Matti","lastname":"Kettu","about":"You wished!"}' -H 'Content-Type: application/json' --cookie-jar jarfileZ

curl -X POST http://localhost:9721/register -d '{"username":"Pavel","email":"info@pinkiponki.com","password":"123@abC","firstname":"Pavel","lastname":"Pavel","about":"You wished!"}' -H 'Content-Type: application/json' --cookie-jar jarfileZ

curl -X POST http://localhost:9721/register -d '{"username":"Maja","email":"info@pinkiponki.com","password":"123@abC","firstname":"Maja","lastname":"Maja","about":"You wished!"}' -H 'Content-Type: application/json' --cookie-jar jarfileZ

curl -X POST http://localhost:9721/register -d '{"username":"Alburt","email":"info@pinkiponki.com","password":"123@abC","firstname":"Alburt","lastname":"Alburt","about":"You wished!"}' -H 'Content-Type: application/json' --cookie-jar jarfileZ

%-- LOGIN --%

curl -X POST http://localhost:9721/login -d '{"username":"MattiKettu","password":"123@abC"}' --cookie-jar jarfileZ -H 'Content-Type: application/json' 

%-- USER GET(S) --%

curl -X GET http://localhost:9721/users/MattiKettu --cookie jarfileZ -H 'Content-Type: application/json' 

curl -X GET http://localhost:9721/users --cookie jarfileZ -H 'Content-Type: application/json' 

%-- CLUB POST(S)/GET(S) --%

curl -X POST http://localhost:9721/clubs -d '{"clubname":"Autek","about":"yellow madness","isGuild":"true" ,"color":"#ffff00","maxMembers":128,"authKey":"YellowIsNotOrange"}' --cookie jarfileZ -H 'Content-Type: application/json' 

curl -X POST http://localhost:9721/clubs -d '{"clubname":"ESN INTO","about":"Izzz into!","isGuild":"false","color":"#7cfc00","maxMembers":128,"authKey":"ESN Finland iz the best"}' --cookie jarfileZ -H 'Content-Type: application/json' 

curl -X GET http://localhost:9721/clubs --cookie jarfileZ -H 'Content-Type: application/json' 

%-- MEMBER ADDING --%

curl -X POST http://localhost:9721/clubs/ESN%20INTO/addMember -d '{"username":"MattiKettu", "authKey":"ESN Finland iz the best"}' --cookie jarfileZ -H 'Content-Type: application/json' 

%-- GAME POST --%

curl -X POST http://localhost:9721/games -d '{"teamA_player1":"MattiKettu","teamA_player2":"Alburt","teamB_player1":"Pavel","teamB_player2":"Maja","teamA_score":6,"teamB_score":3,"author":"MattiKettu"}' --cookie jarfileZ -H 'Content-Type: application/json' 

%-- VERIFY GAME --%

curl -X POST http://localhost:9721/games/5757fd9aa5c1ff9979000001/verify -d '{"username": "Pavel"}' --cookie jarfileZ -H 'Content-Type: application/json' 

curl -X POST http://localhost:9721/games/5757fd9aa5c1ff9979000001/verify -d '{"username": "Maja"}' --cookie jarfileZ -H 'Content-Type: application/json' 



