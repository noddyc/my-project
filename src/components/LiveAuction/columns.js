import moment from 'moment'

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
    sticky: 'left'
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
    Header: 'Closing Time',
    Footer: 'closing_time',
    accessor: 'end_time',
    sticky: 'left',
    Cell:(row)=>{
      return (moment(row.cell.value).clone().tz('UTC')).format("YYYY-MM-DD HH:mm:ss")
      // return moment(row.cell.value).format("YYYY/MM/DD-HH:MM:SS")
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
