var content_page_size;
var content_initial_page = 3;
var current_tab;

function reset_tag_bg() {
    var list = document.getElementsByClassName("content_tab");

    for(var i = 0 ; i < list.length ; i++) {
        list[i].style.backgroundColor = "#BFBFFF";
    }
}

function empty_content_box() {
    for(var count = content_table.rows.length-1 ; count > 0 ; count--)
    {
        content_table.deleteRow(count);
    }
}

function see_more_content() {
    content_page_size += content_initial_page;
    add_content(current_tab);
}

function get_user_avatar(nombre, img) {
    var xhttp1 = new XMLHttpRequest();
    var params = JSON.stringify({"nombre":nombre});

    xhttp1.open("POST", "/user_data", true);

    xhttp1.setRequestHeader("Content-type", "application/json; charset=utf-8");
    xhttp1.setRequestHeader("Content-length", params.length);

    xhttp1.onreadystatechange = function() {
        if(this.readyState==4 && this.status==200) {
            var jsonObj2 = JSON.parse(this.responseText);
            img.src = jsonObj2.avatar;
        }
    };

    xhttp1.send(params);
}

function add_content(service) {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if(this.readyState==4 && this.status==200) {
            var jsonObj = JSON.parse(this.responseText);

            empty_content_box();

            if(content_page_size < jsonObj.length)
                document.getElementById("content_see_more").style.display = "inline";
            else
                document.getElementById("content_see_more").style.display = "none";

            for(i = 0 ; i < jsonObj.length && i < content_page_size ; i++) {
                var tr = document.createElement("tr");
                var col1 = tr.insertCell(0);
                var lautor = document.createElement("a");
                lautor.href = "/user/"+jsonObj[i].autor;
                lautor.target = "blank";
                lautor.innerHTML = jsonObj[i].autor;
                col1.appendChild(lautor);
                col1.appendChild(document.createElement("br"));

                var img = document.createElement("img");
                img.className += "content_avatar";
                get_user_avatar(jsonObj[i].autor, img);
                col1.appendChild(img);

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

    xhttp.open("GET", service, true);
    xhttp.send();
}

function click_new_tab() {
    reset_tag_bg();
    document.getElementById("new_tab").style.backgroundColor = "#3333FF";

    content_page_size = content_initial_page;
    current_tab = "all_content";
    add_content("/all_content");
}

function click_my_tab() {
    reset_tag_bg();
    document.getElementById("my_tab").style.backgroundColor = "#3333FF";

    content_page_size = content_initial_page;
    current_tab = "my_content";
    add_content("/my_content");
}


window.onload = function() {
    document.getElementById("new_tab").addEventListener("click", click_new_tab);
    document.getElementById("my_tab").addEventListener("click", click_my_tab);
    click_new_tab();
};
