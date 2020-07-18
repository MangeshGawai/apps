import { makeStyles } from '@material-ui/core'
import {cyan} from '@material-ui/core/colors'

export const useGamePanelStyles = makeStyles((theme) => ({
  gridListRoot: {
    padding:4,
    background:cyan[900]
  },
  gridCell: {    
    justifyContent: 'center',
    cursor: 'pointer',
    '& img':{
      width:24,
      marginTop:-8
    }
  },
  cell:{
    background:cyan[400],
    borderRadius:2,
    display:'flex',
    alignItems:'center',
    justifyContent: 'center'
  },
  hiddenCell:{
    background:cyan[700]
  },
  actionBar: {
    '& span' : {
        color: theme.palette.common.white
    },
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: 5
  }  
}));


export const useAppStyles = makeStyles((theme) => ({
  gameContainer : {
    width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
  }
}));

export const useSettingsStyles = makeStyles((theme) => ({
  settings:{
    background:theme.palette.common.white,
    padding:5,
    marginBottom:5,
    borderRadius:5,
    '& form':{
      display: 'flex',
      justifyContent: 'space-between',
      paddingTop:5
    }
  },
  textField:{
    minWidth:100
  }
}));