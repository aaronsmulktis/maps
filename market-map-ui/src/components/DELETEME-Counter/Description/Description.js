import React from 'react';
import { DescriptionWrapper, Emphasis } from './Description.styles';

const Description = () => (
  <DescriptionWrapper>
    <ul>
      <li>
        Run <Emphasis>npm install</Emphasis>
      </li>
      <li>
        Run <Emphasis>npm run start:dev</Emphasis>
      </li>
      <hr />
      <li>
        The app will launch and run a concurrent express server on{' '}
        <Emphasis>port 3000</Emphasis>
      </li>
      <li>
        Navigate to components/DELETEME-Counter folder to follow the example of wiring
        smart and presentational components
      </li>
      <li>The app also has Linting and Styled components configured.</li>
      <li>
        Toggle the increment/decrement buttons to change the redux store count
        value
      </li>
      <li>
        After looking at the examples, delete the Counter and Layout folders
      </li>
    </ul>
  </DescriptionWrapper>
);

export default Description;
