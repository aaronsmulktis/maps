
import React, { useState } from 'react';
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

const locationTopology = topology.transform as TransformShape;

const unitedstates = topojson.feature(topology as Topology, topology.objects.states as GeometryObject) as {
  type: 'FeatureCollection';
  features: FeatureShape[];
};

const color = scaleQuantize({
  domain: [
    Math.min(...unitedstates.features.map(f => f.geometry.coordinates.length)),
    Math.max(...unitedstates.features.map(f => f.geometry.coordinates.length)),
  ],
  range: [
    '#019ece',
  ],
  // range: [
  //   '#019ece',
  //   '#f4448b',
  //   '#fccf35',
  //   '#82b75d',
  //   '#b33c88',
  //   '#fc5e2f',
  //   '#f94b3a',
  //   '#f63a48',
  //   '#dde1fe',
  //   '#8993f9',
  //   '#b6c8fb',
  //   '#65fe8d',
  // ],
});

const UnitedStatesMap = ({ theme, width, height, events = true }: MapProps) => {
  const [projection, setProjection] = useState<keyof typeof PROJECTIONS>('geoAlbersUsa');
  const [activeState, setActiveState] = useState<Any>('');
  const [activeLocation, setActiveLocation] = useState<Any>('');

  // console.log(locationTopology);

  const transformPointReversed = (transform, position) => {
    console.log('transform: ', transform, 'position: ', position);
    position = position.slice();
    position[0] = (position[0] - transform.translate[0]) / (transform.scale[0] * 200) - 300,
    // position[0] = width * (180 + position[0]) / 360
    position[1] = (position[1] - transform.translate[1]) / (transform.scale[1] * 900) - 750;
    // position[1] = height * (90 - position[1]) / 180
    // console.log(position);
    return position;
  };

  return width < 100 ? null : (
    <>
      <MapWrapper className="container united-states-map">
        {/* <defs>
          <pattern id="usBg" patternUnits="userSpaceOnUse" width="400" height="400">
            <image href="images/positive.png" x="0" y="0" width="400" height="400" />
          </pattern>
        </defs> */}
        <filter id="dropshadow" x="-2" y="-2" width="200" height="200">
          <feGaussianBlur  stdDeviation="1"/>
        </filter>
        <svg width={width} height={height}>
          <rect x={0} y={0} width={width} height={height} fill={theme.carvana.white.primary} />
          <AlbersUsa<FeatureShape>
            projection={PROJECTIONS[projection]}
            data={unitedstates.features}
            scale={width/1.3}
            translate={[width * 1.8, height * 1.5]}
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

          {/* Points */}
          <AlbersUsa<FeatureShape>
            projection={PROJECTIONS[projection]}
            data={locations.data}
            scale={width}
            translate={[width / 2, height / 2]}
          >
            {projection => {
              // console.log('projection: ', projection);
              return projection.features.map(({ feature, path, projection }, i) => {
                console.log('features: ', feature);
                const coords = [feature.Longitude, feature.Latitude];
                const title = feature.CityType;
                const newCoords = transformPointReversed(locationTopology, coords);
                // console.log('newCoords: ', newCoords);

                return (
                  <g
                    class="dot"
                    originalx={width}
                    originaly={height}
                  >
                    <defs>
                      <radialGradient id='grad1' >
                          <stop offset='80%' stopColor={theme.carvana.yellow.primary} stopOpacity={1} />
                          <stop offset='90%' stopColor={theme.carvana.white.primary} stopOpacity={0.9} />
                          <stop offset='100%' stopColor={theme.carvana.white.primary} stopOpacity={0} />
                          {/* <stop offset='50%' stopColor='yellow' stopOpacity={.5} />
                          <stop offset='400%' stopColor='white' stopOpacity={.8} /> */}
                      </radialGradient>
                    </defs>
                    <circle
                      key={`location-${i}`}
                      // stroke={theme.carvana.blue.dark}
                      // strokeWidth={0.8}
                      onClick={e => setActiveLocation(`location-${i}`)}
                      // onClick={(e) => {
                      //   if (events) alert(`Clicked: ${feature.properties.name} (${feature.id})`);
                      // }}
                      style={activeLocation === `location-${i}` ? {
                        fill: 'url(#grad1)',
                      } : {
                        fill: theme.carvana.blue.dark,
                        transform: `translate(${newCoords})`,
                        transform: `scaleY(-1)`,
                        //transform: `scale(1.2)`
                      }}
                      // cx={feature.Latitude * 10}
                      // cy={feature.Longitude * -5}
                      cx={newCoords[0]}
                      cy={newCoords[1]}
                      r={activeLocation === `location-${i}` ? '10' : '3'}
                    ></circle>
                    <text
                      style={activeLocation === `location-${i}` ? {
                        display: 'block',
                        color: theme.carvana.blue.primary,
                      } : {
                        display: 'none'
                      }}
                      x={newCoords[0] - (title?.length * 3.5)}
                      y={newCoords[1] - 6}
                    >{title}</text>
                  </g>
                )
              })
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
