curl -X POST http://localhost:9721/register -d '{"username":"MattiKettu","email":"mathieu.dvs@gmail.com","password":"123@abC","firstname":"Matti","lastname":"Kettu","about":"You wished!"}' -H 'Content-Type: application/json'

curl -X POST http://localhost:9721/login -d '{"username":"MattiKettu","password":"123@abc"}' -H 'Content-Type: application/json' 

curl -X POST http://localhost:9721/login -d '{"username":"MattiKettu","password":"123@abC"}' --cookie-jar jarfile -H 'Content-Type: application/json' 

curl -X GET http://localhost:9721/users/MattiKettu --cookie jarfile -H 'Content-Type: application/json' 

curl -X GET http://localhost:9721/users --cookie jarfile -H 'Content-Type: application/json' 


