import React, {useState, useEffect, useMemo} from 'react'
import { GridList, GridListTile, Icon, IconButton, TextField, Button, Dialog, DialogTitle, DialogActions } from '@material-ui/core'
import {useGamePanelStyles, useSettingsStyles} from './Style'
import MineIcon from './assets/mine.png'

interface IGamePanel {
  gridHeight:number,
  gridWidth:number,
  gridMines:number,
  saveSettings: (values: {gridWidth: number, gridHeight: number}) => void
}
 
interface ICellData {
  colIndex:number
  rowIndex:number
  neighbours?:number
  showMine?:boolean
  show?:boolean
}
const GAME_STATUS = {
  START: 'START',
  IN_PROGRESS: 'IN_PROGRESS',
  END:'END'
} 
const GAME_RESULT = {
  WIN: 'WIN',
  LOS: 'LOS'
}

 const findNeighbours = (rowData:ICellData[][],{rowIndex, colIndex}:any) => {
    let neighbours = 0
    let i = rowIndex - 1
    while(i <= rowIndex+1){
      let j = colIndex - 1      
      while(j <= colIndex+1){
        const showMine = (rowData[i] && rowData[i][j] && rowData[i][j].showMine) ? rowData[i][j].showMine : false
        if(!(colIndex === j && rowIndex === i) && showMine){
          neighbours++
        }
        j++
      }
      i++
    }
    return neighbours
 }

 const initializedGrid = ({gridHeight, gridWidth, gridMines}:IGamePanel) => {
    const rowData:ICellData[][] = [];    
    for (let i = 0; i < gridHeight; i++) {
        const cellData:ICellData[] = []
        for (let j = 0; j < gridWidth; j++) {
          cellData.push({
            rowIndex: i,
            colIndex: j,
            neighbours:0,
            showMine:false,
            show:false
          })
        }
        rowData.push(cellData)
    }
    let  i = 0;
    while (i < gridMines) {
        const x = Math.floor((Math.random() * 1000) + 1) % gridHeight
        const y = Math.floor((Math.random() * 1000) + 1) % gridWidth
        rowData[x][y].showMine = true;
        i++
    }
    return rowData.map((row:ICellData[]) => {
        return row.map((cell:ICellData) => ({...cell, neighbours:findNeighbours(rowData,cell)}))
    })
 }

export const SettingForm:React.FC<IGamePanel> = ({gridHeight, gridWidth, saveSettings}) => {
  const classes = useSettingsStyles()
  const [values, setValues] = useState({gridHeight, gridWidth})
  const onChange = (event:any) =>{
    const {name, value} = event.target
    setValues(old => ({...old, [name]: Number(value)}))
  }
  const InputProps = { inputProps: { min: 6, max: 20 }, onChange }
  return (
    <div className={classes.settings}>
        <span>Grid Dimensions</span>
        <form>                
          <TextField 
            variant="outlined"
            size="small" 
            id="gridWidth"
            name="gridWidth" 
            label="Row" 
            type = 'number'   
            value={values.gridWidth}
            InputProps={InputProps}               
          />
          <TextField 
            variant="outlined"
            size="small" 
            id="gridHeight" 
            name="gridHeight" 
            label="Column" 
            type = 'number'
            value={values.gridHeight}
            InputProps={InputProps}
            classes={{root:classes.textField}}
          />
          <Button variant="contained" size="small" color="primary" onClick={() => saveSettings(values)} >
            Save
          </Button>
        </form>        
    </div>
  )
}  

export const  GamePanel:React.FC<IGamePanel> = (props) => {  
    
    const [gridData, setGridData] = useState<ICellData[][]>([])
    const [status, setGameStatus] = useState(GAME_STATUS.START)
    const [result, setGameResult] = useState('')
    const [showSettings, toggleShowSettings] = useState(false)
    const classes = useGamePanelStyles()   
    const propsData = useMemo(() => props, [props])

    const resetGame = () => {
      setGridData(initializedGrid(props))
      setGameResult('')
      setGameStatus(GAME_STATUS.START)
      toggleShowSettings(false)
    }
    
    useEffect(()=>{
      const data = initializedGrid(propsData)
      setGridData(data)
      toggleShowSettings(false)
    },[propsData, setGridData, toggleShowSettings])

    const showEmptyCells = ({rowIndex, colIndex, showMine, neighbours}:ICellData) => {
      const data:any = [...gridData]      
      const traverseGrid = (isReverse?:boolean) => {
          let rowCount = 0
          let x = rowIndex
          while(0 <= x && rowCount < 1 && x < data.length){ 
            if(data[x] && !data[x][colIndex].showMine){
              if(data[x][colIndex].neighbours > 0 ){
                rowCount++
              }
              let y = colIndex
              let count = 0
              while(0 <= y && count < 1 && y < data[x].length){
                if(data[x][y] && !data[x][y].showMine){
                  if(data[x][y].neighbours > 0 ){
                    count++
                  }
                  data[x][y].show = true
                }                  
                y++
              }
              y = colIndex
              count = 0
              while(0 <= y && count < 1 && y < data[x].length){
                if(data[x][y] && !data[x][y].showMine){
                  if(data[x][y].neighbours > 0 ){
                    count++
                  }
                  data[x][y].show = true
                }                  
                y--
              }              
            }  
            isReverse ? x-- : x++            
          }
      }
      
      traverseGrid()
      traverseGrid(true)
      setGridData(data)
    }

    const onCellClick = ({rowIndex, colIndex, showMine}:ICellData) => {
        if(showSettings){
          toggleShowSettings(false)
        }
        const data:any = [...gridData]
        if(showMine){
          setGameResult(GAME_RESULT.LOS)  
          setGameStatus(GAME_STATUS.END)        
        }else {
          if(!data[rowIndex][colIndex].neighbours){
            showEmptyCells(data[rowIndex][colIndex])
          }else{
            data[rowIndex][colIndex].show = true
          }          
          setGridData(old => (data))
          let isComplted = true
          data.forEach((ele:ICellData[]) => ele.forEach((item:ICellData) => {
              if(!item.showMine && !item.show){
                isComplted = false
              }
          }))
          if(isComplted){
            setGameStatus(GAME_STATUS.END)
            setGameResult(GAME_RESULT.WIN)
          }          
        }
    }  
    
    const showDialog = !!(result === GAME_RESULT.WIN || result === GAME_RESULT.LOS)

    return (
      <div className={classes.gridListRoot} style={{width: 34 * props.gridHeight}}>
        <div className={classes.actionBar}>
          <IconButton size="small" onClick={resetGame} title="Reset Game">
            <Icon color="primary">refresh</Icon>
          </IconButton>
          <span>Mines: {props.gridMines } | Grid: {props.gridHeight}X{props.gridWidth}</span>
          <IconButton size="small" onClick={() => toggleShowSettings(!showSettings)} title="Settings">
            <Icon color="primary">settings</Icon>
          </IconButton>
        </div> 
        {showSettings && <SettingForm {...props} />}
        
        <GridList  cellHeight={32} spacing={1} cols={props.gridHeight} >          
          {
              gridData.map((item:ICellData[]) => item.map((cell:ICellData) => {
                const isVisible = !!(cell.show || status === GAME_STATUS.END)
                return (
                  <GridListTile 
                    className={` ${classes.gridCell}`}
                    key={`row-${cell.rowIndex}:cell-${cell.colIndex}`} 
                    onClick={() => onCellClick(cell)}
                    classes={{tile: `${classes.cell} ${!isVisible ? classes.hiddenCell : ''}`}}
                  >
                      {
                        isVisible && (
                          <>
                             {cell.showMine ? <img src={MineIcon} alt="Mine"/> : <span> {cell.neighbours ? cell.neighbours : ''}</span>}
                          </>
                        )
                      }
                      
                  </GridListTile>                
                )
              }))
            }
        </GridList>
        <Dialog
            open={showDialog}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
          <DialogTitle id="alert-dialog-slide-title">
            { 
              result === GAME_RESULT.WIN 
              ? "Congratulation... You've Won The Game!!!"  
              : 'You Lost The Game. Play Again!'
            }
          </DialogTitle>
          <DialogActions>
            <Button onClick={resetGame} size="small" color="primary">
              Play Again
            </Button>
            <Button onClick={() => setGameResult('')} size="small" color="secondary">
              Close
            </Button>            
          </DialogActions>
        </Dialog>
      </div>
    );
}

export default GamePanel;
