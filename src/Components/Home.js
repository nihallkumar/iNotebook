import React from 'react';
import Notes from './Notes';

export default function Home(props) {
  const { showAlert } = props.showAlert;
  return <>
    <Notes showAlert={showAlert} />
  </>;
} 