var valid_img = false;

function empty_avatar() {
    var node = document.getElementById("avatar_dyn");

    while(node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    }
}

function test_image() {
    var img = new Image();

    img.onerror = img.onabort = function() {
        valid_img = false;
        img.style.display = "none";
    };

    img.onload = function() {
        valid_img = true;
    };

    img.src = document.getElementById("avatar_input").value;

    img.id="user_page_avatar";

    empty_avatar();

    document.getElementById("avatar_dyn").appendChild(img);
}

function check_form_data() {
    var avatar = document.getElementById("avatar_input");
    var desc = document.getElementById("desc_input");

    avatar.style.backgroundColor = "#7777FF";
    desc.style.backgroundColor = "#7777FF";

    if(desc.value == null || desc.value == "")
    {
        alert("Invalid description");
        desc.style.backgroundColor = "#FF7777";
        return false;
    }

    if(avatar.value == null || avatar.value == "" || valid_img == false)
    {
        alert("Invalid avatar");
        avatar.style.backgroundColor = "#FF7777";
        return false;
    }

    return true;
}

function get_prev_values() {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if(this.readyState==4 && this.status==200) {
            var data = JSON.parse(this.responseText);

            document.getElementById("avatar_input").value = data.avatar;
            document.getElementById("desc_input").value = data.desc;
        }
    });

    xhttp.open("GET", "/user_data", true);

    xhttp.send();
}

window.onload = function() {
    test_image();

//    get_prev_values();
};
