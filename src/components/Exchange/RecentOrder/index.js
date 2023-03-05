


import React from 'react' ;

import { useState } from 'react' ;

import RecentSelectBox from './RecentSelectBox' ;
import RecentOrderList from './RecentOrderList' ;
import OrderHistory from './OrderHistory';
import Funds from './Funds' ;

import {
    Box,
    Grid
} from '@mui/material' ;

import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
    root : {
        maxHeight : "calc(50vh - 115px)" ,
        height : "calc(50vh - 115px)" ,
    }
}));

const RecentOrder = (props) => {

    const classes = useStyles() ;

    const [ historyIndex, setHistoryIndex ] = useState(0) ;

    const handleHistoryIndex = (index) => {
        setHistoryIndex(index) ;
    }
    const {
        tradeToken
    } = props ;

    return (
        <Box component={"div"} className={classes.root}>
            <Grid container>
                <Grid item xs={12}>
                    <RecentSelectBox 
                        handleHistoryIndex={handleHistoryIndex}
                        historyIndex={historyIndex}
                    />
                </Grid>
                <Grid item xs={12}>
                    {
                        historyIndex === 0 && <RecentOrderList 
                        tradeToken={tradeToken}
                    />
                    }

                    {
                        historyIndex === 1 && <OrderHistory 
                            tradeToken={tradeToken}
                        />
                    }
                    {
                        historyIndex === 2 && <Funds 
                            tradeToken={tradeToken}
                        />
                    }
                    
                </Grid>
            </Grid>
        </Box>
    )
}

export default RecentOrder ;