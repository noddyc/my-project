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
    Header: 'Winning Number',
    Footer: 'Winning Number',
    accessor: 'winning_number',
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