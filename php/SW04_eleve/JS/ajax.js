function suiviAjax(){
    console.debug("Plan ! ");
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200){
            const reponse = xhttp.responseText;
            console.debug(reponse);
            document.getElementsByTagName("section")[0].innerHTML = reponse;
        }
    };
    xhttp.open("GET", "suivi.html", true);
    xhttp.send(); 
}

function recupererNombreDrone(){
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200){
            const reponse=this.responseText;
            nbdrone = JSON.parse(reponse);
            console.log(reponse);
            iddrone = reponse[19];
            console.log(iddrone);
            document.getElementById("nbdrone").innerHTML = iddrone;
        }
    };
    xhttp.open("GET", "http://172.20.21.212/~ba/M07/php/rest.php/nbdrone");
    xhttp.send(); 
}
function recupererNombreVol(){
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200){
            const reponse=this.responseText;
            nbvol = JSON.parse(reponse);
            console.log(reponse);
            idvol= reponse[17] + reponse[18];
            console.log(idvol);
            document.getElementById("fly").innerHTML = idvol;
        }
    };
    xhttp.open("GET", "http://172.20.21.212/~ba/M07/php/rest.php/nbvol");
    xhttp.send(); 
}
function recupererNombreUtilisateur(){
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200){
            const reponse=this.responseText;
            Listecapteur = JSON.parse(reponse);
            console.log(reponse);
            idutilisateur = reponse[25]+reponse[26];
            console.log(idutilisateur);
            document.getElementById("man").innerHTML = idutilisateur;
        }
    };
    xhttp.open("GET", "http://172.20.21.212/~ba/M07/php/rest.php/nbutilisateur");
    xhttp.send(); 
} 