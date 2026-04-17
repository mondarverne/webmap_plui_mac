/////////////////////////////
// Fenêtre de présentation //
////////////////////////////

window.addEventListener('load', () => {
  Swal.fire({
    title: 'Bienvenue sur la carte interactive',
    iconColor : '#f39200',
    //text: "Cette carte interactive permet de visualiser dans un navigateur web le plan de zonage du Plan Local d’Urbanisme intercommunal (PLUi) de Mond’Arverne Communauté. <br>Elle permet de naviguer sur le territoire, de zoomer et de rechercher une parcelle pour connaître son zonage et les potentielles prescriptions qui s’appliquent.",
    html: `<div style="text-align: justify;">
    <p>Cette carte interactive permet de visualiser dans un navigateur web le plan de zonage du Plan Local d’Urbanisme intercommunal (PLUi) de Mond’Arverne Communauté.</p>
    <p>Elle permet de naviguer sur le territoire, de zoomer et de rechercher une parcelle pour connaître son zonage et les potentielles prescriptions qui s’appliquent.</p>
    <p>Consulter le <a href="https://raw.githubusercontent.com/mondarverne/webmap_plui_mac/main/mode_d_emploi_webmap.pdf" target="_blank">guide d'utilisation</a>.</p>
    </div>`,
    icon: 'info',
    confirmButtonText: 'Commencer',
    
    customClass: {
      confirmButton: 'bouton_debut',
    }
  });
});



//////////////////////////////
////// Variables et URL //////
/////////////////////////////

let zonagesData = null; 
const urlZonages  = "https://raw.githubusercontent.com/mondarverne/webmap_plui_mac/main/DATA/info_zonage.json";

const url_parc_zon_pt = "https://raw.githubusercontent.com/mondarverne/webmap_plui_mac/main/DATA/parc_zon_pt2_app.geojson";

const communesUrl = "https://raw.githubusercontent.com/mondarverne/webmap_plui_mac/main/DATA/contours_com.geojson";
const communesSource = new ol.source.Vector();
const sectionUrl = "https://raw.githubusercontent.com/mondarverne/webmap_plui_mac/main/DATA/contours_section.geojson";
const sectionSource = new ol.source.Vector();


// Promise que l'on réutilisera dans le listener
const communesLoad = fetch(communesUrl)
  .then(resp => {
    if (!resp.ok) throw new Error("Échec du chargement des communes");
    return resp.json();
  })
  .then(geojson => {
    const format = new ol.format.GeoJSON();
    const features = format.readFeatures(geojson, {
      dataProjection: "EPSG:4326",
      featureProjection: view.getProjection()
    });
    communesSource.addFeatures(features);
  })
  .catch(err => {
    console.error("Erreur chargement communes:", err);
  });

  
// Promise que l'on réutilisera dans le listener
const sectionLoad = fetch(sectionUrl)
  .then(resp => {
    if (!resp.ok) throw new Error("Échec du chargement des sections");
    return resp.json();
  })
  .then(geojson => {
    const format = new ol.format.GeoJSON();
    const features = format.readFeatures(geojson, {
      dataProjection: "EPSG:4326",
      featureProjection: view.getProjection()
    });
    sectionSource.addFeatures(features);
  })
  .catch(err => {
    console.error("Erreur chargement sections:", err);
  });

const selectCommune = document.getElementById("selectCommune");
const selectSection = document.getElementById("selectSection");
const selectNumero  = document.getElementById("selectNumero");
const infoBox = document.getElementById("info");

let geojsonData = null; // contiendra le jeu de données


// Style du repère
var placemark = new ol.Overlay.Placemark ({
  color: '#cc0f0f',
  backgroundColor : 'transparent',
  contentColor: '#000',
  autoPan: { 
    animation : {
      duration: 250 
    }
  }
});



////////////////////////////////
// Mise en place des controls //
////////////////////////////////
// La vue
const view = new ol.View({
  center: ol.proj.fromLonLat([3.16093913,45.66069648]),
  zoom: 12.2
});

// Zoom
var cont_zoom = new ol.control.Zoom({
	zoomInTipLabel: 'Zoomer',
	zoomOutTipLabel: 'Dézoomer',
})

// Echelle
var cont_echelle = new ol.control.ScaleLine({})

// Organisateur de couches
var cont_control_couche = new ol.control.LayerSwitcher({
  activationMode: 'click',
  startActive: false,
  collapsed : true,
  reordering: false,
  groupSelectStyle:'children',
});


// Mentions légales
var cont_mention_legale = new ol.control.Attribution({
	// Possibilité de replier l'élément
	collapsible: true,
	// Etat "de repliage" au démarrage
	collapsed: true,
	// Infobulle du bouton
	tipLabel: 'Attributions',
})

///////////////////////////
// Affichage de la carte //
///////////////////////////

// Paramétrer la carte
var map = new ol.Map({
	target: 'map',
	layers: [
    group_fdp, 
    group_plui, 
    vectorTileLayer_cadastre, 
    layer_zonage_ettiqu, 
    layer_commune
  ],
  overlays: [placemark],
	controls:[
		cont_zoom,
		cont_echelle,
		cont_control_couche,
    cont_mention_legale,
  ],
	view: view
});



// Control Select 
 // --- Création de la popup ol-ext ---
const popup = new ol.Overlay.Popup({
  popupClass: "default",
  closeBox: true,
  positioning: "auto",
  autoPan: false,
  onclose: () => console.log("Popup fermée")
});
map.addOverlay(popup);



// --- Gestion du clic sur la carte ---
map.on('singleclick', function (evt) {
  const coord = evt.coordinate;

  const feature = map.forEachFeatureAtPixel(evt.pixel, (feat, layer) => {
    return layer === layer_zonage ? feat : null;
  });

  if (feature) {
    const nom = feature.get('LIBELONG');
    const lien_reglm = feature.get('lien_reglmt');
  popup.show(coord, `
      <strong>${nom}</strong> <a href="${lien_reglm}" target="_blank"><strong>(règlement)</strong> </a>
    `);  } else {
    popup.hide();
  }
});


/////////////////////////////////////////////////
// Paramétrer la couche d'étiquettes du zonage //
/////////////////////////////////////////////////

// Désavtiver la couche d'etiquettes du zonage du contrôleur de couche
layer_zonage_ettiqu.set('displayInLayerSwitcher', false);
layer_commune.set('displayInLayerSwitcher', false);

// Pas d'etiquettes de zonage quand la couche est désactivée
layer_zonage.on('change:visible', function () {
  layer_zonage_ettiqu.setVisible(layer_zonage.getVisible());
});

// Pas d'etiquettes de zonage quand le groupe est désactivé
group_plui.on('change:visible', function () {
  layer_zonage_ettiqu.setVisible(group_plui.getVisible());
});



///////////////////////
/////// LEGENDE ///////
///////////////////////

// Paramétrages de la légende
var legend = new ol.legend.Legend({ 
  title: '', //pas besoin de titre
  margin: 5,
  maxWidth: 300
});

var legendCtrl = new ol.control.Legend({
  legend: legend,
  collapsed: true,
  className: 'ol-legend custom-legend'
});
map.addControl(legendCtrl);


// Association des couches avec la l'image de la légende stockée sur GitHub
var zonageLegend = new ol.legend.Legend({layer: layer_zonage });
zonageLegend.addItem(new ol.legend.Image({
  title: 'Zonage',
  src: 'https://raw.githubusercontent.com/mondarverne/webmap_plui_mac/main/IMAGES/zonage.png',
  width: 600 
}));

var presci_surfLegend = new ol.legend.Legend({layer: layer_prescri_surf });
presci_surfLegend.addItem(new ol.legend.Image({
  title: 'Prescriptions surfaciques',
  src: 'https://raw.githubusercontent.com/mondarverne/webmap_plui_mac/main/IMAGES/Prescri_surf.png',
  width: 600
}));

var presci_linLegend = new ol.legend.Legend({layer: layer_prescri_lin });
presci_linLegend.addItem(new ol.legend.Image({
  title: 'Prescriptions linéaires',
  src: 'https://raw.githubusercontent.com/mondarverne/webmap_plui_mac/main/IMAGES/Prescri_lin.png',
  width: 600
}));

var presci_ptLegend = new ol.legend.Legend({layer: layer_prescri_pt });
presci_ptLegend.addItem(new ol.legend.Image({
  title: 'Prescriptions ponctuelles',
  src: 'https://raw.githubusercontent.com/mondarverne/webmap_plui_mac/main/IMAGES/Prescri_ponct.png',
  width: 600 
}));

legend.addItem(presci_ptLegend);
legend.addItem(presci_linLegend);
legend.addItem(presci_surfLegend);
legend.addItem(zonageLegend);



////////////////////////////////////////////////////
// JS pour le panneau de sélection d'une parcelle //
///////////////////////////////////////////////////

// Fonction pour obtenir les valeurs uniques d'un Geojson (pour les sections et parcelles)
function getUniqueValues(data, field, filter = {}) {
  if (!data || !data.features) return [];
  const values = new Set();
  data.features.forEach(f => {
    const p = f.properties || {};
    let keep = true;
    for (const [k, v] of Object.entries(filter)) {
      if (p[k] !== v) { keep = false; break; }
    }
    if (keep && p[field] !== undefined && p[field] !== null) values.add(p[field]);
  });
  return Array.from(values).sort((a,b) => {
    if (typeof a === "string" && typeof b === "string") return a.localeCompare(b,"fr");
    return (a > b) ? 1 : -1;
  });
}

// Fonction pour remplir le menu déroulant <select>
function populateSelect(selectEl, values, placeholder = "-- Sélectionner --") {
  selectEl.innerHTML = `<option value="">${placeholder}</option>`;
  values.forEach(v => {
    const opt = document.createElement("option");
    opt.value = v;
    opt.textContent = v;
    selectEl.appendChild(opt);
  });
  selectEl.disabled = values.length === 0;
}

// Fonction pour remplir le menu déroulant <select> commune avec value=code et text=nom_com
function populateSelectCommune(communesArr) {
  selectCommune.innerHTML = `<option value="">-- Sélectionner --</option>`;
  communesArr.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.code;    // on garde le code en valeur
    opt.textContent = c.name; // affichage = nom_com
    selectCommune.appendChild(opt);
  });
  selectCommune.disabled = communesArr.length === 0;
}


// Début du chargement des données
async function init() {
  // Chargement des deux jeux de données
  try {
  const [respGeo, respZon] = await Promise.all([
    fetch(url_parc_zon_pt),
    fetch(urlZonages)
  ]);
  if (!respGeo.ok) throw new Error(`HTTP ${respGeo.status}`);
  if (!respZon.ok) throw new Error(`HTTP ${respZon.status}`);

  geojsonData = await respGeo.json();

  // Transformation de zonagesGeoJSON en liste (plus simple pour être manipulé)
  const zonagesGeoJSON = await respZon.json();
  zonagesData = zonagesGeoJSON.features.map(f => f.properties);

  const communesMap = new Map();
  geojsonData.features.forEach(f => {
    const p = f.properties || {};
    if (p.commune && p.nom_m && !communesMap.has(p.commune)) {
      communesMap.set(p.commune, p.nom_m);
    }
  });

  // Transformation en tableau trié
  const communes = Array.from(communesMap.entries())
    .map(([code, name]) => ({ code, name }))
    .sort((a,b) => a.name.localeCompare(b.name, "fr"));

  
  // Remplissage du select commune
  populateSelectCommune(communes);

  } catch (err) {
    console.error("Erreur chargement GeoJSON :", err);
    infoBox.textContent = "Erreur lors du chargement des données.";
  }
}

// Une fois qu'une commune est sélectionnée
selectCommune.addEventListener("change", () => {
  const codeCommune = selectCommune.value; // ici value = code
  if (codeCommune) {
    // Chargement des sections de la  commune selectionnée
    const sections = getUniqueValues(geojsonData, "section", { commune: codeCommune });
    populateSelect(selectSection, sections);
  
    communesLoad.then(() => {
      const feat = communesSource.getFeatures().find(f =>
        String(f.get("id")) === String(codeCommune)
      );

      if (feat) {
        const extent = feat.getGeometry().getExtent();
        // zoom sur la commune
        view.fit(extent, { padding: [30, 30, 30, 30], duration: 700  }); //maxZoom: 14
      } else {
        console.warn("Commune introuvable dans le GeoJSON :", codeCommune);
      }
    }).catch(err => {
      console.error("Erreur après chargement communes:", err);
    });

  } else {
    selectSection.innerHTML = '<option value="">-- Sélectionner --</option>';
    selectSection.disabled = true;
  }
  selectNumero.innerHTML = '<option value="">-- Sélectionner --</option>';
  selectNumero.disabled = true;
  infoBox.textContent = "Sélectionnez une parcelle pour afficher son zonage.";
});

// Une fois que la section est sélectionnée
selectSection.addEventListener("change", () => {
  const codeCommune = selectCommune.value;
  const section = selectSection.value;
  if (codeCommune && section) {
    // Proposition des numéros de parcelles
    const numeros = getUniqueValues(geojsonData, "numero", { commune: codeCommune, section });
    populateSelect(selectNumero, numeros);
  
    sectionLoad.then(() => {
      const feat = sectionSource.getFeatures().find(f =>
        String(f.get("commune")) === String(codeCommune) &&
        String(f.get("code")) === String(section)
      );

      if (feat) {
        const extent = feat.getGeometry().getExtent();
        // zoom sur la section
        view.fit(extent, { padding: [5, 5, 5, 5], duration: 700  }); //maxZoom: 14
      } else {
        console.warn("Section introuvable dans le GeoJSON :", codeCommune, section);
      }
    }).catch(err => {
      console.error("Erreur après chargement:", err);
    });
  
  } else {
    selectNumero.innerHTML = '<option value="">-- Sélectionner --</option>';
    selectNumero.disabled = true;
  }
  infoBox.textContent = "Sélectionnez une parcelle pour afficher son zonage.";
});

// Une fois le numéro choisi
selectNumero.addEventListener("change", () => {
  const codeCommune = selectCommune.value;
  const section = selectSection.value;
  const numero = selectNumero.value;
  
  if (codeCommune && section && numero) {
    // Trouver la parcelle
    const feat = geojsonData.features.find(f =>
      f.properties &&
      f.properties.commune === codeCommune &&
      f.properties.section === section &&
      (String(f.properties.numero) === String(numero))
    );
    if (feat) 
      {
      const p = feat.properties;

      const coords = feat.geometry.coordinates; // [lon, lat]
      const center = ol.proj.fromLonLat(coords);
      
      // Zoom sur la parcelle
      view.animate(
        { center: center, duration: 800 },
        { zoom: 18, duration: 800 },
      );
      
      // Ajout d'un repère
      placemark.show(center); 
      
      // Traitement du zonage
      let libelle = feat.properties.libelle || "";
      const values = String(libelle).split(",").map(s => s.trim()).filter(Boolean);

      // Si il n'y a aucun zonage
      if (values.length === 0) {
        infoBox.textContent = "Aucun zonage défini pour cette parcelle.";
        return;
      }
      // Si il n'y a qu'un seul zonage
      let html = "";
      if (values.length === 1) {
        html += `<p>Cette parcelle se trouve dans le zonage :</p>`;
      // Si plusieurs zonages
      } else {
        html += `<p>Cette parcelle se trouve dans les zonages :</p>`;
      }

      html += `<ul class="zonages-list">`;
      values.forEach(lib => {
        const z = zonagesData.find(item => item.libelle === lib);
        if (z) {
          html += `
            <li class="zonage-item"> -
              <span class="zonage-name">${z.libelong}</span>. Consulter le
              <a href="${z.lien_reglmt}" target="_blank" class="zonage-link">
                règlement
              </a> de ce zonage.
            </li>`;
        } else {
          html += `<li class="zonage-item zonage-unknown">${lib}</li>`;
        }
      });

      html += `</ul>`;

      if (p.url_oap) {  
        html += `
        <div class="info-block info-oap">
          Cette parcelle est dans une <strong>OAP sectorielle</strong>. Consulter le
          <a href="${p.url_oap}" target="_blank"> règlement</a> de l'OAP.
        </div>`;
      }

      if (p.url_cc) {  
        html += `
        <div class="info-block info-er">
          Cette parcelle est dans le périmètre d'un <strong>emplacement réservé</strong>. Consulter le 
          <a href="${p.url_cc}" target="_blank">cahier communal</a>.
        </div>`;
      }

      html += `
      <div class="info-block info-note">
        Des 
        <a href="https://www.mond-arverne.fr/wp-content/uploads/2026/02/4-2_20260129-Reglement_ecrit.pdf#page=21" target="_blank">
          dispositions particulières
        </a> 
        peuvent également s'appliquer en plus des règles du zonage.
      </div>`;
      infoBox.innerHTML = html
    }
  }
});
init();