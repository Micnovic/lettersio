'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server);

//Create set of letter
var letters = [];
var canvasWidth = 800;
var canvasHeight = 800;
function makeRandomLetter()
{
  var text = "";
  var possible = "ОООАААЕЕЕИИИНННТТТРРРСССЛЛЛВВВККППММУУДДЯЯЫЫЬЬЗБГЙЧЮХЖШЦЩФЭЪ";
  text = possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

var charCounter = 0;
function addLetter()
{
  var text = "";
  var possible = "ОООАААЕЕЕИИИНННТТТРРРСССЛЛЛВВВККППММУУДДЯЯЫЫЬЬЗБГЙЧЮХЖШЦЩФЭЪ";
  var emoji = ['😀','😃','😄','😁','😆','😅','😂','😊','😇','🙂','🙃','😉','😌','😍','😘','😗','😙','😋',
'😜','😝','😛','🤑','🤗','🤓','😎','🤡','🤠','😏','😒','😞','😔','😟','😕','🙁','☹️','😣','😖','😫','😩','😤','😠','😡','😶','😐',
'😑','😯','😦','😧','😮','😲','😵','😳','😱','😨','😰','😢','😥','🤤','😭','😓','😪','😴','🙄','🤔','🤥','😬','🤐','🤢','😈',
'👿','👹','💩','👽','🤖','🎃','👻','😷','🌝','🔥','⚡️','⭐️','🔞','💀','👀','🐬','🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼'];
  if (Math.random() > 0.1){
    text = possible.charAt(charCounter);
    charCounter++;
    if (charCounter > possible.length){charCounter = 0;}
  } else {
    text = emoji[Math.floor(Math.random()*emoji.length)];
  }
  return text;
}

//function init(password){
//  if(password == 'please')
//  {
  //  letters = [];
    for(var i = 0; i < 200; i++)
    {
      letters.push(
        {
          char: addLetter(),
          //char: makeRandomLetter(),
          x: 5 + Math.random() * (canvasWidth-10),
          y: 5 + Math.random() * (canvasHeight-10)
        });
    }
  //}
//}
//init('please');


io.sockets.on('connection', newConnection);

function newConnection(socket){
  console.log('new connection: ' + socket.id);
  socket.emit('existingSituation', letters);

  socket.on('newLetterPosition', setNewLetterPosition);

  function setNewLetterPosition(data)
  {
    //console.log("recieveng new position: " + data.x);
    letters[data.position].x = data.x;
    letters[data.position].y = data.y;
    var pack =
    {
      i: data.position,
      x: data.x,
      y: data.y
    }
    socket.broadcast.emit('updateSituation', pack);
    //io.sockets.emit('updateSituation', pack);
  }

  //socket.on('reset', init);
  socket.on('disconnect', () => console.log('Client disconnected'));
}
