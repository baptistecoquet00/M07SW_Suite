<?php
    $nom = "ba";
    $mdp = "ba";
    try{
        $maconnexion = new PDO('mysql:host=localhost;dbname=M07Drone;charset=utf8',$nom,$mdp);
    }catch(PDOException $e){
        die('Connexion à la Base de données : ECHEC');
    }
    
    // récuperer le contenue d'un fichier JSON
    $donneesVolJSON = file_get_contents("php://input");

    //  convertir JSON en un tableau associatif
    $donneesVolAssoc = json_decode($donneesVolJSON, true);
	
    // afficher le JSON
    print_r($donneesVolAssoc);

    // Récupérer l'états de vol du drone
    //$Etatvol = $donneesVolAssoc['etats'][0];
    
    //print_r($Etatvol);
   
   

    
   

    // Récuperation du chemin 
    $req_path = $_SERVER['PATH_INFO'];

    // Récupération de la méthode
    $req_typ = $_SERVER['REQUEST_METHOD'];
    
    if(isset($req_path)){
        $req_data = explode("/", $req_path);
    }

    if ($req_typ == 'POST'){
         // convertion du temps au format date
        $time = $donneesVolAssoc['time'];
        $date = date('Y-m-d H:i:s',$time);
        //echo $date."\n";
    

        $NomVol = $donneesVolAssoc['nom'];
        $refDrone = $donneesVolAssoc['numero'];

        if(isset($NomVol)){
            
            $req = "SELECT idutilisateur FROM utilisateur WHERE nom = ?";
            $reqpreparer = $maconnexion->prepare($req);
            $tableauDeDonnees=array($NomVol);
            $reqpreparer->execute($tableauDeDonnees);
            $reponse=$reqpreparer ->fetchAll(PDO::FETCH_ASSOC);
            $reqpreparer->closeCursor();
           
            if(!empty($reponse))
            {
                $idutilisateur = $reponse[0]['idutilisateur'];
                setcookie($idutilisateur,time()+3600);
            }
            else
            {
                $req = "INSERT INTO utilisateur(nom) VALUES(?)";
                $reqpreparer = $maconnexion->prepare($req);
                $tableauDeDonnees=array($NomVol);
                $reqpreparer->execute($tableauDeDonnees);
                $idutilisateur= $maconnexion->lastInsertId();
            }  
            print_r($idutilisateur);      
        }
        if(isset($refDrone))
        {   
            $req = "SELECT iddrone FROM drone WHERE refDrone = ?";
            $reqpreparer = $maconnexion->prepare($req);
            $tableauDeDonnees=array($refDrone);
            $reqpreparer->execute($tableauDeDonnees);
            $reponse=$reqpreparer ->fetchAll(PDO::FETCH_ASSOC);
            $reqpreparer->closeCursor();
            
            if(!empty($reponse))
            {
                $iddrone = $reponse[0]['iddrone'];
                setcookie($iddrone,time()+3600);
            }
            else 
            {
                $req = "INSERT INTO drone(refDrone) VALUES(?)";
                $reqpreparer = $maconnexion->prepare($req);
                $tableauDeDonnees=array($refDrone);
                $reqpreparer->execute($tableauDeDonnees);
                $iddrone= $maconnexion->lastInsertId();
            }
            print_r($iddrone); 
        }
        if(isset($date) && isset($NomVol)){
            $req = "SELECT u.nom,v.* FROM utilisateur as u INNER JOIN vol as v on u.idutilisateur = v.idutilisateur Where u.nom = ? and v.dateVol = ?";
            $reqpreparer = $maconnexion->prepare($req);
            $tableauDeDonnees=array($NomVol,$date);
            $reqpreparer->execute($tableauDeDonnees);
            $reponse=$reqpreparer ->fetchAll(PDO::FETCH_ASSOC);
            $reqpreparer->closeCursor();
            
            if(!empty($reponse)){
                
                $idvol = $reponse[0]['idvol'];
                setcookie($idvol,time()+3600);
            }else{
                $req = "INSERT INTO vol (idutilisateur,dateVol,iddrone) VALUES (?,?,?) ";
                $reqpreparer = $maconnexion->prepare($req);
                $tableauDeDonnees=array($idutilisateur,$date,$iddrone);               
                $reqpreparer->execute($tableauDeDonnees);
                $idvol= $maconnexion->lastInsertId();
            }
            print_r($idvol);

            //$req = "SELECT u.nom,v.dateVol FROM utilisateur as u INNER JOIN vol as v on u.idutilisateur = v.idutilisateur Where u.nom = ?";
            //$req = "INSERT INTO vol (idutilisateur,dateVol,iddrone) VALUES (?,?,?) WHERE iddrone = (SELECT iddrone FROM  drone WHERE refDrone = ? ) and idutilisateur = (SELECT idutilisateur FROM utilisateur where nom = ?)";
        }
        if(isset($Etatvol)){
            $req = "INSERT INTO etat(idvol,pitch,roll,yaw,vgx,vgy,vgz,templ,temph,tof,h,bat,baro,time,agx,agy,agz) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
            $reqpreparer = $maconnexion->prepare($req);
            /////////////////////////////////////////
            $tableauDeDonnees=array($idvol);
            //echo "Nombre d'états recu : " . count($donneesVolAssoc['etats']);

            for ($i = 0; $i < count($donneesVolAssoc['etats']) ; $i++){
                foreach ($donneesVolAssoc['etats'][$i] as $v) {
                    array_push( $tableauDeDonnees,$v);
                 }
                 // Execution de la requete
                 $reqpreparer->execute($tableauDeDonnees);
                 // vider le tableau $tableauDeDonnees pour recommencer
                 $tableauDeDonnees = [$idvol];
                 
            }
            
            //
            //////////////////////////////// 
        }
    }
    elseif($req_typ == "GET"){
        if(isset($req_data[1]) && $req_data[1]=='nbdrone' && !isset($req_data[2])){
           
            $req = "SELECT count(iddrone) as nbdrone from drone ";
            $reqpreparer = $maconnexion->prepare($req);
            $tableauDeDonnees=array();
            $reqpreparer->execute($tableauDeDonnees);
            $reponse=$reqpreparer ->fetchAll(PDO::FETCH_ASSOC);
            $reqpreparer->closeCursor();
            print_r(json_encode($reponse));

        }elseif(isset($req_data[1]) && $req_data[1]=='nbvol' && !isset($req_data[2])){
           
            $req = "SELECT count(idvol) as nbvol from vol";
            $reqpreparer = $maconnexion->prepare($req);
            $tableauDeDonnees=array();
            $reqpreparer->execute($tableauDeDonnees);
            $reponse=$reqpreparer ->fetchAll(PDO::FETCH_ASSOC);
            $reqpreparer->closeCursor();
            print_r(json_encode($reponse));

        }elseif(isset($req_data[1]) && $req_data[1]=='nbutilisateur' && !isset($req_data[2])){
           
            $req = "SELECT count(idutilisateur) as nbutilisateur from utilisateur ";
            $reqpreparer = $maconnexion->prepare($req);
            $tableauDeDonnees=array();
            $reqpreparer->execute($tableauDeDonnees);
            $reponse=$reqpreparer ->fetchAll(PDO::FETCH_ASSOC);
            $reqpreparer->closeCursor();
            print_r(json_encode($reponse));

        }elseif(isset($req_data[1]) && $req_data[1]=="utilisateur" && !isset($req_data[2])){
            
            $req = "SELECT * FROM utilisateur";
            $reqpreparer = $maconnexion->prepare($req);
            $tableauDeDonnees=array();
            $reqpreparer->execute($tableauDeDonnees);
            $reponse=$reqpreparer ->fetchAll(PDO::FETCH_ASSOC);
            $reqpreparer->closeCursor();
            print_r(json_encode($reponse));

        }elseif(isset($req_data[1]) && $req_data[1]=="drone" && !isset($req_data[2])){
            
            $req = "SELECT * FROM drone";
            $reqpreparer = $maconnexion->prepare($req);
            $tableauDeDonnees=array();
            $reqpreparer->execute($tableauDeDonnees);
            $reponse=$reqpreparer ->fetchAll(PDO::FETCH_ASSOC);
            $reqpreparer->closeCursor();
            print_r(json_encode($reponse));

        }elseif(isset($req_data[1]) && $req_data[1]=="vol" && !isset($req_data[2])){
            
            $req = "SELECT * FROM vol";
            $reqpreparer = $maconnexion->prepare($req);
            $tableauDeDonnees=array();
            $reqpreparer->execute($tableauDeDonnees);
            $reponse=$reqpreparer ->fetchAll(PDO::FETCH_ASSOC);
            $reqpreparer->closeCursor();
            
            print_r(json_encode($reponse));
        }elseif(isset($req_data[1]) && $req_data[1]=="graphe"){
            if(isset($req_data[2])  && $req_data[1]=="graphe"){
                if(isset($req_data[3]) &&  $req_data[3]== "h" && $req_data[1]=="graphe" ){
            
                    $req = "SELECT idetat,h , idvol FROM etat where idvol = ?";
                    $reqpreparer = $maconnexion->prepare($req);
                    $tableauDeDonnees=array($req_data[2]);
                    $reqpreparer->execute($tableauDeDonnees);
                    $reponse=$reqpreparer ->fetchAll(PDO::FETCH_ASSOC);
                    $reqpreparer->closeCursor();
                    print_r(json_encode($reponse));
            
                }
            }
        }

    }
?>