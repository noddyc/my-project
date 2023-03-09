import moment from 'moment'
import _ from 'lodash'

export const COLUMNS = [
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
    Header: 'Host',
    Footer: 'Host',
    accessor: (data)=>{
      // console.log(user.User);
      return data.User.firstname + " " + data.User.lastname;
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
      return (moment(val).clone().tz('UTC')).format("YY-MM-DD")+" "+((moment(val).clone().tz('UTC')).format("HH")==21?'NIGHT':'DAY')
    },
    
    sortType:(a,b) => {
        console.log(a.values.closing_time);
        return new moment(a.values.end_time) - new moment(b.values.end_time)
    }
  },
  {
    Header: 'Price',
    Footer: 'price',
    accessor: (data)=>{
      return Math.round(data.product_price);
    },
    sticky: 'left'
  },
]
