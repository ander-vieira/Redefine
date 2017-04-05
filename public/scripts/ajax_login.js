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

        element = document.getElementById("rightmenu");
        if(element != null) element.style.display = "block";

        element = document.getElementById("rightmenu_user");
        if(element != null) element.innerHTML = jsonObj2.nombre;

        element = document.getElementById("username");
        if(element != null) element.innerHTML = jsonObj2.nombre;

        element = document.getElementsByClassName("user_page_link");
        if(element != null)
            for(var i = 0 ; i < element.length ; i++) {
                element[i].href = "/user/"+jsonObj2.nombre;
                element[i].style.display = "inline";
            }
    }
};

xhttp.open("GET", "/nombre", true);
xhttp.send();

