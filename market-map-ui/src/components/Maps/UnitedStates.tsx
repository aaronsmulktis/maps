
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

const purple = '#201c4e';
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

const UnitedStates = ({ theme, width, height, events = true }: MapProps) => {
  const [projection, setProjection] = useState<keyof typeof PROJECTIONS>('geoAlbersUsa');
  const [highlighted, setHighlighted] = useState<Any>('');

  // const { theme } = props;
  const { carvana } = theme;
  console.log('theme: ', theme);

  return width < 100 ? null : (
    <>
      <MapWrapper className="container united-states-map">
      <defs>
        <pattern id="usBg" patternUnits="userSpaceOnUse" width="400" height="400">
          <image href="images/positive.png" x="0" y="0" width="400" height="400" />
        </pattern>
      </defs>
        <svg width={width} height={height}>
          <rect x={0} y={0} width={width} height={height} fill={theme.carvana.blue.dark} rx={14} />
          <AlbersUsa<FeatureShape>
            projection={PROJECTIONS[projection]}
            data={unitedstates.features}
            scale={width/1.3}
            translate={[width * 1.8, height * 1.5]}
          >
            {projection => (
              <g>
                <Graticule graticule={g => projection.path(g) || ''} stroke={purple} />
                {projection.features.map(({ feature, path }, i) => (
                  <StatePath

                    class={`feature-${i}`}
                    key={`feature-${i}`}
                    d={path || ''}
                    // fill={theme.carvana.blue.primary}
                    fill="url(#usBg)"
                    stroke={theme.carvana.blue.dark}
                    strokeWidth={1}
                    onMouseEnter={e => setHighlighted(`feature-${i}`)}
                    // style={highlighted === `feature-${i}` ? {fill: 'red'} : {fill: theme.carvana.blue.primary}}
                    style={highlighted === `feature-${i}` ? {fill: theme.carvana.yellow.primary} : {fill: theme.carvana.blue.primary}}
                    onClick={(e) => {
                      if (events) alert(`Clicked: ${feature.properties.name} (${feature.id})`);
                    }}
                  />
                ))}
              </g>
            )}
          </AlbersUsa>

          {/* Points */}
          <AlbersUsa<FeatureShape>
            projection={PROJECTIONS[projection]}
            data={locations.data}
            scale={width/1.3}
            translate={[width * 1.8, height * 1.5]}
          >
            {projection => {
              console.log('projection: ', projection);
              return (
                <g>
                  {projection.features.map(({ feature, path, projection, Year, CityType, Icon, Description, Longitude, Latitude }, i) => (
                    // <path
                    //   key={`location-${i}`}
                    //   d={path || ''}
                    //   fill={'red'}
                    //   stroke={theme.carvana.blue.dark}
                    //   strokeWidth={1}
                    //   onClick={(e) => {
                    //     if (events) alert(`Clicked: ${feature.properties.name} (${feature.id})`);
                    //   }}
                    // />
                    <circle
                      key={`locale-${i}`}
                      fill={'#fff'}
                      // stroke={theme.carvana.blue.dark}
                      // strokeWidth={0.8}
                      onClick={(e) => {
                        if (events) alert(`Clicked: ${feature.properties.name} (${feature.id})`);
                      }}
                      // cx={feature.Latitude * 10}
                      // cy={feature.Longitude * -5}
                      cx={feature.Longitude}
                      cy={feature.Latitude}
                      r="3"
                    />
                  ))}
                </g>
              )
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

export default withTheme(UnitedStates)
