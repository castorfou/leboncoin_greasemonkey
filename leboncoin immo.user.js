// ==UserScript==
// @name         leboncoin immo
// @namespace    leboncoin
// @version      0.4
// @description  Garde le prix des annonces immo, voir ce que j'ai déjà vu, les évolutions de prix, l'age de l'annonce,...
// @author       Guillaume Ramelet
// @match        https://www.leboncoin.fr/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-3.6.0.min.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */


//v0.5 modifiée sur pc explore
<<<<<<< HEAD
//v0.6 avec une bonne gestion de la navigation

$(document).ready(function () {
    console.log('sandbox');
=======

$(document).ready(function() {
>>>>>>> 7c3a466f3cdcffc76e879f7a06d6a30ff1a508dc

    function getMeta(metaName) {
        const metas = document.getElementsByTagName('meta');
        for (let i = 0; i < metas.length; i++) {
            if (metas[i].getAttribute('property') === metaName) {
                return metas[i].getAttribute('content');
            }
        }
       return '';
    }

    function affiche_donnees_annonce(id_annonce) {
        //console.log('affiche_donnees_annonce')
        var annonce_existante = GM_getValue(id_annonce)
        console.log('affiche_donnees_annonce', annonce_existante)
        if ( annonce_existante == undefined) {
            console.log('L annonce',id_annonce, 'n est pas dans le storage');
        } else {
            annonce_existante = JSON.parse(annonce_existante)
            var prix_max = getMax(annonce_existante.prix, 'prix')
            var prix_min = getMin(annonce_existante.prix, 'prix')
            var premiere_visite = getPremiereVisite(id_annonce)
            console.log('prix max', prix_max,' - prix min',prix_min, ' - premiere_visite', premiere_visite)
            affiche_prix_min_max_premiere_visite(prix_min, prix_max, premiere_visite)
        }
    }

    function getMax(arr, prop) {
        console.debug('getMax',arr, prop)
        var max=null;
        for (var i=0 ; i<arr.length ; i++) {
            if (max == null || parseInt(arr[i][prop]) > parseInt(max[prop])) {
                max = arr[i];
            }
        }
        console.debug('max',max[prop])
        return max[prop];
    }

    function getMin(arr, prop) {
        console.debug('getMin',arr, prop)
        var min=null;
        for (var i=0 ; i<arr.length ; i++) {
            if (min == null || parseInt(arr[i][prop]) < parseInt(min[prop])) {
                min = arr[i];
            }
        }
        return min[prop];
    }

    function getOldestDate(arr, prop) {
        console.debug('getOldestDate',arr, prop)
        var oldest=null;
        for (var i=0 ; i<arr.length ; i++) {
            if (oldest == null || Date.parse(arr[i][prop]) < Date.parse(oldest[prop])) {
                oldest = arr[i];
            }
        }
        console.debug('oldest',oldest[prop])
        return oldest[prop];
    }

    function getPremiereVisite(id_annonce) {
        console.debug('getPremiereVisite debut', id_annonce)
        var annonce_existante = GM_getValue(id_annonce)
        annonce_existante = JSON.parse(annonce_existante)
        var oldestdate = getOldestDate(annonce_existante.prix, 'date')
        console.debug(oldestdate)
        var date_auj = new Date(aujourdhui)
        var date_oldest = new Date(oldestdate)
        var nombreJours = (date_auj.getTime()-date_oldest.getTime()) / (1000 * 3600 * 24)

        console.debug('getPremiereVisite fin')
        return nombreJours
    }

    function affiche_prix_min_max_premiere_visite(prix_min, prix_max, premiere_visite) {
        //premiere_visite date_aujourd'hui - date 1ere visite
        //https://stackoverflow.com/questions/12354989/how-can-i-display-the-output-of-my-userscript-in-a-floating-box-on-the-side-of-t
        console.debug('affiche_prix_min_max debut', prix_min, prix_max)
        var box = document.createElement( 'div' );
        box.id = 'myAlertePrix';
        GM_addStyle(
            ' #myAlertePrix {           ' +
            '    opacity: 0.9;          ' +
            '    background: white;     ' +
            '    border: 1px solid red; ' +
            '    padding: 4px;          ' +
            '    position: relative;    ' +
            '    max-width: 400px;      ' +
            ' } '
        );
        $( "body").append( box );
        console.debug( $( "#myAlertePrix" ) )

        box.innerHTML = "Prix mini "+prix_min+" €<br>Prix maxi "+prix_max+" €<br>Derniere visite "+premiere_visite+" jours";

        $( "#myAlertePrix" ).insertBefore( $( ".styles_Gallery__Y7BAy" ) )
        //$( ".myAlertePrix" ).appendTo("._1cnjm")
        //$( "._1cnjm" ).first().append(box)
        console.debug( $( "#grid" ) )
        box.addEventListener( 'click', function () {
            box.parentNode.removeChild( box );
        }, true );
        console.debug('affiche_prix_min_max fin')
    }

    function conserve_annonce(id_annonce, auj, prix_annonce, ecrase = false) {
        var annonce_existante = GM_getValue(id_annonce)
<<<<<<< HEAD
        var fiche_annonce
        if (annonce_existante == undefined) {
            fiche_annonce = JSON.parse('{"prix":[] }')
        } else {
            fiche_annonce = JSON.parse(annonce_existante)
        }
        if (! _isContains(fiche_annonce,auj)) {
            console.debug('La fiche '+id_annonce+' ne contient pas '+auj)
            fiche_annonce.prix.push({ date: auj, prix: prix_annonce });
        } else { if (ecrase) {
            console.debug('ecraser la fiche '+id_annonce);
            $(fiche_annonce.prix).each(function (index){
                console.debug('index fiche_annonce '+index)
                if(fiche_annonce.prix[index].date == auj){
                    fiche_annonce.prix.splice(index,1); // This will remove the object that first name equals to Test1
                    return false; // This will stop the execution of jQuery each loop.
                }
            });
            fiche_annonce.prix.push({ date: auj, prix: prix_annonce });
        }
        }
        GM_setValue(id_annonce, JSON.stringify(fiche_annonce, null, 2));
    }
=======
        annonce_existante = JSON.parse(annonce_existante)
        var oldestdate = getOldestDate(annonce_existante.prix, 'date')
        console.debug(oldestdate)
        var date_auj = new Date(aujourdhui)
        var date_oldest = new Date(oldestdate)
        var nombreJours = (date_auj.getTime()-date_oldest.getTime()) / (1000 * 3600 * 24)

        console.debug('getPremiereVisite fin')
        return nombreJours
    }

    function cache_annonce(id_annonce) {
        var annonce_existante = GM_getValue(id_annonce)
        annonce_existante = JSON.parse(annonce_existante)
        annonce_existante['Cache'] = 'OUI'
        console.debug(JSON.stringify(annonce_existante, null, 2))
        GM_setValue(id_annonce, JSON.stringify(annonce_existante, null, 2));
    }

    function delete_annonce(carte_annonce, id_annonce) {
        console.debug('delete_annonce debut', id_annonce)
        var annonce_existante = GM_getValue(id_annonce)
        annonce_existante = JSON.parse(annonce_existante)
        if (annonce_existante.Cache == 'OUI') {
            console.debug('annonce '+id_annonce+', à supprimer')
            console.debug($(carte_annonce))
            $(carte_annonce).remove()
        } else {
            console.debug('annonce '+id_annonce+', à conserver')
        }
        console.debug('delete_annonce fin')

>>>>>>> 7c3a466f3cdcffc76e879f7a06d6a30ff1a508dc

    function _isContains(json, value) {
        let contains = false;
        Object.keys(json).some(key => {
            contains = typeof json[key] === 'object' ?
                _isContains(json[key], value) : json[key] === value;
            return contains;
        });
        return contains;
    }

    function affiche_age_annonce(dom_entry, id_annonce) {
        console.debug('affiche_age_annonce debut', dom_entry, id_annonce)
        if ($('#age'+id_annonce).length) {
            console.debug('age annonce deja present',id_annonce)
            return
        }
        var box = document.createElement( 'div' );
        box.id = 'age'+id_annonce;
        box.className = 'myAlerteAge';
        GM_addStyle(
            ' .myAlerteAge {            ' +
            '    opacity: 0.9;          ' +
            '    background: white;     ' +
            '    border: 1px solid red; ' +
            '    padding: 4px;          ' +
            '    position: relative;    ' +
            '    z-index: 15000;        ' +
            '    float: left;           ' +
            '    left: 25px;            ' +
            '    top: 6px;              ' +
            ' } '
        );
        $( dom_entry).prepend( box );
        box.textContent = getPremiereVisite(id_annonce);
        console.debug('affiche_age_annonce fin')
<<<<<<< HEAD
    }

    function affiche_bouton_delete_annonce(dom_entry, id_annonce) {
        console.debug('affiche_delete_annonce debut', id_annonce)
        if ($('#delete'+id_annonce).length) {
            console.debug('delete annonce deja present',id_annonce)
            return
=======
    }

    function affiche_delete_annonce(dom_entry, id_annonce) {
        console.debug('affiche_delete_annonce debut', id_annonce)
        if ($('#delete'+id_annonce).length) {
            console.debug('delete annonce deja present',id_annonce)
            return
        }
        var box = document.createElement( 'div' );
        box.id = 'delete'+id_annonce;
        box.className = 'myDelete';
        GM_addStyle(
            ' .myDelete {               ' +
            '    opacity: 0.9;          ' +
            '    background: white;     ' +
            '    border: 1px solid red; ' +
            '    padding: 4px;          ' +
            '    position: relative;    ' +
            '    z-index: 15000;        ' +
            '    float: left;           ' +
            '    cursor: pointer;       ' +
            '    left: 250px;           ' +
            '    top: 6px;              ' +
            ' } '
        );
        $( dom_entry).prepend( box );

        box.textContent = 'X';
        box.addEventListener( 'click', function () {
            cache_annonce(id_annonce);
            $(dom_entry).remove()
            affiche_icones()
        }, true );

        console.debug('affiche_delete_annonce fin')

    }

    function affiche_icones() {
        var liste_annonces = document.getElementsByClassName("styles_adCard__2YFTi styles_classified__aKs-b");
        console.debug('affiche_icones Nbr d annonces', liste_annonces.length)
        //http://xpather.com/  AdCard__AdCardLink-sc-1h74x40-0 cHZrAn
        for (i=0; i<liste_annonces.length; i++) {
            var id_annonce_lien = document.evaluate('. //a[@class="AdCard__AdCardLink-sc-1h74x40-0 cHZrAn"]/@href', liste_annonces[i], null, XPathResult.STRING_TYPE, null).stringValue;
            id_annonce = id_annonce_lien.split('/')[2].split('.')[0]
            affiche_age_annonce(liste_annonces[i], id_annonce)
            affiche_delete_annonce(liste_annonces[i], id_annonce)
        }
    }


    function getOldestDate(arr, prop) {
        console.debug('getOldestDate',arr, prop)
        var oldest=null;
        for (var i=0 ; i<arr.length ; i++) {
            if (oldest == null || Date.parse(arr[i][prop]) < Date.parse(oldest[prop])) {
                oldest = arr[i];
            }
>>>>>>> 7c3a466f3cdcffc76e879f7a06d6a30ff1a508dc
        }
        var box = document.createElement( 'div' );
        box.id = 'delete'+id_annonce;
        box.className = 'myDelete';
        GM_addStyle(
            ' .myDelete {               ' +
            '    opacity: 0.9;          ' +
            '    background: white;     ' +
            '    border: 1px solid red; ' +
            '    padding: 4px;          ' +
            '    position: relative;    ' +
            '    z-index: 15000;        ' +
            '    float: left;           ' +
            '    cursor: pointer;       ' +
            '    left: 250px;           ' +
            '    top: 6px;              ' +
            ' } '
        );
        $( dom_entry).prepend( box );

        box.textContent = 'X';
        box.addEventListener( 'click', function () {
            stoque_cache_annonce(id_annonce);
            $(dom_entry).remove()
//            affiche_icones()
        }, true );

        console.debug('affiche_delete_annonce fin')

    }

    function stoque_cache_annonce(id_annonce) {
        var annonce_existante = GM_getValue(id_annonce)
        annonce_existante = JSON.parse(annonce_existante)
        annonce_existante.Cache = 'OUI'
        console.debug(JSON.stringify(annonce_existante, null, 2))
        GM_setValue(id_annonce, JSON.stringify(annonce_existante, null, 2));
    }

    function cache_annonce(dom_entry, id_annonce) {
        console.debug('cache_annonce debut', id_annonce)
        var annonce_existante = GM_getValue(id_annonce)
        annonce_existante = JSON.parse(annonce_existante)
        if (annonce_existante.Cache == 'OUI') {
            console.log('annonce '+id_annonce+', à supprimer')
            console.debug($(dom_entry))
            $(dom_entry).remove()
        } else {
            console.debug('annonce '+id_annonce+', à conserver')
        }
        console.debug('cache_annonce fin')
    }


    var today = new Date()
    var aujourdhui = today.toISOString().split('T')[0];

    var currentState = "";
    setInterval(function(){
        if (currentState != history.state.url) {
            currentState = history.state.url;
            console.log("Do Stuff! with state ", currentState);
            var page = currentState.split('?')[0].substring(1);
            console.log(" on est sur la page  ", page);

            if (page == 'ClassifiedAd') {
                //pour tester les fonctions, en cliquant sur l'annonce Maison 8 pièces 368 m² - 628 000 €
                //conserve_annonce(1982021932, aujourdhui, 628000, true)

<<<<<<< HEAD
                var og_url = getMeta('og:url');
                var id_annonce = og_url.split('/')[4].split('.')[0];
                console.log('annonce id '+id_annonce);
                affiche_donnees_annonce(id_annonce)
=======
    if (page[3].startsWith('recherche?category=9')) {
        console.log('liste des annonces...')
        var liste_annonces = document.getElementsByClassName("styles_adCard__2YFTi styles_classified__aKs-b");
        //http://xpather.com/  AdCard__AdCardLink-sc-1h74x40-0 cHZrAn
        for (i=0; i<liste_annonces.length; i++) {
            var id_annonce_lien = document.evaluate('. //a[@class="AdCard__AdCardLink-sc-1h74x40-0 cHZrAn"]/@href', liste_annonces[i], null, XPathResult.STRING_TYPE, null).stringValue;
            id_annonce = id_annonce_lien.split('/')[2].split('.')[0]
            console.debug('ID annonce: '+id_annonce)
            var prix_annonce_complet = document.evaluate('. //div[@class="AdCardPrice__Wrapper-bz31y2-0 foZmYw"]', liste_annonces[i], null, XPathResult.STRING_TYPE, null).stringValue;
            prix_annonce = prix_annonce_complet.replace(/(\s*)(€*)/g, '');
            if ( prix_annonce === '') {
                console.log('Pb dans la recup du prix pour l\'annonce',id_annonce);
            } else {
                console.debug('Prix annonce ', prix_annonce,'€')
                conserve_annonce(id_annonce, aujourdhui, prix_annonce);
                //affiche_age_annonce(liste_annonces[i], id_annonce)
                //affiche_delete_annonce(liste_annonces[i], id_annonce)
                //delete_annonce(liste_annonces[i], id_annonce)
            }
        }
        console.debug('Nbr d annonces', liste_annonces.length)
        for (i=0; i<liste_annonces.length; i++) {
            id_annonce_lien = document.evaluate('. //a[@class="AdCard__AdCardLink-sc-1h74x40-0 cHZrAn"]/@href', liste_annonces[i], null, XPathResult.STRING_TYPE, null).stringValue;
            id_annonce = id_annonce_lien.split('/')[2].split('.')[0]
            delete_annonce(liste_annonces[i], id_annonce)
        }
        affiche_icones()

>>>>>>> 7c3a466f3cdcffc76e879f7a06d6a30ff1a508dc

            }

            if (page == 'SearchListing') {
                var checkExist = setInterval(function() {
                    var listeCartes =  $("[class='styles_adCard__2YFTi styles_classified__aKs-b']")
                    if (listeCartes.length) {
                        console.log("Les cartes sont apparues!");
                        clearInterval(checkExist);

                        console.log(" avec le contenu  ", listeCartes);
                        for (var i=0; i<listeCartes.length; i++) {
                            var id_annonce_lien = document.evaluate('. //a[@class="AdCard__AdCardLink-sc-1h74x40-0 cHZrAn"]/@href', listeCartes[i], null, XPathResult.STRING_TYPE, null).stringValue;
                            id_annonce = id_annonce_lien.split('/')[2].split('.')[0]
                            console.debug('ID annonce: '+id_annonce)
                            var prix_annonce_complet = document.evaluate('. //div[@class="AdCardPrice__Wrapper-bz31y2-0 foZmYw"]', listeCartes[i], null, XPathResult.STRING_TYPE, null).stringValue;
                            var prix_annonce = prix_annonce_complet.replace(/(\s*)(€*)/g, '');
                            if ( prix_annonce === '') {
                                console.log('Pb dans la recup du prix pour l\'annonce',id_annonce);
                            } else {
                                console.debug('Prix annonce ', prix_annonce,'€')
                                conserve_annonce(id_annonce, aujourdhui, prix_annonce);
                            }
                            affiche_age_annonce(listeCartes[i], id_annonce)
                            affiche_bouton_delete_annonce(listeCartes[i], id_annonce)
                            cache_annonce(listeCartes[i], id_annonce)
                        }
                    }
                }, 100);
            }
            console.log('end sandbox');
        }
    },250)
});