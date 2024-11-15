
create table if not exists listeCommande(
    idlistCommande int not null, 
    nom varchar(45),
    primary key(idlistCommande)
);

create table if not exists utilisateur(
    idutilisateur int not null,
    nom varchar(45),
    prenom varchar(45),
    email varchar(45),
    naissance date,
    pseudo varchar(45),
    mdp varchar(45),
    primary key(idutilisateur)
);

create table if not exists drone(
    iddrone int not null,
    marque varchar(45),
    modele varchar(45),
    refDrone varchar(45),
    dateAchat timestamp,
    primary key(iddrone)
);


create table if not exists vol(
    idvol int not null,
    idutilisateur int not null,
    dateVol timestamp,
    iddrone int not null,
    primary key(idvol),
    constraint fk_idutilisateur foreign key(idutilisateur)
    references utilisateur(idutilisateur),
    constraint fk_iddrone foreign key(iddrone)
    references drone(iddrone) 
);

create table if not exists etat(
    idetat int not null,
    idvol int not null,
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
    primary key(idetat),
    constraint fk_idvol foreign key(idvol) references vol(idvol)    
);

create table if not exists commande(
    idcommande int not null,
    idetat int not null,
    idlisteCommande int not null,
    valeur varchar(11),
    time_ms int,
    primary key(idcommande),
    constraint fk_idetat foreign key(idetat) references etat(idetat),
    constraint fk_listeCommande foreign key (idlisteCommande) 
    references listeCommande(idlistCommande)
);

create table if not exists listeTrajectoire(
    idlistetrajectoire int not null auto_increment,
    titre varchar(45),
    type varchar(45),
    constraint fk_listetrajectoire primary key(idlistetrajectoire)
);

create table if not exists trajectoire(
    idtrajectoire int not null auto_increment,
    idlistetrajectoire int not null,
    commande varchar(45),
    primary key(idtrajectoire),
    constraint fk_listetrajectoire foreign key(idlistetrajectoire) references listeTrajectoire(idlistetrajectoire)
);


