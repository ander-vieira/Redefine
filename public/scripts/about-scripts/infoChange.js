//Script para cambiar la info mostrada en la pagina about_us. Tenemos que asegurarnos de que tanto titles como infos y wallpp tengan la misma longitud
//de lo contario, dara errores o no cambiara el fondo, etc........

titles = [
  "¡Bienvenido a Redefine!",
  "Zona Personal",
  "Catálogo y Novedades",
  "Grupos y Clanes"
];
infos = [
  "En Redefine ofrecemos un punto de encuentro para jugadores y desarrolladores.",
  "En tu zona personal podras subir contenido y compartirlo con la comunidad. Utilízalo para darte a conocer o trabajar en modo privado, tu decides!",
  "Mira las últimas novedades en videojuegos, consolas y lanzamientos o visita las últimas publicaciones de las personas a las que sigues. Descubre lo que te espera en Redefine.",
  "Si tienes un grupo o un clan y quieres que la gente os conozca, Redefine es vuestro hogar. Crea ahora un grupo y empieza a colaborar con otras personas!"
];
wallpp = [
  "url(../media/Backgrounds/Fondos/w01.jpg) no-repeat center",
  "url(../media/Backgrounds/Fondos/w06.jpg) no-repeat center",
  "url(../media/Backgrounds/Fondos/w07.jpg) no-repeat center",
  "url(../media/Backgrounds/Fondos/w05.jpg) no-repeat center"
];

var actualInfo = 0;

$(document).ready(function() {

  document.getElementById('infoTitle').innerHTML = titles[0];
  document.getElementById('infoInfo').innerHTML = infos[0];
  document.getElementById('aboutus').style.background = wallpp[0];

  $("#changer_left").click(function() {

    actualInfo += -1;

    if (actualInfo < 0) {
      actualInfo = titles.length - 1;
    }

    $("#aboutus").fadeOut(200, function() {
      title = document.getElementById('infoTitle').innerHTML = titles[actualInfo];
      info = document.getElementById('infoInfo').innerHTML = infos[actualInfo];
      aboutus = document.getElementById('aboutus').style.background = wallpp[actualInfo];
      $("#aboutus").fadeIn(200);
    });
  });

  $("#changer_right").click(function() {

    actualInfo += 1;

    if (actualInfo > titles.length - 1) {
      actualInfo = 0;
    }

    $("#aboutus").fadeOut(200, function() {
      title = document.getElementById('infoTitle').innerHTML = titles[actualInfo];
      info = document.getElementById('infoInfo').innerHTML = infos[actualInfo];
      aboutus = document.getElementById('aboutus').style.background = wallpp[actualInfo];
      $("#aboutus").fadeIn(200);
    });
  });
});
