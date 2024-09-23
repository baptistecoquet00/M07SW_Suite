
create table listeCommande(
    idlistCommande int not null, 
    nom varchar(45),
    primary key(idlistCommande)
);

create table utilisateur(
    idutilisateur int not null,
    nom varchar(45),
    prenom varchar(45),
    email varchar(45),
    naissance date,
    pseudo varchar(45),
    mdp varchar(45),
    primary key(idutilisateur)
);

create table etat(
    idetat int not null,
    idvol int,
    pitch float,
    roll float,
    yaw float,
    vgx float,
    vgy float,
    vgz float,
    templ int,
    temph int,
    tof int,
    h int,
    bat int,
    baro float,
    time int,
    agx float,
    agy float,
    agz float,
    primary key(idetat)
    
);

create table commande(
    idcommande int not null,
    idetat int not null,
    idlisteCommande int not null,
    valeur varchar(11),
    time_ms int,
    primary key(idcommande),
    constraint fk_ideat foreign key(idetat) references etat(idetat),
    constraint fk_listeCommande foreign key (idlisteCommande) 
    references listeCommande(idlistCommande)
);

create table drone(
    iddrone int not null,
    marque varchar(45),
    modele varchar(45),
    refDrone varchar(45),
    dateAchat timestamp,
    primary key(iddrone)
);

create table vol(
    idvol int not null,
    idutilisateur int not null,
    dateVol timestamp,
    iddrone int not null,
    constraint fk_idutilisateur foreign key(idutilisateur)
    references utilisateur(idutilisateur),
    constraint fk_iddrone foreign key(iddrone)
    references drone(iddrone) 
);