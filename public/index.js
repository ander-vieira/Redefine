$(document).ready(function() {
    $.ajax({
        url: "http://localhost:3000/insultos"
    }).then(function(data) {
       var tabla = document.getElementById("tabla");

       for (i = 0; i < data.length; i++)
       {
         var tr = document.createElement("tr");

         var x = tr.insertCell(0);
         var y = tr.insertCell(1);

         x.innerHTML = data[i].nombre;
         y.innerHTML = data[i].insulto;

         tabla.appendChild(tr);
       }
    });
});
