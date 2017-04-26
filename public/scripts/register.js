function comprobarpass() {

  var pass = document.getElementById("pass");
  var mail = document.getElementById("email");
  var conf = document.getElementById("conf");
  var username = document.getElementById("username");

  //Mensajes con los errores
  msgs = [
    "Las contraseñas no coinciden",
    "El usuario que has introducido ya esta en uso",
    "Hay caracteres no permitidos",
    "El campo email es obligatorio",
    "El campo password es obligatorio"
  ];

  errs = [false, false, false, false, false];

  if (mail.value == null || mail.value == "") {

    mail.style.borderColor = "#FF7777";
    errs[3] = true;
  }

  if (pass.value == null || pass.value == "") {

    pass.style.borderColor = "#FF7777";
    errs[4] = true
  }

  if (pass.value != conf.value) {
    pass.style.borderColor = "#FF7777";
    conf.style.borderColor = "#FF7777";
    errs[0] = true;
  }

  //Comprobar que el nombre no contiene caracteres prohibidos
  var lowerName = username.value.toLowerCase();
  console.log(lowerName);
  aceptado = "abcdefghijklmnñopqrstuvwxyz1234567890-_"

  for (var i in lowerName) {
    if (aceptado.indexOf(lowerName[i]) == -1) {
      errs[2] = true;
      username.style.borderColor = "#FF7777";
      break;
    }
  }

  //Si no se ha dado ningun error se envia el coreo etc... Si ha habido alguno se crea un alert con los mensajes de error
  if (errs[0] == false && errs[1] == false && errs[2] == false && errs[3] == false && errs[4] == false) {
    return true;
  } else {
    msg = "";
    for (var i in errs) {
      if (errs[i] == true) msg += msgs[i] + '(!)<br/>';
    }
    document.getElementById("errordiv").style.visibility = "visible";
    document.getElementById("alert-message").innerHTML = msg;
    return false;
  }
}

//Restablecer color
function restartColor(inp) {
  document.getElementById("errordiv").style.visibility = "hidden";
  inp.style.border = "6px solid #FFFFFF";
  inp.style.borderColor = "#FFFFFF";
}

//Cerrar alerta
function closeAlert() {
  document.getElementById("errordiv").style.visibility = "hidden";
}
