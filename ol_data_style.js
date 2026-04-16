////////////////////////////////////////////
////// JS pour les styles des données //////
////////////////////////////////////////////

const styleFunction_communes = (feature, resolution) => {
	// paramètre de zoom minimal pour les labels
  const minZoomLabels = 12;
  const maxZoomLabels = 15;

  const minResolutionLabels = resolutionForZoom(minZoomLabels);
  const maxResolutionLabels = resolutionForZoom(maxZoomLabels);
	
	const style = new ol.style.Style({
		stroke: new ol.style.Stroke({ 
		color: '#252525',
		with: 2
	})
})

  // On ajoute le texte SEULEMENT si on est assez zoomé
  if (resolution < minResolutionLabels && resolution > maxResolutionLabels) {
    style.setText(new ol.style.Text({
      font: 'bold 12px Asap',
      text: feature.get("nom") || '',
      fill: new ol.style.Fill({ color: '#303030' }),
      stroke: new ol.style.Stroke({ color: '#ffffffa1', width: 2 }), // halo
      overflow: true,
      placement: 'point',
      textAlign: 'center'
    }));
  }
  return style;
};


//// Style pour la couche zonage ////
const styleRules_zonage = [
  { label: 'Uc, Uh', condition: f => ['Uc', 'Uh'].includes(f.get('LIBELLE')), fill: '#f7f7f7', stroke: '#000000', strokeWidth: 1.5 },
  { label: 'Ue', condition: f => f.get('LIBELLE') === 'Ue', fill: '#e4effb', stroke: '#7aabe3', strokeWidth: 2, lineDash: [4,6] },
  { label: 'Us*', condition: f => f.get('LIBELLE')?.startsWith('Us'), fill: '#ebe9ea', stroke: '#232323ff', strokeWidth: 0.5 },
  { label: 'Ui*', condition: f => f.get('LIBELLE')?.startsWith('Ui'), fill: '#ffedd9', stroke: '#ea5a0d', strokeWidth: 2, lineDash: [4,6] },
  { label: 'Um*', condition: f => f.get('LIBELLE')?.startsWith('Um'), fill: '#f6e5ff', stroke: '#c816f4', strokeWidth: 2, lineDash: [4,6] },
  { label: 'Ut, Ut-p', condition: f => ['Ut','Ut-p'].includes(f.get('LIBELLE')), fill: '#f1fff0', stroke: '#0fbd2f', strokeWidth: 2, lineDash: [4,6]},
  { label: 'Ur', condition: f => f.get('LIBELLE') === 'Ur', fill: '#f6bbf9', stroke: '#e478f2', strokeWidth: 0.5 },
  { label: 'Ug', condition: f => f.get('LIBELLE') === 'Ug', fill: '#ffffff', stroke: '#000000', strokeWidth: 0.5 },
  { label: 'AU sauf 2AU', condition: f => f.get('TYPEZONE') === 'AUc', fill: '#f16769', stroke: '#000000', strokeWidth: 0.5 },
  { label: '2AU', condition: f => f.get('TYPEZONE') === 'AUs', fill: '#f1a3a4', stroke: '#000000', strokeWidth: 0.5 },
  { label: 'Ac', condition: f => f.get('LIBELLE') === 'Ac', fill: '#fcd47e', stroke: '#000000', strokeWidth: 0.5 },
  { label: 'Aa-*', condition: f => f.get('LIBELLE')?.startsWith('Aa-'), fill: '#e3c1a4', stroke: '#000000', strokeWidth: 0.5 },
  { label: 'Ar', condition: f => f.get('LIBELLE') === 'Ar', fill: '#fff0bc', stroke: '#ff8d29', strokeWidth: 2, lineDash: [4,6] },
  { label: 'A sauf Ac, Ar, Aa-*', condition: f => f.get('TYPEZONE') === 'A' && !['Ac','Ar'].includes(f.get('LIBELLE')) && !(f.get('LIBELLE')?.startsWith('Aa-')), fill: '#fffde3', stroke: '#000000', strokeWidth: 0.5 },
  { label: 'N', condition: f => f.get('LIBELLE') === 'N', fill: '#cdf4c2', stroke: '#000000', strokeWidth: 0.5 },
  { label: 'Nh*', condition: f => f.get('LIBELLE')?.startsWith('Nh'), fill: '#c5fb6e', stroke: '#000000', strokeWidth: 0.5 },
  { label: 'Nc', condition: f => f.get('LIBELLE') === 'Nc', fill: '#92fbda', stroke: '#000000', strokeWidth: 0.5 },
  { label: 'Nj', condition: f => f.get('LIBELLE') === 'Nj', fill: '#c7ffdc', stroke: '#000000', strokeWidth: 0.5 },
  { label: 'Nl*', condition: f => f.get('LIBELLE')?.startsWith('Nl'), fill: '#b7eacd', stroke: '#3b9461', strokeWidth: 2, lineDash: [4,6] },
  { label: 'Nt, Nt*', condition: f => f.get('LIBELLE')?.startsWith('Nt'), fill: '#a3f0bd', stroke: '#0fbd2f', strokeWidth: 2, lineDash: [4,6] },
  { label: 'Np', condition: f => f.get('LIBELLE') === 'Np', fill: '#9bd78e', stroke: '#000000', strokeWidth: 0.5 },
];



// === Fonction de style ===
const styleFunction_zonage = (feature) => {
  let rule = styleRules_zonage.find(r => r.condition(feature));
  if (!rule) {
    rule = { fill: 'rgba(0,0,255,0.5)', stroke: '#000000', strokeWidth: 0.5 };
  }

  // Style polygone (toujours affiché)
  const style = new ol.style.Style({
    fill: new ol.style.Fill({ color: rule.fill }),
    stroke: new ol.style.Stroke({
      color: rule.stroke,
      width: rule.strokeWidth,
      lineDash: rule.lineDash
    })
  });

  return style;
};


// Fonction pour convertir un zoom en résolution
const resolutionForZoom = (zoom) => {
  const baseResolution = 156543.03392804097; // EPSG:3857, taille tuile = 256px
  return baseResolution / Math.pow(2, zoom);
};

const styleFunction_zonage_ettiqu = (feature, resolution) => {
  // paramètre de zoom minimal pour les labels
  var minZoomLabels = 15;
  var minResolutionLabels = resolutionForZoom(minZoomLabels);

  const style = new ol.style.Style({})

  // On ajoute le texte SEULEMENT si on est assez zoomé
  if (resolution < minResolutionLabels) {
    style.setText(new ol.style.Text({
      font: '13px Calibri,bold',
      text: feature.get("LIBELLE") || '',
      fill: new ol.style.Fill({ color: '#000000' }),
      stroke: new ol.style.Stroke({ color: '#ffffff', width: 2 }), // halo
      overflow: true,
      placement: 'point',
      textAlign: 'center'
    }));
  }
  return style;
};


//// Style pour la couche tyoezone ////
const styleRules_type_zone = [
  { label: 'U', condition: f => f.get('TYPEZONE') === 'U', fill: '#ffffff', stroke: '#000000', strokeWidth: 0.5 },
  { label: 'AU', condition: f => f.get('TYPEZONE') === 'AU', fill: '#f16769', stroke: '#000000', strokeWidth: 0.5 },
  { label: 'A', condition: f => f.get('TYPEZONE') === 'A', fill: '#fffde3', stroke: '#000000', strokeWidth: 0.5 },
  { label: 'N', condition: f => f.get('TYPEZONE') === 'N', fill: '#9bd78e', stroke: '#000000', strokeWidth: 0.5 },
];


// === Fonction de style ===
const styleFunction_type_zone = (feature) => {
  let rule = styleRules_type_zone.find(r => r.condition(feature));
  if (!rule) {
    rule = { fill: 'rgba(0,0,255,0.5)', stroke: '#000000', strokeWidth: 0.5 };
  }
  return new ol.style.Style({
    fill: new ol.style.Fill({ color: rule.fill }),
    stroke: new ol.style.Stroke({
      color: rule.stroke,
      width: rule.strokeWidth,
      lineDash: rule.lineDash
    })
  });
};


//// Style pour la couche des prescriptions surfaciques ////    
// === Table des règles ===
const styleRules_prescri_surf = [
  {
    label: 'Espaces boisés classés',
    condition: f => f.get('LIBELLE') === 'Espace boisé classé',
    style: () => [
      new ol.style.Style({
        stroke: new ol.style.Stroke({ color: '#004d1f', width: 0.5 }),
        fill: new ol.style.FillPattern({
          pattern: 'cross',
          size: 0.8,
          color: '#004d1fff',
          background: 'rgba(255,255,255,0)',
          scale: 1.5,
          spacing: 7
        })
      }),
      new ol.style.Style({
        fill: new ol.style.FillPattern({
          pattern: 'circle',
          size: 7,
          color: '#004d1fff',
          background: 'rgba(255,255,255,0)',
          scale: 1,
          spacing: 10,
          offset: 1
        })
      })
    ]
  },
  {
    label: 'ER -%',
    condition: f => f.get('LIBELLE')?.startsWith('ER -'),
    stroke: '#d33283',
    strokeWidth: 0.5,
    fillPattern: {
      pattern: 'cross',
      color: '#d33283',
      background: '#ffffff',
      size: 0.3,
      scale: 2,
      spacing: 2,
      angle: 1
    }
  },
  {
    label: "Périmètre d'attente de projet d'aménagement global (PAPAG)",
    condition: f => f.get('LIBELLE') === "Périmètre d'attente de projet d'aménagement global (PAPAG)",
    stroke: '#487ebc00',
    strokeWidth: 0.5,
    fillPattern: {
      pattern: 'cross',
      color: '#487ebc',
      background: '#ffffff',
      size: 0.3,
      scale: 2,
      spacing: 2,
      angle: 1
    }
  },
  {
    label: 'Zone non aedificandi',
    condition: f => f.get('LIBELLE')?.startsWith('Zone non aedificandi'),
    stroke: '#2d93e7ff',
    strokeWidth: 0.5,
    fill: { color: '#5aa7e74c' }
  },
    {
    label: 'Bâtiment pouvant changer de destination',
    condition: f => f.get('LIBELLE') === 'Bâtiment pouvant changer de destination',
    stroke: '#a909da',
    fill: { color: '#a909da' }
  },
  {
    label: 'Secteur de taille et de capacité d’accueil limitées (STECAL)',
    condition: f => f.get('LIBELLE')?.startsWith('Secteur de taille et de capacité d’accueil limitées (STECAL)'),
    stroke: '#e41417',
    strokeWidth: 1.3
  },
  {
    label: 'UTN',
    condition: f => f.get('LIBELLE')?.startsWith('UTN'),
    stroke: '#e4910d',
    strokeWidth: 1.3
  },
  {
    label: 'OAP',
    condition: f => f.get('LIBELLE') === "Orientations d'Aménagement et de Programmation (OAP)",
    stroke: '#376bef',
    strokeWidth: 2
  },
  {
    label: 'Terres d’intérêt viticoles',
    condition: f => f.get('LIBELLE') === 'Zone viticole',
    stroke: '#881059',
    strokeWidth: 0.5,
    fillPattern: {
      pattern: 'hatch',
      color: '#881059',
      background: '#ffffff01',
      size: 0.3,
      spacing: 5,
      angle: 45,
      scale: 2
    }
  },
  {
    label: 'Patrimoine végétal et paysagé',
    condition: f => f.get('LIBELLE') === 'Patrimoine végétal et paysagé',
    stroke: '#004b00',
    strokeWidth: 0.5,
    fillPattern: { pattern: 'flooded', color: '#004b00' }
  },
  {
    label: 'zones humides',
    condition: f => f.get('LIBELLE') === 'Zone humide',
    stroke: '#4a88f3ff',
    strokeWidth: 0.5,
    fillPattern: { pattern: 'circle', color: '#4a88f3ff', size: 4 }
  },
  {
    label: 'Pelouse sèche',
    condition: f => f.get('LIBELLE') === 'Pelouse sèche',
    stroke: '#d0bb00ff',
    strokeWidth: 0.5,
    fillPattern: { pattern: 'vine', color: '#d0bb00', size: 4 }
  },
  {
    label: "Périmètre de protection des plans d'eau",
    condition: f => f.get('LIBELLE') === "Périmètre de protection des plans d'eau",
    stroke: '#137db7ff',
    strokeWidth: 0.5,
    lineDash: [4, 6],
    fillPattern: {
      pattern: 'dot',
      color: '#137db7ff',
      size: 1.5,
      spacing: 3
    }
  },
  {
    label: 'Bois et bosquet',
    condition: f => f.get('LIBELLE') === 'Bois et bosquets',
    stroke: '#030503ff',
    strokeWidth: 0.5,
    fillPattern: { pattern: 'circle', color: '#114611c4', size: 4 }
  }
];


// Fonction de style prescri_surf
const styleFunction_prescri_surf = (feature, resolution) => {
  let rule = styleRules_prescri_surf.find(r => r.condition(feature));

  // paramètre de zoom minimal pour les labels
  const minZoomLabels = 18;
  const minResolutionLabels = resolutionForZoom(minZoomLabels);

  // Cas particulier où rule.style est défini (ex: "Espaces boisés classés")
  if (rule?.style) return rule.style();

  if (!rule) {
    // Style par défaut
    rule = {
      stroke: '#000000ff',
      strokeWidth: 0.5,
      fillPattern: {
        pattern: 'hatch',
        color: 'rgba(119, 216, 81, 0.5)',
        background: '#ffffff01',
        size: 1,
        scale: 1,
        spacing: 10,
        angle: 0
      }
    };
  }

  // Création du style de base
  const style = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: rule.stroke,
      width: rule.strokeWidth,
      lineDash: rule.lineDash
    }),
    fill: rule.fill
      ? new ol.style.Fill(rule.fill)
      : rule.fillPattern
      ? new ol.style.FillPattern(rule.fillPattern)
      : undefined
  });

  // Ajout du texte SEULEMENT si on est assez zoomé
  if (resolution < minResolutionLabels) {
    style.setText(new ol.style.Text({
      font: '12px Calibri,bold',
      text: feature.get("TXT") || '',   // <- champ NUMERO ici
      fill: new ol.style.Fill({ color: '#d33283'}),
      stroke: new ol.style.Stroke({ color: '#ffffff', width: 2 }), // halo blanc
      overflow: true,
      placement: 'point',
      textAlign: 'center'
    }));
  }
  return style;
};

//// Style pour la couche des prescriptions lineaires ////    
// === Table des règles pour les lignes ===
const styleRules_lines = [
  {
    condition: f => f.get('LIBELLE') === 'Haie (à préserver, à compléter ou à créer)',
    customStyle: () => [
      new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: '#2b9a18', // vert forêt
          width: 1.5
        })
      }),
      new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: '#2b9a18',
          width: 3.5,
          lineDash: [1, 16] // "points" espacés
        })
      })
    ]
  },
  {
    label: 'Linéaire commercial',
    condition: f => f.get('LIBELLE') === 'Linéaire commercial',
    stroke: '#ff7f3f',
    strokeWidth: 3
  }
];


// === Fonction de style ===
const styleFunction_lines = (feature) => {
  const rule = styleRules_lines.find(r => r.condition(feature));
  if (rule) {
    if (rule.customStyle) {
      return rule.customStyle(feature);
    }

    // Sinon on applique un style standard
    return new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: rule.stroke,
        width: rule.strokeWidth,
        lineDash: rule.lineDash || undefined
      })
    });
  }

  // Style par défaut
  return new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'gray',
      width: 1
    })
  });
};


//// Style pour la couche des prescriptions ponctuelles ////    
// === Table des règles ===
const styleRules_points = [
  {
    label: 'Arbre remarquable',
    condition: f => f.get('LIBELLE') === 'Patrimoine végétal',
    style: () => new ol.style.Style({
      image: new ol.style.RegularShape({
        points: 3, // triangle
        radius: 6,
        fill: new ol.style.Fill({ color: '#00c400' }),
        stroke: new ol.style.Stroke({ color: '#000', width: 0.5 }),
        rotation: 45
      })
    })
  },
  {
    label: 'Petit patrimoine local (L 151 19)',
    condition: f => !['Patrimoine végétale'].includes(f.get('LIBELLE')),
    style: () => new ol.style.Style({
      image: new ol.style.RegularShape({
        points: 4, // carré
        radius: 5,
        angle: 0,
        fill: new ol.style.Fill({ color: '#ff6505' }),
        stroke: new ol.style.Stroke({ color: '#000', width: 0.5 })
      })
    })
  }
];

// === Fonction de style ===
const styleFunction_points = (feature) => {
  const rule = styleRules_points.find(r => r.condition(feature));
  if (rule) return rule.style();

  // Style par défaut si aucune règle trouvée
  return new ol.style.Style({
    image: new ol.style.Circle({
      radius: 5,
      fill: new ol.style.Fill({ color: 'gray' }),
      stroke: new ol.style.Stroke({ color: '#000', width: 1 })
    })
  });
};
