import moment from 'moment'
import _ from 'lodash'

export const COLUMNS= [
  {
    Header: 'Id',
    Footer: 'Id',
    accessor: 'id',
    disableFilters: true,
    disableSortBy: true,
    sticky: 'left'
  },
  {
    Header: 'Name',
    Footer: 'name',
    accessor: 'product_name',
    sticky: 'left',
    Cell: (row)=>{
      // console.log(row.cell.row.original.id)
      return _.startCase(row.cell.value)+" (ID: "+row.cell.row.original.id+")"
    }
  },
  {
    Header: 'Winning Number',
    Footer: 'Winning Number',
    accessor: 'winnning_number',
    Cell:(row)=>{
        return row.cell.value=== null?"-":row.cell.value ;
    },
    sticky: 'left'
  },
  {
    Header: 'End Time',
    Footer: 'end_time',
    accessor: 'end_time',
    sticky: 'left',
    Cell:(row)=>{
      let val = row.cell.value;
      return (moment(val).clone().tz('UTC')).format("YY-MM-DD")+" ("+((moment(val).clone().tz('UTC')).format("HH")==21?'NIGHT':'DAY') + ")"
    },
    sortType:(a,b) => {
        console.log(a.values.end_time);
        return new moment(a.values.end_time) - new moment(b.values.end_time)
    }
  },
  {
    Header: 'Status',
    Footer: 'Status',
    accessor: (data)=>{
      if(data.status === "OPEN_LIVE"){
        return "Open Live"
      }else if(data.status === "OPEN_NOT_LIVE"){
        return "Open Not Live"
      }else if(data.status === "NO_WINNER_WINNER_NOTIFIED"){
        return "WinNum Posted"
      }else if(data.status === "WAITING_FOR_DRAW"){
        return "Wait For DRAW"
      }
    },
    sticky: 'left'
  },
]