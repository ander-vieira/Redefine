var userused;
var mailused;

//Para comprobar el formulario mejor utilizar esto!!
function confirmCaptcha() {
  document.getElementById("alert-message").innerHTML = ""
  var correcto = comprobarformulario();
  if (correcto == true && $("#g-recaptcha-response").val() != "" && !userused && !mailused) {
    return true;
  } else {
    var diverr = document.getElementById("errordiv");
    diverr.style.visibility = "visible"; //Lo he hecho asi pork no encuentro el equivalente en jquery, bueno seria usando .css y no me apetece
    var msg = document.getElementById("alert-message").innerHTML;
    if ($("#g-recaptcha-response").val() == "") {
      msg += "El captcha debe ser rellenado (!)<br/>";
    }
    if (userused || mailused) {
      msg += "Username y/o email en uso (!)";
    }
    $('#alert-message').html(msg);
    return false;
  }
}
//******************************************************************************
//Comprobar los datos del formulario
function comprobarformulario() {

  var pass = document.getElementById("pass");
  var mail = document.getElementById("email");
  var conf = document.getElementById("conf");
  var username = document.getElementById("username");

  //Mensajes con los errores
  msgs = [
    "Las contraseñas no coinciden",
    "Username obligatorio",
    "Caracteres no permitidos",
    "Email obligatorio",
    "Password obligatorio",

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
  if (username.value == null || username.value == "") {
    username.style.borderColor = "#FF7777";
    errs[1] = true
  }
  if (pass.value != conf.value) {
    pass.style.borderColor = "#FF7777";
    conf.style.borderColor = "#FF7777";
    errs[0] = true;
  } else {
    pass.style.borderColor = "#2EDB3C";
    conf.style.borderColor = "#2EDB3C";
  }
  if (!comprobarValidezLetras(username.value)) {
    errs[2] = true;
    username.style.borderColor = "#FF7777";
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

//******************************************************************************
//Ajax para comprobar el nombre e email de usuario
$(document).ready(function() {
  $('#username').change(function() {
    var comprobacion = comprobarValidezLetras($('#username').val().toString());
    if ($('#username').val().toString().length >= 4 && comprobacion == true) {
      $.ajax({
        type: "GET",
        url: "http://localhost:3000/findusers",
        data: {
          user: document.getElementById('username').value
        },
        dataType: "json",
        success: function(data, status, jqXHR) {
          if (data.length > 0) {
            document.getElementById("username").style.border = "4px solid #FF7777";
            uu = document.getElementById("userused");
            uu.style.visibility = "visible";
            uu.innerHTML = "&#8855 Username en uso.";
            uu.style.color = "#FF7777";
            userused = true;
          } else {
            document.getElementById("username").style.border = "4px solid #2EDB3C";
            uu = document.getElementById("userused");
            uu.style.visibility = "visible";
            uu.innerHTML = "&#10004 Username válido";
            uu.style.color = "#2EDB3C";
            userused = false;
          }
        },
        error: function(jqXHR, status) {
          console.log("Error en ajax username");
          document.getElementById("username").style.border = "4px solid #FF7777";
          uu = document.getElementById("userused");
          uu.style.visibility = "visible";
          uu.innerHTML =  "&#8855 Error temporal, imposible acceder a la base de datos";
          uu.style.color = "#FF7777";
          userused = true;
        }
      });
    } else {
      if (comprobacion == false) {
        document.getElementById("username").style.border = "4px solid #F4E044";
        uu = document.getElementById("userused");
        uu.style.visibility = "visible";
        uu.innerHTML = "(!) Hay caracteres no permitidos";
        uu.style.color = "#F4E044";
      } else if ($('#username').val().toString().length == 0) {
        uu = document.getElementById("userused");
        uu.style.visibility = "hidden";
        document.getElementById("username").style.border = "4px solid #FFFFFF";
      } else if ($('#username').val().toString().length < 4) {
        document.getElementById("username").style.border = "4px solid #F4E044";
        uu = document.getElementById("userused");
        uu.style.visibility = "visible";
        uu.innerHTML = "(!) Username demasiado corto (min. 4 caracteres)";
        uu.style.color = "#F4E044";
      }
    }
  });
  $('#email').change(function() {
    var mailc = $('#email').val().toString().split("@");
    if (mailc.length == 2 && mailc[1] != "") {
      $.ajax({
        type: "GET",
        url: "http://localhost:3000/findusers",
        data: {
          user: document.getElementById('email').value
        },
        dataType: "json",
        success: function(data, status, jqXHR) {
          if (data.length > 0) {
            document.getElementById("email").style.border = "4px solid #FF7777";
            eu = document.getElementById("emailused");
            eu.style.visibility = "visible";
            eu.innerHTML = "&#8855 Email ya en uso.";
            eu.style.color = "#FF7777";
            mailused = true;
          } else {
            document.getElementById("email").style.border = "4px solid #2EDB3C";
            eu = document.getElementById("emailused");
            eu.style.visibility = "visible";
            eu.innerHTML = "&#10004 El email parece ser válido";
            eu.style.color = "#2EDB3C";
            mailused = false;
          }
        },
        error: function(jqXHR, status) {
          console.log("Error en ajax email");
          document.getElementById("email").style.border = "4px solid #FF7777";
          eu = document.getElementById("emailused");
          eu.style.visibility = "visible";
          eu.innerHTML = "&#8855 Error temporal, imposible acceder a la base de datos";
          eu.style.color = "#FF7777";
          mailused = true;
        }
      });
    } else {
      if ($('#email').val().toString() == "") {
        document.getElementById("emailused").style.visibility = "hidden";
        document.getElementById("email").style.border = "4px solid #FFFFFF";
        mailused = undefined;
      } else {
        document.getElementById("email").style.border = "4px solid #F4E044";
        eu = document.getElementById("emailused");
        eu.style.visibility = "visible";
        eu.innerHTML = "(!) Formato de email erroneo";
        eu.style.color = "#F4E044";
        mailused = true;
      }
    }
  });
});
//******************************************************************************

//Restablecer color
function restartColor(inp) {
  document.getElementById("errordiv").style.visibility = "hidden";
  inp.style.border = "4px solid #FFFFFF";
}

//Cerrar alerta
function closeAlert() {
  document.getElementById("errordiv").style.visibility = "hidden";
}

//******************************************************************************
function comprobarValidezLetras(texto) {
  aceptado = "abcdefghijklmnñopqrstuvwxyz1234567890-_"
  var lowerName = texto.toString().toLowerCase();
  var validez = true;

  for (var i in lowerName) {
    if (aceptado.indexOf(lowerName[i]) == -1) {
      validez = false;
      break;
    }
  }
  return validez;
}
