var xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = function() {
    if(this.readyState==4 && this.status==200) {
        var jsonObj = JSON.parse(this.responseText);

        for(i = 0 ; i < jsonObj.length ; i++) {
            var tr = document.createElement("tr");
            var col1 = tr.insertCell(0);
            col1.innerHTML = jsonObj[i].nombre;
            var col2 = tr.insertCell(1);
            col2.innerHTML = jsonObj[i].insulto;

            tabla.appendChild(tr);
        }
    }
};

xhttp.open("GET", "/insultos", true);
xhttp.send();

var xhttp2 = new XMLHttpRequest();

xhttp2.onreadystatechange = function() {
    if(this.readyState==4 && this.status==200) {
        var jsonObj2 = JSON.parse(this.responseText);

        if(jsonObj2==null || jsonObj2=={}) document.getElementById("menu_salir").style.display = "none";
        else document.getElementById("menu_login").style.display = "none";

        document.getElementById("username").innerHTML = jsonObj2.nombre;
    }
};

xhttp2.open("GET", "/nombre", true);
xhttp2.send();

