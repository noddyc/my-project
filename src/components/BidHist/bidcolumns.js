import moment from 'moment'
import _ from 'lodash'
import { UTCToCentral } from '../Utils/time'

export const COLUMNS = [
  {
    Header: 'Id',
    Footer: 'Id',
    accessor: 'id',
    disableFilters: true,
    disableSortBy: true,
    sticky: 'left',
    Cell: (row) =>{
      return row.cell.row.original.auctionId
    }
  },
  {
    Header: 'Name',
    Footer: 'name',
    accessor: 'product_name',
    sticky: 'left',
    Cell: (row)=>{
      console.log(row.cell.row.original)
      return _.startCase(row.cell.value)
    }
  },
  {
    Header: 'Winning Number',
    Footer: 'Winning Number',
    accessor: 'winning_number',
    sticky: 'left',
    Cell: (row)=>{
      let e  = row.cell.row.original
      return e.winNum === undefined?"-":e.winNum.specialNumber;
    }
  },
  {
    Header: 'End Time',
    Footer: 'end_time',
    accessor: 'end_time',
    sticky: 'left',
    Cell:(row)=>{
      let val = row.cell.value;
      return (UTCToCentral(val.end_time).split(' ')[0]+" "+(UTCToCentral(val.end_time).split(' ')[1]==="12:40:00"?'DAY':'NIGHT'))
    },
    sortType:(a,b) => {
        console.log(a.values.end_time);
        return new moment(a.values.end_time) - new moment(b.values.end_time)
    }
  },
  {
    Header: 'Picked Slot',
    Footer: 'Picked Slot',
    accessor: 'slot_number',
    sticky: 'left'
  },
]