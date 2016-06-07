curl -X POST http://localhost:9721/register -d '{"username":"MattiKettu","email":"mathieu.dvs@gmail.com","password":"123@abC","firstname":"Matti","lastname":"Kettu","about":"You wished!"}' -H 'Content-Type: application/json' --cookie-jar jarfileZ

curl -X POST http://localhost:9721/login -d '{"username":"MattiKettu","password":"123@abC"}' --cookie-jar jarfileZ -H 'Content-Type: application/json' 

curl -X GET http://localhost:9721/users/MattiKettu --cookie jarfileZ -H 'Content-Type: application/json' 

curl -X GET http://localhost:9721/users --cookie jarfileZ -H 'Content-Type: application/json' 

curl -X POST http://localhost:9721/clubs -d '{"clubname":"Autek","about":"yellow madness","isGuild":"true" ,"color":"#ffff00","maxMembers":128,"authKey":"YellowIsNotOrange"}' --cookie jarfileZ -H 'Content-Type: application/json' 

curl -X POST http://localhost:9721/clubs -d '{"clubname":"ESN INTO","about":"Izzz into!","isGuild":"false","color":"#7cfc00","maxMembers":128,"authKey":"ESN Finland iz the best"}' --cookie jarfileZ -H 'Content-Type: application/json' 

curl -X GET http://localhost:9721/clubs --cookie jarfileZ -H 'Content-Type: application/json' 

curl -X POST http://localhost:9721/clubs/ESN%20INTO/addMember -d '{"username":"MattiKettu", "authKey":"ESN Finland iz the best"}' --cookie jarfileZ -H 'Content-Type: application/json' 

