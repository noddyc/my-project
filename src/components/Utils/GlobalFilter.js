import React, { Fragment, useState } from 'react'
import { useAsyncDebounce } from 'react-table'

export const GlobalFilter = ({ filter, setFilter }) => {
  const [value, setValue] = useState(filter)
  const onChange = useAsyncDebounce(value => {
    setFilter(value || undefined)
  }, 1000)
  return (
    <Fragment>
          <label className="label">Search:{'\u00A0'}</label>
          <input
            className="input" placeholder='Enter keyword'
            value={value || ''}
            onChange={e => {
              setValue(e.target.value);
              onChange(e.target.value);
         }}
       />
    </Fragment>
  )
}