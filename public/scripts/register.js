function comprobar_pass()
{
  var pass = document.getElementById("pass").value;
  var name = document.getElementById("email").value;
  var conf = document.getElementById("conf").value;

  if(name == null || name.equals(""))
  {
    alert("El nombre es obligatorio");
    return false;
  }
  else
  {
    if(pass.equals(conf))
    {
      return true;
    }
    else{
      alert("Las contraseñas no coinciden");
      return false;
    }
  }
}
