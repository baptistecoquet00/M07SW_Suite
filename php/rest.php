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
    $Etatvol = $donneesVolAssoc['etats'];
    
    // convertion du temps au format date
    $time = $donneesVolAssoc['time'];
    $date = date('Y-m-d H:i:s',$time);
    

    $NomVol = $donneesVolAssoc['nom'];
    $refDrone = $donneesVolAssoc['numero'];
    
    $req_typ = $_SERVER['REQUEST_METHOD'];
    if ($req_typ == 'POST'){
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
                setcookie($idutilisateur,3600);
            }
            else
            {
                $req = "INSERT INTO utilisateur(nom) VALUES(?)";
                $reqpreparer = $maconnexion->prepare($req);
                $tableauDeDonnees=array($NomVol);
                $reqpreparer->execute($tableauDeDonnees);
                $reponse= $maconnexion->lastInsertId();
            }  
            print_r($reponse);      
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
                setcookie($iddrone,3600);
            }
            else 
            {
                $req = "INSERT INTO drone(refDrone) VALUES(?)";
                $reqpreparer = $maconnexion->prepare($req);
                $tableauDeDonnees=array($refDrone);
                $reqpreparer->execute($tableauDeDonnees);
                $reponse= $maconnexion->lastInsertId();
            }
            print_r($reponse); 
        }
    }
    
    
    
    //$sql_nom_date = "SELECT u.nom,v.dateVol FROM utilisateur as u INNER JOIN vol as v on u.idutilisateur = v.idutilisateur";
		

?>