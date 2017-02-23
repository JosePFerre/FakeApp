var socket = io();


$(document).ready(function () {
	
	//Inicializar tooltips
	$('[data-toggle="tooltip"]').tooltip();
	
	var datosUsuario=[];
	var coloresGlobo = [['colorFondo', 'ColorFuente'],['#d6e5fc', '#6b9be5'],['#ffccfd', '#d865d4'],['#f4ed8d', '#efb710'],['#f7bebb', '#ef4239'],['#f9d68b', '#e2a012']];
	var intervalo = null;
	
	$("#mensaje").keydown(function(event) {
		
		if(event.keyCode == 13){
			event.preventDefault();
			if($('#mensaje').val() != ''){
				socket.emit('mensaje', $('#mensaje').val());
				socket.emit('datosUsr', datosUsuario);
				escribePropio($('#mensaje').val());
				$('#mensaje').val('');
				$('#cuerpoChat').animate({scrollTop: $('#cuerpoChat').prop("scrollHeight")}, 500);
				return false;
			}
		}else{
			if (!intervalo){
				socket.emit('escribiendo', datosUsuario);
			}else{
				clearTimeout(intervalo);
			}
			intervalo = setTimeout(acabaEscribir, 1000);
		}
	});
	
	function acabaEscribir(){
		socket.emit('stopEscribiendo');
		intervalo = null;
	}
	
	/*		$('#cuerpoChat').append(mensajeGlobo);
		mensajeGlobo.get(0).scrollIntoView();*/
	
	socket.on('mensaje', function(msg){
    	let fecha = new Date();
		let hora = fecha.getHours() +":"+fecha.getMinutes();
		$('#cuerpoChat').append("<div class='row contenedorAjeno'><div class='ajenoMsj pull-left'><p class='nombreAjeno'></p><hr>"+msg+"<p class='hora'>"+hora+"</p></div></div>");
		$('#cuerpoChat').animate({scrollTop: $('#cuerpoChat').prop("scrollHeight")}, 500);
  	});
	
	socket.on('datosUsr', function(datos){
		$(".nombreAjeno").last().html(datos[0]);	
		$(".nombreAjeno").last().css('color', datos[3][1]);
		$(".ajenoMsj").last().css('background-color', datos[3][0]);
	});	
	
	socket.on('conexionUsr', function(datosUsuario, usuariosConectados){
		$('#cuerpoChat').append("<div class='row contenedorInfo'><div class='infoMsj'><span class='connectInfo'><span>"+datosUsuario[0]+"</span> se ha conectado</span></div></div>");
		$('#cuerpoChat').animate({scrollTop: $('#cuerpoChat').prop("scrollHeight")}, 500);
		$('#cabeceraUsuarios').html(usuariosConectados.length);
		//$('#contenedorUsuarios').append("<div class='row  chatUsuario'><div class='col-md-4'><img src="+datosUsuario[2]+" alt='imgUsuario' class='img-responsive img-circle imagenesUsuario'></div><div class='col-md-8'><span>"+datosUsuario[0]+"</span><h6 class='estadoUsuarios'>"+datosUsuario[1]+"</h6></div></div>");
	});	
	
	socket.on('desconexionUsr', function(datosUsuario, usuariosConectados){
		$('#cuerpoChat').append("<div class='row contenedorInfo'><div class='infoMsj'><span class='connectInfo'><span>"+datosUsuario[0]+"</span> se ha desconectado</span></div></div>");
		$('#cuerpoChat').animate({scrollTop: $('#cuerpoChat').prop("scrollHeight")}, 500);
		$('#cabeceraUsuarios').html(usuariosConectados.length);
		//$('.chatUsuario').remove();
	});
	
	socket.on('escribiendo', function(datosUsuario){
			$('#escribiendo').html(datosUsuario[0]+' está escribiendo...');
	});
	
	socket.on('stopEscribiendo', function(){
			$('#escribiendo').html('');
	});
	
	socket.on('cargaUsuarios', function(allUsuarios){
			$('.chatUsuario').remove();
			for(usuario of allUsuarios){
				$('#contenedorUsuarios').append("<div class='row  chatUsuario'><div class='col-md-4'><img src="+usuario[2]+" alt='imgUsuario' class='img-responsive img-circle imagenesUsuario'></div><div class='col-md-8'><span>"+usuario[0]+"</span><h6 class='estadoUsuarios'>"+usuario[1]+"</h6></div></div>");
			}
	});
	
	function escribePropio(mensaje){
		let fecha = new Date();
		let hora = fecha.getHours() +":"+fecha.getMinutes();
		$('#cuerpoChat').append("<div class='row contenedorPropio'><div class='propioMsj pull-right'><p class='nombreYo'>"+datosUsuario[0]+"</p><hr>"+mensaje+"<p class='hora'>"+hora+"</p></div></div>");
	}
	
	$("#entrarChat").click(function(event){
		event.preventDefault();
		guardaDatos();
		//socket.emit('valida', datosUsuario);
    	$("#inicial").hide();
		$("#chat").show();
		cargaChat();
		socket.emit('conexionUsr', datosUsuario);
	});

	/*socket.on('valida', function(valido){
			if (!valido){
				alert('acceso denegado')
			}
	});*/
	
	function guardaDatos(){
		datosUsuario.push($('#usuario').val());
		if($('#estado').val() != ''){
			datosUsuario.push($('#estado').val());
		}else{
			datosUsuario.push('Disponible');
		}
		datosUsuario.push($('#imagenPerso').attr('src'));
		datosUsuario.push(coloresGlobo[Math.floor((Math.random() * 5) + 1)]);
	}
	
	function cargaChat(){
		cargaUsuario();
	}
	
	function cargaUsuario(){
		$("#nombreUsuario").text(datosUsuario[0]);
		$("#estadoUsuario").text(datosUsuario[1]);
		$("#avatarUsuario").attr('src', datosUsuario[2]);
	}
	/*Métodos para la página principal*/
	
	function previsualiza(imagen) {
		if (imagen.files && imagen.files[0]) {
			var reader = new FileReader();

			reader.onload = function (e) {
				$('#imagenPerso').attr('src', e.target.result);
			}

			reader.readAsDataURL(imagen.files[0]);
		}
	}

	$("#inputImagen").change(function(){
    	previsualiza(this);
	});
	
	$(".imagenDefecto").click(function(e){
		$('#imagenPerso').attr('src', $(this).attr("src"));
	});
	
	$("#usuario").keydown(function(event) {
		if(event.keyCode == 13){
			event.preventDefault();
		}
	});
						  
	$("#usuario").keyup(function(event) {
  		if($('#usuario').val().length > 2){
			$("#entrarChat").show();
		}else if ($('#usuario').val().length <= 2){
			$("#entrarChat").hide();
		}
	});
	
		
	/*--------------------------------------------*/
	
});