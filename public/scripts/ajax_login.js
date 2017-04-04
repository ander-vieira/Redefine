var xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = function() {
    if(this.readyState==4 && this.status==200) {
        var jsonObj2 = JSON.parse(this.responseText);
        var element;

        element = document.getElementById("menu_login");
        if(element != null) element.style.display = "none";

        element = document.getElementById("menu_salir");
        if(element != null) element.style.display = "block";

        element = document.getElementById("double_login");
        if(element != null) element.style.display = "block";

        element = document.getElementById("username");
        if(element != null) element.innerHTML = jsonObj2.nombre;
    }
};

xhttp.open("GET", "/nombre", true);
xhttp.send();

