var express = require('express');
var app = express();
var servidor = require('http').Server(app);
var io = require('socket.io')(servidor);
app.use(express.static("archivosChat"));

var clientes = [];
var infoClientes = [];

io.on('connection', function(socket){
	clientes.push(socket);
  	console.log('Un usuario se ha conectado');
	
	socket.on('mensaje', function(msg){
    	socket.broadcast.emit('mensaje', msg);
  	});
	
	socket.on('datosUsr', function(datos){
    	socket.broadcast.emit('datosUsr', datos);
  	});	
	
	socket.on('conexionUsr', function(datosUsuario){
		socket.infoUsuario = datosUsuario;
		infoClientes.push(datosUsuario);
		io.emit('cargaUsuarios', infoClientes);
    	io.emit('conexionUsr', datosUsuario, infoClientes);
		console.log(infoClientes);
  	});
	
	/*socket.on('desconexionUsr', function(datosUsuario){
    	socket.broadcast.emit('desconexionUsr', datosUsuario);
  	});*/
	
	socket.on('escribiendo', function(datosUsuario){
    	socket.broadcast.emit('escribiendo', datosUsuario);
  	});	
	
	socket.on('stopEscribiendo', function(){
    	socket.broadcast.emit('stopEscribiendo');
  	});
	
	/*socket.on('valida', function(datos){
    	for(let usr of infoClientes){
			if(datos[0].indexOf(usr)){
				socket.emit('valida', false);
			}
		}
  	});*/
	
	socket.on('disconnect', function(){
    	console.log('Un usuario se ha desconectado');
		if(socket.infoUsuario){
			var j = infoClientes.indexOf(socket.infoUsuario);
			infoClientes.splice(j, 1);
		}
		var i = clientes.indexOf(socket);
      	clientes.splice(i, 1);
		socket.broadcast.emit('desconexionUsr', socket.infoUsuario, infoClientes);
		io.emit('cargaUsuarios', infoClientes);
  	});
	
});

servidor.listen(process.env.PORT || 3000, function(){
  console.log('Funcionando en el puerto:3000');
});