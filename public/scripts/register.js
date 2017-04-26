function comprobarpass()
{
  var pass = document.getElementById("pass");
  var name = document.getElementById("email");
  var conf = document.getElementById("conf");
  var username = document.getElementById("username");
  
  name.style.backgroundColor="#FFFFFF";
  pass.style.backgroundColor="#FFFFFF";
  conf.style.backgroundColor="#FFFFFF";

  if(name.value == null || name.value == "")
  {
    name.style.backgroundColor="#FF7777";
    return false;
  } else if(pass.value == null || pass.value == "") {
    pass.style.backgroundColor="#FF7777";
    return false;
  } else {
    if(pass.value == conf.value)
    {
      return true;
    }
    else{
      alert("Las contraseñas no coinciden");
      return false;
    }
  }
}
