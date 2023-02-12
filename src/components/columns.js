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
    Header: 'Auctioneer',
    Footer: 'auctioneer',
    accessor: 'ownerId',
    sticky: 'left'
  },
  {
    Header: 'Closing Time',
    Footer: 'closing_time',
    accessor: 'end_time',
    sticky: 'left',
    Cell:(row)=>{
      return moment(row.cell.value).format("YYYY/MM/DD-HH:MM:SS")
    },
    
    sortType:(a,b) => {
        console.log(a.values.closing_time);
        return new moment(a.values.closing_time) - new moment(b.values.closing_time)
    }
  },
  {
    Header: 'Price',
    Footer: 'price',
    accessor: 'product_price',
    sticky: 'left'
  },
]
