import React, {useState} from 'react';
import {useAppStyles} from './Style';
import GamePanel from './GamePanel'

const initialState = {
  gridHeight:10,
  gridWidth:10,
  gridMines:20
}
export const  App:React.FC = () => {
  const [state, setAppState] = useState(initialState)
  const saveSettings = ({gridHeight, gridWidth}:any) => {
    const gridMines = Math.floor((gridHeight * gridWidth) * 0.2)
    setAppState({gridHeight, gridWidth, gridMines})
  }
  const classes = useAppStyles()
    return (
      <div className={classes.gameContainer}>
        <h2>Minesweeper Game</h2>   
        <GamePanel {...state} saveSettings={saveSettings} />     
      </div>
    );
}

export default App;
