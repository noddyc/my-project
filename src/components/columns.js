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
    accessor: 'name',
    sticky: 'left'
  },
  {
    Header: 'Auctioneer',
    Footer: 'auctioneer',
    accessor: 'auctioneer',
    sticky: 'left'
  },
  {
    Header: 'Closing Time',
    Footer: 'closing_time',
    accessor: 'closing_time',
    sticky: 'left',
    sortType:(a,b) => {
        console.log(a.values.closing_time);
        return new moment(a.values.closing_time) - new moment(b.values.closing_time)
    }
  },
  {
    Header: 'Price',
    Footer: 'price',
    accessor: 'price',
    sticky: 'left'
  },
]
