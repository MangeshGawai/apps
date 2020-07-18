import React, {useState} from 'react';
import {useAppStyles} from './Style';
import GamePanel from './GamePanel'

const initialState = {
  gridHeight:8,
  gridWidth:8,
  gridMines:16
}

export const  App:React.FC = () => {
  const [state, setAppState] = useState(initialState)
  const saveSettings = ({gridHeight, gridWidth}:any) => {
    if(gridHeight < initialState.gridHeight){
      gridHeight = initialState.gridHeight
    }
    if(gridWidth < initialState.gridWidth){
      gridWidth = initialState.gridWidth
    }
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
