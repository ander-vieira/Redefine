var xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = function() {
    if(this.readyState==4 && this.status==200) {
        var jsonObj2 = JSON.parse(this.responseText);

        document.getElementById("menu_login").style.display = "none";
        document.getElementById("menu_salir").style.display = "block";
        document.getElementById("double_login").style.display = "block";

        document.getElementById("username").innerHTML = jsonObj2.nombre;
    }
};

xhttp.open("GET", "/nombre", true);
xhttp.send();

