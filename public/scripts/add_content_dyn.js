function change_display() {
  if(document.getElementById('radio1').checked) {
    document.getElementById('input_texto').style.display='block';
    document.getElementById('input_imagen').style.display='none';
    document.getElementById('input_link').style.display='none';
  }

  else if(document.getElementById('radio2').checked) {
    document.getElementById('input_texto').style.display='none';
    document.getElementById('input_imagen').style.display='block';
    document.getElementById('input_link').style.display='none';
  }

  else if(document.getElementById('radio3').checked) {
    document.getElementById('input_texto').style.display='none';
    document.getElementById('input_imagen').style.display='none';
    document.getElementById('input_link').style.display='block';
  }
}
