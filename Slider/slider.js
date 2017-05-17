window.addEventListener('load', function(){
	display_imgs();
	opacity(0);

	document.getElementById('preced').addEventListener("click", preced);
	document.getElementById('next').addEventListener("click", next);
	document.getElementById('godiapo').addEventListener("click", playDiapo);

	document.addEventListener("keydown", keydown);
	closeDivCharcodes();

	zoom_btn.addEventListener('click', popup);


});


// AFFICHER LES BOUTONS DES IMAGES

var innerLinks = document.getElementById("boutonsdiapo").innerHTML;
var images = document.getElementsByClassName("imgdiapo");

// INITIALISATION DES IMAGES
var tab_imgs = new Array(
	"https://www.chamrousse.com/templates/SITE2016/cache/min-PRESTATAIRE-WEBCAMS-TELESIEGEBACHATBOULOUD-Sommet_Bachat000.jpg",
	"https://www.chamrousse.com/templates/SITE2016/cache/min-PRESTATAIRE-WEBCAMS-VUGRENOBLEVERCORS-webcam-chamrousse.jpg",
	"https://www.chamrousse.com/templates/SITE2016/cache/min-PRESTATAIRE-WEBCAMS-PLACEBELLEDONNE-Front_neige_1650000M.jpg",
	"https://www.chamrousse.com/templates/SITE2016/cache/min-PRESTATAIRE-WEBCAMS-PLATEAUARSELLENORDIQUE-Plateau_Arselle_000.jpg"
	);

var tab_img_info = new Array(
	"Chamrousse 2030 - Sommet télésiège Bachat-Bouloud",
	"Chamrousse 1800 - Vue vers Grenoble et le Vercors",
	"Chamrousse 1650 - Place de Belledonne - Recoin",
	"Chamrousse 1600 - Plateau de l’Arselle - Domaine Nordique"
	);


var nb_imgs = tab_imgs.length;

function display_imgs(){
	var i = 0;
	while(i < (nb_imgs)){
		document.getElementById("boutonsdiapo").innerHTML += "<li><button id='link_img"+i+"' onclick='clicImg("+i+")'><img src='"+tab_imgs[i]+"' alt='"+tab_img_info[i]+"' title='"+tab_img_info[i]+"'></button></li>";
		document.getElementById("diapo-ul").innerHTML += "<li><img class='imgdiapo' src='"+tab_imgs[i]+"' alt='"+tab_img_info[i]+"' title='"+tab_img_info[i]+"'></li>";
		i++;
	}
	// On rajoute la première photo à la fin, pour l'effet de défilement
	document.getElementById("diapo-ul").innerHTML += "<li><img class='imgdiapo' src='"+tab_imgs[0]+"'></li>";
	// On affiche la légende de la première image
	document.getElementById("infos").innerHTML = tab_img_info[0];
}



/******** ANIMATIONS IMAGES ******/


// ANIMATIONS

var width = 600;
var decalage = 0;
// Variable pour check si l'anim est en cours
var a1playing = false;
var a2playing = false;


function currentImg(){
	i = Math.round(decalage/width);
	if(i>(nb_imgs - 1)){
		i = nb_imgs - 1;
	}
	return i;
}

function opacity(i){
	document.getElementById('link_img'+i).style.opacity = "1";
}


function endOpacity(i){

	document.getElementById('link_img'+i).style.opacity = "0.6";
}

function clicImg(i){
	if(a1playing == true){
		clearInterval(intervalDiapo);
		defilDiapo()
	}
	if(a2playing == true){
		clearInterval(intervalAnim);
		a2playing = false;
	}
	anim_transit(i);
}


// Preced & Next & Play & Popup

function preced(){
	if(new_img == 0){
		clicImg(nb_imgs - 1);
	} else {
		clicImg(new_img - 1);
	}
}

function next(){
	if(new_img == (nb_imgs - 1)){
		clicImg(0);
	} else {
		clicImg(new_img + 1);
	}
}

function stopDiapo(){
	if(a1playing == true){
		clearInterval(intervalDiapo);
		document.getElementById('godiapo').innerHTML = "<i class='material-icons'>play_arrow</i></button>"
		a1playing = false;
	}
}

function playDiapo(){
	if(a1playing == false){
		defilDiapo();
		document.getElementById('godiapo').innerHTML = "<i class='material-icons'>pause</i></button>"		
		a1playing = true;
	} else {
		stopDiapo();
	}
}



// CHARCODES


function keydown(evt){
	if(evt.keyCode === 37){
		preced();
	}
	if(evt.keyCode === 39){
		next();
	}
	if(evt.keyCode === 32){
		playDiapo();
		evt.preventDefault();
	}
}


// Close popup charcodes

var charcodediv = document.getElementById('charcode');
var close_char = document.getElementById('close-char');


function closeDivCharcodes(){
	if(charcodediv.className != "closediv"){	
		close_char.addEventListener('click', function(){
			charcodediv.className = "closediv";
		});
		// 37: left , 39: right , 32: space bar
		document.addEventListener("keydown", function(evt){
			if((evt.keyCode === 37) || (evt.keyCode === 39) || (evt.keyCode === 32)) {
				charcodediv.className = "closediv";
			}
		});
	}
}




// ANIMATION RÉGULIÈRE

var new_img = 0;


function defilDiapo(){
	intervalDiapo = setInterval(
		function(){
			anim_transit(new_img+1);
		}
	,3000);
}

function anim_transit(img_final){
	a2playing = true;

	endOpacity(new_img);

	if(img_final == nb_imgs){
		new_img = 0;
	} else {
		new_img = img_final;
	}

	// Légende de la photo
	document.getElementById('infos').innerHTML = tab_img_info[new_img];

	opacity(new_img);

	var decal_final = img_final * width;
	var decal_init = decalage;
	var decal_var_anim = decalage + ((decal_final - decalage)/40);

	intervalAnim = setInterval(
		function(){
			// Fonction qui décale à chaque pas en fonction du décalage actuel, soit exponnentiel décroissant
			decal_var_anim = decalage + ((decal_final - decalage)/40);
			if (decal_init < decal_final){
				decalage = decal_var_anim + 0.1;
				if(decalage >= decal_final){
					clearInterval(intervalAnim);
					decalage = decal_final;
					a2playing = false;
					if(decalage > (((images.length) - 1) * width) - 1){
						decalage = 0;
					}
				}
			} else {
				decalage = decal_var_anim - 0.1;
				if(decalage <= decal_final){
					clearInterval(intervalAnim);
					decalage = decal_final;
					a2playing = false;
					if(decalage > (((images.length) - 1) * width) - 1){
						decalage = 0;
					}
				}
			}
			document.getElementById('diapo-ul').style = "left:-"+decalage+"px;";
		},
		4
	);
}


// Progress bar


/************ POPUP ZOOM *************/


// Var div popup
var zoom_btn = document.getElementById('plus');
var popup_img = document.getElementById('popup-img');
var popup_img_block = document.getElementById('popup-img-block');
var img_zoom = document.getElementById('img-zoom');
var popup_close = document.getElementById('popup-close');


// ZOOM CIBLÉ


var xDecal, yDecal, xDif, yDif, x, y, img;
var clicked = false;

var zoom = 1.4;

function mouseout(){
	img_zoom.removeEventListener("mousemove", zoomed);
	img_zoom.addEventListener("mousemove", zoomed);
}

function zoom_over(){
	// Initialisation variables pour la function ZOOMED
	var img = document.getElementById('zoomed');
		// décalage
	xDif = 0.5 * ((zoom * img.width) - img.width);
	yDif = 0.5 * ((zoom * img.height) - img.height);
	
	var imgLeft = img.style.left;
	var imgTop = img.style.top;
	xDecal = popup_img_block.offsetLeft;
	yDecal = popup_img_block.offsetTop;

	window.addEventListener("resize", function(){
		xDecal = popup_img_block.offsetLeft;
		yDecal = popup_img_block.offsetTop;
	});

	// Déclenchement de la func zoom en mouseover et arret en mouseout
	
	img.style.transform = "scale("+zoom+","+zoom+")";
	img_zoom.addEventListener("mousemove", zoomed);
	img_zoom.addEventListener("mouseout", mouseout);
}

function zoomed(){
	img = document.getElementById('zoomed');
	xBase = event.clientX - xDecal;
	yBase = event.clientY - yDecal;
	x = (((-(zoom-1)) * xBase) + xDif);
	y = (((-(zoom-1)) * yBase) + yDif);
	img.style.left = x+"px";
	img.style.top = y+"px";
}


// POPUP


function disappear(){
	fadeOut(300);
	img_zoom.removeEventListener("click", clic_zoom);
	if(clicked == true){ clic_zoom(); }
}

function clic_zoom(){
	if(clicked == false){
		clicked = true;
		zoom_over();
		zoomed();
		setTimeout( function(){ img.className = "zoom-out"; }, 320);
	} else {
		clicked = false;
		img_zoom.removeEventListener("mousemove", zoomed);
		img_zoom.removeEventListener("mouseout", mouseout);
		img.style.transform = "scale(1,1)";
		img.style.left = "0px";
		img.style.top = "0px";
		img.className = "zoom-in";
	}
}

function popup(){

	stopDiapo();

	// Affichage de l'image
	img_zoom.innerHTML = "<img id='zoomed' class='zoom-in' src='"+tab_imgs[new_img]+"' alt=''>";
	fadeIn(400);

	// Event clic -> Zoom ciblé
	img_zoom.addEventListener("click", clic_zoom);

	// Fermeture Popup
    popup_img.addEventListener('click', function(){
    	disappear();
    });
    popup_img_block.addEventListener('click', function(evt){
        evt.stopPropagation();
    });
    popup_close.addEventListener('click', function(){
    	disappear();
    });

	document.addEventListener("keydown", function(evt){
		if(evt.keyCode === 27){
			disappear();
		}
	});
}





/******* FADE IN / OUT , IN JAVASCRIPT *********/



function fadeIn(time){

	var interval = 8;
	var opac = 0;
	var opac_increment = 1 / (time / interval); // 1: différence d'opacité fin-début
	var imgWidth = 940;
	var width_increment = 80 / (time / interval); // 80: différence de largeur fin-début
	popup_img.style.opacity = opac;
	popup_img_block.style.width = imgWidth+"px";
	popup_img.style.display = "flex";
	var intervalFadeIn = setInterval(
		function(){
			if(opac < 1){
				opac += opac_increment;
				if(opac >= 1){
					opac = 1;
				}
			}
			if(imgWidth < 1000){
				imgWidth += width_increment;
				if(imgWidth >= 1000){
					imgWidth = 1000;
				}
			}
			popup_img.style.opacity = opac;
			popup_img_block.style.width = imgWidth+"px";

			if((opac == 1) && (imgWidth == 1000)) {
				clearInterval(intervalFadeIn);
			}
		}
		,interval
	);
}



function fadeOut(time){

	var interval = 8;
	var opac = 1;
	var opac_increment = 1 / (time / interval); // 1: différence d'opacité fin-début
	var imgWidth = 1000;
	var width_increment = 80 / (time / interval); // 300: différence de largeur fin-début
	popup_img.style.opacity = opac;
	popup_img_block.style.width = imgWidth+"px";
	var intervalFadeOut = setInterval(
		function(){
			if(opac > 0){
				opac = (opac - opac_increment);
				if(opac <= 0){
					opac = 0;
				}
			}
			if(imgWidth > 920){
				imgWidth = (imgWidth - width_increment);
				if(imgWidth <= 920){
					imgWidth = 920;
				}
			}
			popup_img.style.opacity = opac;
			popup_img_block.style.width = imgWidth+"px";

			if((opac == 0) && (imgWidth == 920)) {
				popup_img.style.display = "none";
				clearInterval(intervalFadeOut);
			}
		}
		,interval
	);
}











