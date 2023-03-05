
import React , { useEffect } from 'react' ;

import {
    Box
} from '@mui/material' ;

import SearchIcon from '@mui/icons-material/Search';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
    root : {
        "& .input-group" : {
            width : '350px',
            height : '100% !important',
            ['@media (max-width : 450px)'] : {
                width : '90%',
                margin : 'auto',
            }
        },
        ['@media (max-width : 640px)'] : {
            marginTop : '10px',
            marginLeft : '10px'
        }
    }
}))
const TokenSearch = (props) => {

    const { searchForMoreTokens  , searchCtrl} = props ;

    const classes = useStyles();
    return (
        <Box className={classes.root}>
            <Box component={"div"} className='input-group'>
                <Box component={"label"} className='input-group-prepend' sx={{marginBottom : "0px"}}>
                    <Box component={"span"} className='input-group-text'>
                        <SearchIcon />
                    </Box>
                </Box>
                <Box component={"input"} type="text" className='form-control' placeholder='Search for more tokens.' sx={{height : "auto"}}  ref={searchCtrl} onKeyUp={(e) => searchForMoreTokens(e.target.value)}/>
            </Box>
        </Box>
    )
}

export default TokenSearch ;