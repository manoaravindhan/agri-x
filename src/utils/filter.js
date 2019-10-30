import geo from '../static/clipped_poly';
import cloneDeep from 'lodash/cloneDeep';
import lulc from '../static/lulc';

export const filterGeo = (legends, main)=>{
    var f;
    if(main === 3){
        f = cloneDeep(lulc);
        f.features = f.features.filter(v=> legends[v.properties.Hoofdgroep])
    }else{
        f = cloneDeep(geo);
        f.features = f.features.filter(v=> legends[v.properties.GWS_GEWASC])
    }
    return f;
};