import('chart.js');

function suiviAjax(){
    console.debug("Plan ! ");
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200){
            const reponse = xhttp.responseText;
            console.debug(reponse);
            document.getElementsByTagName("section")[0].innerHTML = reponse;
            recupererNombreDrone();
            recupererNombreVol();
            recupererNombreUtilisateur();
            recupererDonneesHauteurVol();
        }
    };
    xhttp.open("GET", "suivi.html", true);
    xhttp.send(); 
}

function afficherHauteur(idvol){
    console.log("ID vol recu : " + idvol);
    console.debug("Plan ! ");
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200){
            const reponse = xhttp.responseText;
            //console.debug(reponse);
            document.getElementsByTagName("section")[0].innerHTML = reponse;
            recupererDonneesHauteurVol(idvol);
        }
    }
    xhttp.open("GET", "graph.html", true);
    xhttp.send(); 
}

function recupererNombreDrone(){
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200){
            const reponse=this.responseText;
            rep = JSON.parse(reponse);
            console.log(rep);
            iddrone = rep[0].nbdrone;
            console.log(iddrone);
            document.getElementById("Mydrone").innerHTML = iddrone;
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
            rep = JSON.parse(reponse);
            //console.log(reponse);
            idvol= rep[0].nbvol;
            //console.log(idvol);
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
            rep = JSON.parse(reponse);
            idutilisateur = rep[0].nbutilisateur;
            console.log(idutilisateur);
            document.getElementById("man").innerHTML = idutilisateur;
        }
    };
    xhttp.open("GET", "http://172.20.21.212/~ba/M07/php/rest.php/nbutilisateur");
    xhttp.send(); 
} 

function recupererDonneesDrones(){
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    
        if (this.readyState == 4 && this.status == 200) {
            let reponseAPI=JSON.parse(this.responseText);
            console.log(reponseAPI);
            let table="<div ><table class='tableau_statistique '><tr class='centrer'><th>Numéro drône</th><th>Marque</th><th>Modèle</th><th>Référence</th><th>Date achat</th></tr>";
            for(let i=0;i<reponseAPI.length;i++){
                table+="<tr class='centrer'>";
                let donneesVol=reponseAPI[i];
                table+="<td>"+donneesVol.iddrone+"</td>";
                table+="<td>"+donneesVol.marque+"</td>";
                table+="<td>"+donneesVol.modele+"</td>";
                table+="<td>"+donneesVol.refDrone+"</td>";
                table+="<td>"+donneesVol.dateAchat+"</td>";
                table += "<td><button>Mettre à jour</button></td>";
                table+="</tr>";
            }
            table+="</table></div>";
            document.getElementById("section").innerHTML=table;
        };
    }
    xhttp.open("GET", "http://172.20.21.212/~ba/M07/php/rest.php/drone");
    xhttp.send();
}

function recupererDonneesVols(){
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    
    if (this.readyState == 4 && this.status == 200) {
       
        let reponseAPI=JSON.parse(this.responseText);
        //console.log(reponseAPI);

        let table="<div ><table class='tableau_statistique '><tr class='centrer'><th>Numéro de vol</th><th>Numéro utilisateur</th><th>Date de vol</th><th>Numéro de drone</th></tr>";
        
        for(let i=0;i<reponseAPI.length;i++){
            table+="<tr class='centrer'>";
            let donneesVol=reponseAPI[i];
            let dataidvol = donneesVol.idvol;
            table+="<td>"+donneesVol.idvol+"</td>";
            table+="<td>"+donneesVol.idutilisateur+"</td>";
            table+="<td>"+donneesVol.dateVol+"</td>";
            table+="<td>"+donneesVol.iddrone+"</td>";
            table += "<td><button data-idvol="+dataidvol+" onclick='afficherHauteur("+dataidvol+")'>Graphe</button></td>";
            table+="</tr>";
            console.log(dataidvol);
        }
        
        table+="</table></div>";
       
        document.getElementById("section").innerHTML=table;
    
        };
    }
    
    xhttp.open("GET", "http://172.20.21.212/~ba/M07/php/rest.php/vol");
    xhttp.send();

}

function recupererDonneesUtilisateur(){
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    
        if (this.readyState == 4 && this.status == 200) {
            let reponseAPI=JSON.parse(this.responseText);
            console.log(reponseAPI);
            let table="<div ><table class='tableau_statistique '><tr class='centrer'><th>Numéro d'utilisateur</th><th>Nom</th><th>Prenom</th><th>Email</th><th>Naissance</th><th>Pseudo</th><th>mdp</th></tr>";
            for(let i=0;i<reponseAPI.length;i++){
                table+="<tr class='centrer'>";
                
                let donneesVol=reponseAPI[i];
                
                table+="<td>"+donneesVol.idutilisateur+"</td>";
                table+="<td>"+donneesVol.nom+"</td>";
                table+="<td>"+donneesVol.prenom+"</td>";
                table+="<td>"+donneesVol.email+"</td>";
                table+="<td>"+donneesVol.naissance+"</td>";
                table+="<td>"+donneesVol.pseudo+"</td>";
                table+="<td>"+donneesVol.mdp+"</td>";
                table += "<td><button>Mettre à jour</button></td>";
                table+="</tr>";  
            }
            table+="</table></div>";
            document.getElementById("section").innerHTML=table;
        };
    }
    
    xhttp.open("GET", "http://172.20.21.212/~ba/M07/php/rest.php/utilisateur");
    xhttp.send();

}


function recupererDonneesHauteurVol(idvol){
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let reponseAPI=JSON.parse(this.responseText);
            console.log(reponseAPI);
            let x=[];let y=[];
        for(let i = 0 ; i<reponseAPI.length; i++){
            let donneesHauteur = reponseAPI[i];
            x[i] = donneesHauteur.idetat;
            y[i] = donneesHauteur.h;
            //idvol[i]= donneesHauteur.idvol; 
            //console.log({idvol});
        }
        Graph(x,y);
       
        }
    }
    
    xhttp.open("GET", "http://172.20.21.212/~ba/M07/php/rest.php/graphe/"+idvol +"/h");
    xhttp.send();
}



function Graph(Xaxis,Yaxe) {
    const ctx = document.getElementById('monGraphe');
    new Chart(ctx, {
     type: 'line',
     data: {
        labels: Xaxis,
        datasets: [{ label: 'legende1',
            data: Yaxe,
            yAxisID:'y1',
            borderColor: 'purple',
            borderWidth: 1
            }]
            },
    options: {scales:{y1:{type: 'linear',display:true,position:'left'},y2:
            {type: 'linear',display:true,position:'right'}}},
            
    });
  
}


    