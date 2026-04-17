////////////////////////////////////
// Ajour de TUILES (fond de plan) //
////////////////////////////////////

// Appel de la tuile vectorielle du cadastre mise à dispo par OpenMapTiles
const vectorTileLayer_cadastre = new ol.layer.VectorTile({
	title: 'Cadastre',
	visible: true,
	source: new ol.source.VectorTile({
		attributions:[' © <a href="https://cadastre.data.gouv.fr/" target="_blanc">DINUM (data.gouv) - mars 2026)</a>'],
		format: new ol.format.MVT(),
		url: 'https://openmaptiles.data.gouv.fr/data/cadastre/{z}/{x}/{y}.pbf'
	})
});
// Appliquer le style Mapbox JSON stocké sur GitHub
olms.applyStyle(vectorTileLayer_cadastre,  'https://raw.githubusercontent.com/mondarverne/webmap_plui_mac/main/pci_style.json', 'pci');



// Appel de l'imagerie aérienne mise à dispo par l'IGN
// résolutions standard WMTS WebMercator
const resolutions = [];
const matrixIds = [];

for (let z = 0; z <= 18; ++z) {
  resolutions[z] = 156543.03392804097 / Math.pow(2, z);
  matrixIds[z] = z.toString();
}

const img_aerienne_layer = new ol.layer.Tile({
  title: 'Image aérienne',
  //type: 'base',
  baseLayer: true,
  visible: true,
  source: new ol.source.WMTS({
    url: "https://data.geopf.fr/wmts",
    layer: "ORTHOIMAGERY.ORTHOPHOTOS.ORTHO-EXPRESS.2025",
    matrixSet: "PM",
    format: "image/jpeg",
    style: "normal",
    projection: "EPSG:3857",
    tileGrid: new ol.tilegrid.WMTS({
      origin: [-20037508, 20037508],
      resolutions: resolutions,
      matrixIds: matrixIds
    }),
	attributions:[' © <a href="https://www.ign.fr/" target="_blanc">IGN / Géoplateforme</a>'],
  })
});



// Appel de la couche IGN BD TOPO (style gris)
const ign_tuile_gris = new ol.layer.VectorTile({
	title: 'BD TOPO (gris)',
	//type: 'base',
	visible: false,
	baseLayer: true,
	source: new ol.source.VectorTile({
		attributions:[' © <a href="https://www.ign.fr/" target="_blanc">IGN / Géoplateforme</a>'],
		format: new ol.format.MVT(),
		url: 'https://data.geopf.fr/tms/1.0.0/BDTOPO/{z}/{x}/{y}.pbf'
	})
});
// Appliquer le style Mapbox JSON
olms.applyStyle(ign_tuile_gris, 'https://data.geopf.fr/annexes/ressources/vectorTiles/styles/PLAN.IGN/gris.json');


// Appel de la couche IGN BD TOPO (style couleur)
const ign_tuile_coul = new ol.layer.VectorTile({
	title: 'BD TOPO (couleur)',
	//type: 'base',
	baseLayer: true,
	visible: false,
	source: new ol.source.VectorTile({
		attributions:[' © <a href="https://www.ign.fr/" target="_blanc">IGN / Géoplateforme</a>'],
		format: new ol.format.MVT(),
		url: 'https://data.geopf.fr/tms/1.0.0/BDTOPO/{z}/{x}/{y}.pbf'
	})
});
// Appliquer le style Mapbox JSON
olms.applyStyle(ign_tuile_coul, 'https://data.geopf.fr/annexes/ressources/vectorTiles/styles/PLAN.IGN/standard.json');


// Permettre la possibilité de ne mettre aucun fond de plan
const sansfond_layer = new ol.layer.Tile({
  title: "Aucun fond",
  //type: "base",
  visible: false,
  baseLayer: true,
});



/////////////////////////////////////
// Ajour de données VECTEUR  (communes)//
/////////////////////////////////////

var layer_commune = new ol.layer.Vector({
	title: 'Communes',
	source:  new ol.source.Vector({
		url: 'https://raw.githubusercontent.com/mondarverne/webmap_plui_mac/main/DATA/contours_com.geojson',
		format: new ol.format.GeoJSON()
	}),
	style: styleFunction_communes
})


/////////////////////////////////////
// Ajour de données VECTEUR  (PLUI)//
/////////////////////////////////////
var layer_typezone = new ol.layer.Vector({
	title: 'Type zone',
	source:  new ol.source.Vector({
		url: 'https://raw.githubusercontent.com/mondarverne/webmap_plui_mac/main/DATA/200069177_TYPE_ZONE_20260129.geojson',
		format: new ol.format.GeoJSON(),
		attributions: ['© <a href="https://www.mond-arverne.fr/" target="_blanc">Mond’Arverne Communauté</a>']	
	}),
	style: styleFunction_type_zone,
	maxZoom : 13,
	opacity : 0.8
})


var layer_zonage = new ol.layer.Vector
({
	title: 'Zonage',
	source:  new ol.source.Vector({
		url: 'https://raw.githubusercontent.com/mondarverne/webmap_plui_mac/main/DATA/200069177_ZONE_URBA_20260129.geojson',
		format: new ol.format.GeoJSON(),
		attributions: ['© <a href="https://www.mond-arverne.fr/" target="_blanc">Mond’Arverne Communauté</a>']	
	}),
	style: styleFunction_zonage,
	minZoom : 13,
	opacity : 0.75

})


var layer_zonage_ettiqu = new ol.layer.Vector
({
	title: 'Zonage - ettiquettes',
	source:  new ol.source.Vector({
		url: 'https://raw.githubusercontent.com/mondarverne/webmap_plui_mac/main/DATA/200069177_ZONE_URBA_20260129.geojson',
		format: new ol.format.GeoJSON()
	}),
	style: styleFunction_zonage_ettiqu,
	minZoom : 13

})


var layer_prescri_surf = new ol.layer.Vector
({
	title: 'Prescriptions surfaciques',
	source:  new ol.source.Vector({
		url: 'https://raw.githubusercontent.com/mondarverne/webmap_plui_mac/main/DATA/200069177_PRESCRIPTION_SURF_20260129.geojson',
		format: new ol.format.GeoJSON(),
		attributions: ['© <a href="https://www.mond-arverne.fr/" target="_blanc">Mond’Arverne Communauté</a>']	
	}),
  style: styleFunction_prescri_surf,
  visible: true,
  minZoom : 15
})


var layer_prescri_lin = new ol.layer.Vector
({
	title: 'Prescriptions linéaires',
	source:  new ol.source.Vector({
		url: 'https://raw.githubusercontent.com/mondarverne/webmap_plui_mac/main/DATA/200069177_PRESCRIPTION_LIN_20260129.geojson',
		format: new ol.format.GeoJSON()
	}),
  style: styleFunction_lines,
  visible: true,
  minZoom : 15
})


var layer_prescri_pt = new ol.layer.Vector
({
	title: 'Prescriptions ponctuelles',
	source:  new ol.source.Vector({
		url: 'https://raw.githubusercontent.com/mondarverne/webmap_plui_mac/main/DATA/200069177_PRESCRIPTION_PCT_20260129.geojson',
		format: new ol.format.GeoJSON()
	}),
  style: styleFunction_points,
  visible: true,
  minZoom : 15
})


///////////////////////////////
// Mise en place des groupes //
///////////////////////////////

const group_plui= new ol.layer.Group({
		title: "Plan Local d'Urbanisme",
		fold: 'open',
		layers:[
			layer_typezone,
			layer_zonage,
			layer_prescri_surf,
			layer_prescri_lin,
			layer_prescri_pt,
		],
	})

const group_fdp=new ol.layer.Group({
	title: 'Fond de plan',
	fold: 'open',
	layers:[
		ign_tuile_gris,
		ign_tuile_coul,
		img_aerienne_layer,
		sansfond_layer
	],
})
var data_group = [group_fdp, group_plui, vectorTileLayer_cadastre]
