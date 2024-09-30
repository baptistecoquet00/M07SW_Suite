function suiviAjax(){
    console.debug("Plan ! ");
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var reponse = xhttp.responseText;
            console.debug(reponse);
            document.getElementsByTagName("section")[0].innerHTML = reponse;
        }
    };
    xhttp.open("GET", "suivi.html", true);
    xhttp.send(); 
}

function recupererNombreDrone(){
    
}
function recupererNombreVol(){}
function recupererNombreUtilisateur(){} 