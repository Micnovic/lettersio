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
function makeRandomLetter()
{
  var text = "";
  var possible = "ОООАААЕЕЕИИИНННТТТРРРСССЛЛЛВВВККППММУУДДЯЯЫЫЬЬЗБГЙЧЮХЖШЦЩФЭЪ";
  text = possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}
function init(password){
  if(password == 'please')
  {
    letters = [];
    for(var i = 0; i < 100; i++)
    {
      letters.push(
        {
          char: makeRandomLetter(),
          x: Math.random() * 600,
          y: Math.random() * 600
        });
    }
  }
}
init('please');

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
  }

  socket.on('reset', init);
  socket.on('disconnect', () => console.log('Client disconnected'));
}
