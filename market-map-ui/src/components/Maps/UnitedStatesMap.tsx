
import React, { useState, useEffect, useCallback } from 'react';
import { withTheme } from 'styled-components';
import * as topojson from 'topojson-client';
import { scaleQuantize } from '@vx/scale';
import { AlbersUsa, Mercator, EqualEarth, CustomProjection, Graticule } from '@vx/geo';
import { Projection } from '@vx/geo/lib/types';
import { Zoom } from '@vx/zoom';
import { GeometryObject, Topology } from 'topojson-specification';
import {
  geoAlbersUsa,
  geoConicConformal,
  geoTransverseMercator,
  geoNaturalEarth1,
  geoConicEquidistant,
  geoOrthographic,
  geoStereographic,
} from 'd3-geo';
import topology from '../../data/us-contiguous-states.json';
import locations from '../../data/carvana-locations.json';

import { MapWrapper, StatePath } from './UnitedStates.styles'

interface Theme {}

const newlocations = locations.data.map(e => {
  return {
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "Point",
      "coordinates": [
        e.Longitude,
        e.Latitude
      ]
    }
  }
})

export type MapProps = {
  width: number;
  height: number;
  theme: Theme;
  events?: boolean;
};

interface FeatureShape {
  type: 'Feature';
  id: string;
  geometry: { coordinates: [number, number][][]; type: 'Polygon' };
  properties: { name: string };
}
interface LocationShape {
  id: number;
  Year: number;
  CityType: string;
  Icon: string;
  Description: string;
  Longitude: string;
  Latitude: string;
}

interface TransformShape {}

const PROJECTIONS: { [projection: string]: Projection } = {
  geoConicConformal,
  geoTransverseMercator,
  geoNaturalEarth1,
  geoConicEquidistant,
  geoOrthographic,
  geoStereographic,
};

const unitedstates = topojson.feature(topology as Topology, topology.objects.states as GeometryObject) as {
  type: 'FeatureCollection';
  features: FeatureShape[];
};

function get_xy(lat, lng){
var mapWidth=2058;
var mapHeight=1746;
var factor=.404;
var x_adj=-391;
var y_adj=37;
var x = (mapWidth*(180+lng)/360)%mapWidth+(mapWidth/2);
var latRad = lat*Math.PI/180;
var mercN = Math.log(Math.tan((Math.PI/4)+(latRad/2)));
var y = (mapHeight/2)-(mapWidth*mercN/(2*Math.PI));
return { x: x*factor+x_adj,y: y*factor+y_adj}
}


const UnitedStatesMap = ({ theme, width, height, events = true }: MapProps) => {
  const [projection, setProjection] = useState<keyof typeof PROJECTIONS>('geoAlbersUsa');
  const [activeState, setActiveState] = useState<Any>('');
  const [activeLocation, setActiveLocation] = useState<Any>('');

  const [size, setSize] = useState({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight
  })

  const onResize = useCallback(() => {
    setSize({
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
    })
  }, [])

  useEffect(() => {
    window.addEventListener('resize', onResize);
    return (() => {
        window.removeEventListener('resize', onResize)
    })
  }, [size])
  return width < 100 ? null : (
    <>
      <MapWrapper className="container united-states-map">
        <filter id="dropshadow" x="-2" y="-2" width="200" height="200">
          <feGaussianBlur  stdDeviation="1"/>
        </filter>
        <svg width={size.width} height={size.height}>
          <rect x={0} y={0} width={size.width} height={size.height} fill={theme.carvana.white.primary} />
          <AlbersUsa<FeatureShape>
            projection={PROJECTIONS[projection]}
            data={unitedstates.features}
            scale={size.width/1.3}
            translate={[size.width * 1.8, size.height * (size.width/size.height * 0.8)]}
          >
            {projection => (
              <g>
                <Graticule graticule={g => projection.path(g) || ''} stroke={theme.carvana.gray.light} />
                {projection.features.map(({ feature, path }, i) => (
                  <StatePath
                    className={`feature-${i}`}
                    key={`feature-${i}`}
                    d={path || ''}
                    fill="url(#usBg)"
                    stroke={theme.carvana.white.primary}
                    strokeWidth={1}
                    onMouseEnter={e => setActiveState(`feature-${i}`)}
                    style={activeState === `feature-${i}` ? {fill: theme.carvana.blue.primary} : {fill: theme.carvana.blue.pastel}}
                    // onClick={(e) => {
                    //   if (events) alert(`Clicked: ${feature.properties.name} (${feature.id})`);
                    // }}
                  />
                ))}
              </g>
            )}
          </AlbersUsa>

          <AlbersUsa<FeatureShape>
            projection={PROJECTIONS[projection]}
            data={newlocations}
            scale={size.width/1.3}
            translate={[size.width * 1.8, size.height * (size.width/size.height * 0.8)]}
          >
            {/* {projection => {
              console.log("projection",projection)
              return projection.features.map(({ feature, path, projection }, i) => {
                return (
                  // <g  class="dot">
                  //   <defs>
                  //     <radialGradient id='grad1' >
                  //         <stop offset='80%' stopColor={theme.carvana.yellow.primary} stopOpacity={1} />
                  //         <stop offset='90%' stopColor={theme.carvana.white.primary} stopOpacity={0.9} />
                  //         <stop offset='100%' stopColor={theme.carvana.white.primary} stopOpacity={0} />
                  //     </radialGradient>
                  //   </defs>
                  // </g>
                )
              })
            }} */}
            {mercator => {
              return <g>
              {mercator.features.map(({ feature, path }, i) => (
                <path 
                key={i} 
                fill={"#000"} 
                d={path}
                onClick={(e) => {
                  console.log("e",e)
                }}
                ></path>))
                }
            </g>
            }}
          </AlbersUsa>
        </svg>
      </MapWrapper>
      <style jsx>{`
        .container {
          position: relative;
        }
        svg {
          cursor: pointer;
        }
        svg.dragging {
          cursor: grabbing;
        }
        .btn {
          margin: 0;
          text-align: center;
          border: none;
          background: #dde1fe;
          color: #222;
          padding: 0 4px;
          border-top: 1px solid #8993f9;
        }
        .btn-lg {
          font-size: 12px;
          line-height: 1;
          padding: 4px;
        }
        .btn-zoom {
          width: 26px;
          font-size: 22px;
        }
        .btn-bottom {
          margin-bottom: 1rem;
        }
        .controls {
          position: absolute;
          bottom: 20px;
          right: 15px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        label {
          font-size: 12px;
        }
      `}</style>
    </>
  );
};

export default withTheme(UnitedStatesMap)
