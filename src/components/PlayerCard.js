import React from 'react';
import RadarChart from './RadarChart';
// import './PlayerCard.css';

const PlayerCard = ({ player }) => {
  const skillsData = [
    { label: 'Dribble Skills', value: player['Dribble Skills'] },
    { label: 'Length', value: player.Length },
    { label: 'Weight', value: player.Weight },
    { label: 'Age', value: player.Age },
    { label: 'Ball Control', value: player['Ball Control'] },
    {
      label: 'Passing Under Pressure',
      value: player['Passing Under Pressure'],
    },
  ];

  return (
    <div className="player-card">
      <h2>{player.Player}</h2>
      <div className="radar-chart-container">
        <RadarChart data={skillsData} />
      </div>
      <ul>
        <li>Team: {player.Team}</li>
        <li>Position: {player.Position}</li>
        <li>Dribble Skills: {player['Dribble Skills']}</li>
        <li>Length: {player.Length}</li>
        <li>Weight: {player.Weight}</li>
        <li>Age: {player.Age}</li>
        <li>Ball Control: {player['Ball Control']}</li>
        <li>Passing Under Pressure: {player['Passing Under Pressure']}</li>
      </ul>
    </div>
  );
};

export default PlayerCard;
