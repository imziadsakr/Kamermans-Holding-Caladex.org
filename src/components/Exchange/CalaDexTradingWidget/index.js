

import React, { useEffect, useState, useRef  } from 'react' ;

import { useMeasure } from "react-use";


import PropTypes from 'prop-types' ;
import dayjs from 'dayjs';

import ReactApexChart from 'react-apexcharts' ;

import { makeStyles } from '@mui/styles';

import {
    Box ,
    Grid,
    CircularProgress,
    useMediaQuery
} from '@mui/material' ;

import { connect } from 'react-redux';

import { GetTradingViewData } from '../../../redux/actions/tradingview';

const useStyles = makeStyles((theme) => ({
    root : {
        "& .MuiButtonBase-root" : {
            fontSize : "12px"
        },
        borderRadius : "5px" ,
        border : "1px solid lightgray" ,
        
        "& .apexcharts-toolbar" : {
            visibility : "visible" ,
        } ,
        "& .apexcharts-xaxistooltip" :{
          display : 'flex',
          alignItems : 'center',
          justifyContent : 'center',

          border : 'none' ,
          backgroundColor : 'black',
          color : 'white',
          height : 30,
          padding : 0,
        },
        "& .apexcharts-xaxistooltip-bottom::before" :{
          backgroundColor : 'white',
          visibility : 'hidden'
        },
        "& .apexcharts-xaxistooltip-bottom::after" : {
          backgroundColor : 'white',
          visibility : 'hidden'
        }, 

        "& .apexcharts-yaxistooltip" :{
          display : 'flex',
          alignItems : 'center',
          justifyContent : 'flex-start',

          paddingLeft : '5px',
          paddingRight : '5px',
          border : 'none' ,
          backgroundColor : 'black',
          color : 'white',
          height : 30,
          padding : 0,
        },
        "& .apexcharts-yaxistooltip-right::before" :{
          backgroundColor : 'white',
          visibility : 'hidden'
        },
        "& .apexcharts-yaxistooltip-right::after" : {
          backgroundColor : 'white',
          visibility : 'hidden'
        }, 

        height : "calc(50vh - 48px)" ,
        minHeight : "calc(50vh - 48px)",
        position : 'relative'
    },
    price : {
      position : 'absolute'
    }
}));
const CalaDexTradingWidget = (props) => {

    const classes = useStyles() ;

    const [ currentPriceData, setCurrentPriceData ] = useState(null) ;

    const { GetTradingViewData, tradingViewData, tokenPairList,
            tokenId } = props;

    const series = [{
        name: 'candle',
        data: tradingViewData ? tradingViewData : []
    }] ;
    const options = {
      chart: {
        type: 'candlestick',
      },
      legend : {
        show :true
      },
      title: {
        text: 'CAX / DAI',
        align: 'left',
      },
      xaxis: {
        type: 'datetime',
        labels : {
          show: true,
          rotate: -45,
          style: {
            colors: [],
            fontSize: '12px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 400,
            cssClass: 'apexcharts-xaxis-label',
          },
        },
        tooltip: {
          enabled: true,
          formatter: (val) => { return new Date(val).toDateString() + " " + new Date(val).toLocaleTimeString()},
        },
      },
      yaxis: {
        opposite : true,
        tooltip: {
          enabled: true,
          formatter: (val) => { return Number(val).toFixed(8) },
        },
        labels: {
          show: true,
          align: 'right',
          minWidth: 0,
          maxWidth: 160,
          style: {
              colors: [],
              fontSize: '12px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 400,
              cssClass: 'apexcharts-yaxis-label',
          },
          offsetX: 0,
          offsetY: 0,
          rotate: 0,
          formatter: (val) => { return Number(val).toFixed(8) },
        },
        axisBorder: {
            show: true,
            color: '#78909C',
            offsetX: 0,
            offsetY: 0
        },
        axisTicks: {
            show: true,
            borderType: 'solid',
            color: '#78909C',
            width: 6,
            offsetX: 0,
            offsetY: 0
        },
      },
      tooltip : {
        enabled : true,
        custom: function({series, seriesIndex, dataPointIndex, w}) {
          return null
        }
      },
      chart: {
        events: {
          mouseMove: function(event, chartContext, config) {
            // The last parameter config contains additional information like `seriesIndex` and `dataPointIndex` for cartesian charts.
            // console.log(config);
            // if(config.dataPointIndex !== -1) setCurrentPriceData(series[config.seriesIndex].data[config.dataPointIndex].y) ;
          }
        }
      }
    } ;
    
    const viewCtrl = useRef() ;

    const [setRef, { width, height }] = useMeasure();

    useEffect(() => {
        setRef(viewCtrl.current);
    }, []);

    useEffect(() => {
      if(tokenPairList.length > 0) {
        GetTradingViewData(tokenPairList[tokenId?tokenId:0]._id, tokenPairList[tokenId?tokenId:0].pair_type);
      }
    }, [tokenPairList]);

    return (
        <Box className={classes.root} ref={viewCtrl}>
            <ReactApexChart options={options} series={series} type="candlestick" height={height} width={width}/>
            <Box className={classes.price}>

            </Box>
        </Box>
    )
}

CalaDexTradingWidget.propsType = {
  tradingViewData : PropTypes.array.isRequired,
  tokenPairList : PropTypes.array.isRequired
}
const mapStateToProps = state => ({
  tradingViewData : state.tradingview.trading_view_data,
  tokenPairList : state.token.tokenPairList
}) ;
const mapDispatchToProps = {
  GetTradingViewData
}

export default connect(mapStateToProps , mapDispatchToProps)(CalaDexTradingWidget) ;