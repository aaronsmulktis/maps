import React, { useState } from 'react';
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

export type MapProps = {
  width: number;
  height: number;
  events?: boolean;
};

interface FeatureShape {
  type: 'Feature';
  id: string;
  geometry: { coordinates: [number, number][][]; type: 'Polygon' };
  properties: { name: string };
}

export const background = '#252b7e';
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
    '#f4448b',
    '#fccf35',
    '#82b75d',
    '#b33c88',
    '#fc5e2f',
    '#f94b3a',
    '#f63a48',
    '#dde1fe',
    '#8993f9',
    '#b6c8fb',
    '#65fe8d',
  ],
});

export default function Map({ width, height, events = true }: MapProps) {
  const [projection, setProjection] = useState<keyof typeof PROJECTIONS>('geoAlbersUsa');

  return width < 100 ? null : (
    <>
      <div className="container">
        <svg width={width} height={height}>
          <rect x={0} y={0} width={width} height={height} fill={background} rx={14} />
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
                  <path
                    key={`map-feature-${i}`}
                    d={path || ''}
                    fill={color(feature.geometry.coordinates.length)}
                    stroke={background}
                    strokeWidth={0.5}
                    onClick={() => {
                      if (events) alert(`Clicked: ${feature.properties.name} (${feature.id})`);
                    }}
                  />
                ))}
              </g>
            )}
          </AlbersUsa>

          {/** intercept all mouse events */}
          <rect
            x={0}
            y={0}
            width={width}
            height={height}
            rx={14}
            fill="transparent"
          />
        </svg>
      </div>
      <label>
        projection:{' '}
        <select onChange={event => setProjection(event.target.value)}>
          {Object.keys(PROJECTIONS).map(projectionName => (
            <option key={projectionName} value={projectionName}>
              {projectionName}
            </option>
          ))}
        </select>
      </label>
      <style jsx>{`
        .container {
          position: relative;
        }
        svg {
          cursor: grab;
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
}
