var xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = function() {
    if(this.readyState==4 && this.status==200) {
        var jsonObj = JSON.parse(this.responseText);

        for(i = 0 ; i < jsonObj.length ; i++) {
            var tr = document.createElement("tr");
            var col1 = tr.insertCell(0);
            col1.innerHTML = jsonObj[i].autor;
            var col2 = tr.insertCell(1);
            col2.innerHTML = jsonObj[i].tipo;
            var col3 = tr.insertCell(2);
            if(jsonObj[i].tipo == "texto") col3.innerHTML = jsonObj[i].texto;
            else if(jsonObj[i].tipo == "imagen") {
                var image = document.createElement("img");
                image.src = jsonObj[i].imagen;
                image.width = 200;
                image.height = 200;
                col3.appendChild(image);
            }
            else col3.innerHTML = "Unknown content type";

            content_table.appendChild(tr);
        }
    }
};

xhttp.open("GET", "/all_content", true);
xhttp.send();

