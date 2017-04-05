function click_tab() {
    document.getElementById("new_tab").style.backgroundColor = "#3333FF";
}

window.onload = function() {
    document.getElementById("new_tab").addEventListener("click", click_tab);
};
