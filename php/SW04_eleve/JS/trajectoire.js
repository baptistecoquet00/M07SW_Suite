let x = document.getElementById("InputX");
let y = document.getElementById("InputY");
let titre_trajectoire = document.getElementById('titre_trajectoire');

let isStartingPosition = false;
var lastX;
var lastY;

function affichertrajectoire(){
    console.debug("trajectoire ! ");
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200){
            const reponse = xhttp.responseText;
            console.debug(reponse);
            document.getElementsByTagName("section")[0].innerHTML = reponse;
            DessinerPlan();
        }
    };
    xhttp.open("GET", "trajectoire.html", true);
    xhttp.send(); 
}

function DessinerPlan(){
    console.debug("Chargement de la page.?");
    const canvas = document.getElementById("canvas_trajectoire");
    canvas.width = 1100;
    canvas.height = 800;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = 'icones/plan.png';
    img.onload = function () {
        ctx.drawImage(img, 0, 0);
        }
}

function FormCreate(){
    console.log("Formulaire ?");
    const form =  "<p>Titre de la trajectoire</p><input type='text' name='titre_trajectoire' id='titre_trajectoire' placeholder='Titre de la trajectoire'/><p>Ecrire / Tracer les commandes</p><input type='text' name='InputX' id='InputX' placeholder='x'><input type='text' name='InputY' id='InputY' placeholder='y'><input type='button' value='Enregistrer' onclick='enregistrerTrajectoire("+titre_trajectoire+")'><input type='button' value='Tracer' onclick='dessinerTrajectoire("+x+","+y+")'><input type='button' value='Effacer' onclick='Effacer()'><div id='afficher_commande'></div>";
    document.getElementById("FormTrajectoire").innerHTML=form;
}

function FormCharge(){
    let form = "<p>Liste des trajectoire</p>";
    form += afficher_table_trajectoire();
    document.getElementById("FormTrajectoire").innerHTML=form;
}



function dessinerTrajectoire(x,y) {
    let commande;
    let div_commande = document.getElementById('afficher_commande');
    const canvas = document.getElementById("canvas_trajectoire");
    const ctx = canvas.getContext("2d");

    x = document.getElementById("InputX").value;
    y = document.getElementById("InputY").value;
    x = parseInt(x);
    y = parseInt(y);
 
    
    if(isStartingPosition==false){
        isStartingPosition = true;
        ctx.moveTo(x, y);
        ctx.moveTo(x-5, y-5);
        ctx.lineTo(x+5, y+5);
        ctx.moveTo(x+5, y-5);
        ctx.lineTo(x-5, y+5);
        ctx.stroke();
        lastX = x;
        lastY = y;
        commande = "<p>start "+x+" "+y+ "</p>";
        commande += "<p>command</p>";
        commande += "<p>takeoff</p>";
        div_commande.innerHTML += commande;
    }else{
        console.log(lastX,lastY);
        ctx.moveTo(lastX,lastY);
        ctx.lineTo(x+lastX,y+lastY);
        ctx.moveTo(x+lastX-5, y+lastY-5);
        ctx.lineTo(x+lastX+5, y+lastY+5);
        ctx.moveTo(x+lastX+5, y+lastY-5);
        ctx.lineTo(x+lastX-5, y+lastY+5);
        ctx.stroke();
        commande = "<p> go "+x+" "+y+" 0 50 </p>"
        div_commande.innerHTML += commande;
        lastX += x;
        lastY += y;
    }
}

function Effacer(){
    isStartingPosition = false;
    const canvas = document.getElementById("canvas_trajectoire");
    let div_commande = document.getElementById('afficher_commande');
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    DessinerPlan();
    div_commande.innerHTML = "";
}

function jsontest(){
    
    titre = document.getElementById('titre_trajectoire').value;

    let div_commande = document.getElementById('afficher_commande').childNodes;
    
    let json = {"titre": titre,"trajectoire" : []};
    
    json.trajectoire = [];
    for(let j=0;j<div_commande.length;j++){
        let command = {"commande" : div_commande[j].innerText,"ordre" : j};
        json.trajectoire.push(command);        
    } 
    
    console.log(json);
    return json;   
}

function enregistrerTrajectoire(titre) {
    titre = document.getElementById('titre_trajectoire').value;
    if(titre == ""){
        alert("Titre vide");
    }else{
        console.debug("trajectoire enregistrer ");
        var donnees = jsontest();
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200){
                const reponse = xhttp.responseText;
                console.debug(reponse);
                
            }
        }
        xhttp.open("POST", "http://172.20.21.212/~ba/M07/php/rest.php/trajectoire", true);
        xhttp.send(JSON.stringify(donnees)); 
    }

}

function afficher_table_trajectoire(){
    let idlistetrajectoire;
    let TitreTrajectoire;
    let Action;
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let reponse=this.responseText;
            let ListeTrajectoire = JSON.parse(reponse);
            console.log(reponse);
            let html = "<table>";
            html += "<tr><th>ID</th><th>Titre</th><th>Action</th></tr>";
            for(let i = 0;i<ListeTrajectoire.length;i++){
                idlistetrajectoire = ListeTrajectoire[i].idlistetrajectoire;
                TitreTrajectoire = ListeTrajectoire[i].titre;
                Action = "<img src='icones/corbeille2.png' alt='Corbeille'onclick='Delete_trajectoire("+idlistetrajectoire+")'><img src='icones/itineraire2.png' alt='itineraire' onclick='afficher_trajectoire("+idlistetrajectoire+")'><img src='icones/download2.png' alt='download'>"
                html += "<tr><td>" + idlistetrajectoire +"</td><td>"+TitreTrajectoire+"</td><td>"+Action+"</td></tr>";
            }
            document.getElementById('FormTrajectoire').innerHTML = html
        }
    }
    xhttp.open("GET", "http://172.20.21.212/~ba/M07/php/rest.php/trajectoire");
    xhttp.send(); 

}

function Delete_trajectoire(id){
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        const reponse = xhttp.responseText;
        console.debug(reponse);
        afficher_table_trajectoire()
    }
    xhttp.open("DELETE", "http://172.20.21.212/~ba/M07/php/rest.php/trajectoire/"+id+"");
    xhttp.send(); 
}

function afficher_trajectoire(id){
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        const reponse = xhttp.responseText;
        console.debug(reponse);
    }
    xhttp.open("GET", "http://172.20.21.212/~ba/M07/php/rest.php/trajectoire/"+id+"");
    xhttp.send(); 
}