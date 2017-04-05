var xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = function() {
    if(this.readyState==4 && this.status==200) {
        var jsonObj = JSON.parse(this.responseText);

        for(i = 0 ; i < jsonObj.length ; i++) {
            var tr = document.createElement("tr");
            var col1 = tr.insertCell(0);
            var lautor = document.createElement("a");
            window.alert(jsonObj[i].autor);
            lautor.href = "/user/"+jsonObj[i].autor;
            lautor.innerHTML = jsonObj[i].autor;
            col1.appendChild(lautor);
            var col2 = tr.insertCell(1);
            col2.innerHTML = jsonObj[i].tipo;
            var col3 = tr.insertCell(2);
            if(jsonObj[i].tipo == "texto") col3.innerHTML = jsonObj[i].texto;
            else if(jsonObj[i].tipo == "imagen") {
                var image = document.createElement("img");
                image.src = jsonObj[i].imagen;
                image.width = 100;
                image.height = 100;
                col3.appendChild(image);
            }
            else if(jsonObj[i].tipo == "link") {
                var link = document.createElement("a");
                link.href = jsonObj[i].link_url;
                link.innerHTML = "Enlace";
                col3.appendChild(link);
            }
            else col3.innerHTML = "Unknown content type";

            content_table.appendChild(tr);
        }
    }
};

xhttp.open("GET", "/all_content", true);
xhttp.send();

