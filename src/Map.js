/* eslint-disable */
import React, { Component } from "react";
import OlMap from "ol/Map";
import OlView from "ol/View";
import OlLayerTile from "ol/layer/Tile";
import GeoJSON from 'ol/format/GeoJSON';
import OlSourceOSM from "ol/source/OSM";
import Zoom from 'ol/control/Zoom';
import windowDimensions from 'react-window-dimensions';
import PropType from 'prop-types';
import { Fill, Stroke, Style } from 'ol/style';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import Proj4 from 'proj4/lib';
import { register } from 'ol/proj/proj4';
import isEqual from 'lodash/isEqual';
import geo from './static/clipped_poly.js';
import { filterGeo } from './utils/filter';
import './styles/map.scss';

const colorConf = {
  1: {
    1: 'brown',
    2: 'green',
    3: 'green',
    4: 'green',
    5: 'green',
    6: 'green',
    7: 'green',
    8: 'green',
    9: 'green',
    10: 'green',
    11: 'green'
  },
  2: {
    1: 'green',
    2: 'green',
    3: 'green',
    4: 'blue',
    5: 'blue',
    6: 'blue',
    7: 'blue',
    8: 'red',
    9: 'red',
    10: 'red',
    11: 'red'
  },
  3: {
    urban: 'grey',
    forest: 'green',
    Water: 'blue',
    agri: 'orange',
    other: 'brown'
  }
}
const getColors = (id, mainType) => {
  return colorConf[mainType][id];
}

const styles = (id, mainType) => new Style({
  stroke: new Stroke({
    color: getColors(id, mainType),
    width: 1
  }),
  fill: new Fill({
    color: getColors(id, mainType)
  })
})

const geoJsonObject = geo;

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      center:[635047.1775508502, 6897943.454034535],
      zoom: 9,
      initialView: false,
      showSubmit: false,
      crops: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true, 10: true, 11: true }
    };
    this.updateLegends = this.updateLegends.bind(this);
    Proj4.defs("EPSG:28992", "+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=m +no_defs");
    register(Proj4);
    let vectorSource;
    let vectorLayer;
    vectorSource = new VectorSource({
      features: (new GeoJSON({
        dataProjection: 'EPSG:28992',
        featureProjection: 'EPSG:3857'

      })).readFeatures(geoJsonObject)
    });
    vectorLayer = new VectorLayer({
      source: vectorSource,
      style: this.styleFunction
    });
    this.olmap = new OlMap({
      target: null,
      layers: [
        new OlLayerTile({
          source: new OlSourceOSM()
        }),
        vectorLayer
      ],
      controls: [
        new Zoom({
          className: 'zoom'
        })
      ],
      view: new OlView({
        center: this.state.center,
        zoom: this.state.zoom
      })
    });
  }
  styleFunction = feature => {
    let {mainType} = this.props;
    let id = mainType === 3 ? feature.values_.Hoofdgroep : feature.values_.GWS_GEWASC;
    return styles(id, mainType);
  };
  updateLegends = crops => {
    let filtered = filterGeo(crops, this.props.mainType);
    let vectorSource = new VectorSource({
      features: (new GeoJSON({
        dataProjection: 'EPSG:28992',
        featureProjection: 'EPSG:3857'
      })).readFeatures(filtered)
    });
    this.olmap.getLayers().array_[1].setSource(vectorSource);
  };

  updateMap() {
    this.olmap.getView().setCenter(this.state.center);
    this.olmap.getView().setZoom(this.state.zoom);
  }

  componentDidMount() {
    var me = this;
    this.olmap.setTarget("map");
    this.olmap.on("moveend", () => {
      let center = this.olmap.getView().getCenter();
      let zoom = this.olmap.getView().getZoom();
      this.setState({ center, zoom });
    });
  }
  shouldComponentUpdate(nextProps, nextState) {
    let center = this.olmap.getView().getCenter();
    let zoom = this.olmap.getView().getZoom();
    if (center === nextState.center && zoom === nextState.zoom && this.props.mainType === nextProps.mainType && isEqual(this.props.subType, nextProps.mainType)) return false;
    return true;
  }
  componentDidUpdate() {
    let crop = { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false, 9: false, 10: false, 11: false };
    let { mainType, subType } = this.props;
    if (mainType === 1) {
      if (subType[101])
        crop[1] = true;
      if (subType[102])
        crop = { ...crop, ...{ 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true, 10: true, 11: true } };
    }
    if (mainType === 2) {
      if (subType[201])
        crop = { ...crop, ...{ 1: true, 2: true, 3: true } };
      if (subType[202])
        crop = { ...crop, ...{ 6: true, 7: true, 4: true, 5: true } };
      if (subType[203])
        crop = { ...crop, ...{ 8: true, 9: true, 10: true, 11: true } };
    }
    if(mainType === 3){
      crop = {urban:false, agri:false, other: false, forest:false, Water:false}
      if(subType[301])
        crop.urban = true;
      if(subType[302])
        crop.agri = true;
        if(subType[303])
        crop.Water = true;
      if(subType[304])
        crop.forest = true;
        if(subType[305])
        crop.other = true;
    }
    this.updateLegends(crop);
  }
  render() {
    this.updateMap();
    return (
      <div id="map" style={{ width: "100%", height: `${this.props.height * .88}px` }} key='0'></div>
    );
  }
}
Map.propTypes = {
  height: PropType.number
}
export default windowDimensions()(Map);
