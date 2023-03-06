import React from 'react';

function LATableLg(props) {
    return (
        <div className="flex flex-col font-inter font-light text-xl navbarSM:hidden">
                <div id="buttonNot" className="flex-row justify-center items-center self-center" style={{display : props.detail !=='false'?"none":""}}>
                    <button onClick={() => props.goToPage(0)} disabled={!props.canPreviousPage}>
                        {'<<'}
                    </button>{' '}
                    <button onClick={() => props.previousPage()} disabled={!props.canPreviousPage}>
                        Previous
                    </button>{' '}
                    <button onClick={() => {

                      // console.log("hello I clicked");
                      props.nextPage()}} disabled={!props.canNextPage}>
                        Next
                    </button>{' '}
                    <button onClick={() => props.goToPage(props.pageCount - 1)} disabled={!props.canNextPage}>
                        {'>>'}
                    </button>{' '}
                    <span>
                        Page{' '}
                        <strong>
                        {props.pageIndex + 1} of {props.pageOptions.length}
                        </strong>{' '}
                    </span>
                    <span>
                        | Go to page:{' '}
                        <input
                        className="border-2 border-inputColor"
                        type='number'
                        defaultValue={props.pageIndex + 1}
                        onChange={e => {
                            const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0
                            props.goToPage(pageNumber)
                        }}
                        style={{ width: '50px' }}
                        />
                    </span>{' '}
                    <select
                        value={props.pageSize}
                        onChange={e => props.setPageSize(Number(e.target.value))}>
                        {[10, 25, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                        ))}
                    </select>
                </div>
                <table {...props.getTableProps() }
                   className="flex flex-col items-start w-11/12 mt-8">
                  <thead className="">
                    {props.headerGroups.map(headerGroup => (
                      <tr {...headerGroup.getHeaderGroupProps()}
                      className="">
                        {headerGroup.headers.map(column => (
                          <th className="max-w-[200px] min-w-[200px] border p-2 border-solid max-h-10 min-h-10 " 
                        
                          {...column.getHeaderProps(column.getSortByToggleProps())}>
                              {column.render('Header')} 
                              <span>
                              {column.isSorted
                                ? column.isSortedDesc
                                  ? <i className="material-icons" style={{display:"inline", fontSize:"0.75rem"}}>arrow_downward</i>
                                  : <i className="material-icons" style={{display:"inline", fontSize:"0.75rem"}}>arrow_upward</i>
                                : ''}
                              </span>
                              </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody className="" {...props.getTableBodyProps()}>
                    {props.page.map((row,index) => {
                      props.prepareRow(row)
                      return (
                        <tr {...row.getRowProps()}>
                          {row.cells.map(cell => {
                            return <td className={`max-w-[200px] min-w-[200px] max-h-[30px] min-h-[30px] border p-2 border-solid ${index%2===0?"":"bg-yellow-100"}`}
                             {...cell.getCellProps()}><div className="max-w-[200px] min-w-[200px] max-h-[30px] min-h-[30px] overflow-scroll break-normal">{cell.render('Cell')}</div>
                            </td>
                          })}
                          <td className={`max-w-[200px] min-w-[200px] max-h-[30px] min-h-[30px] border p-2 border-solid ${index%2===0?"":"bg-yellow-100"}`}>
                            <div className="max-w-[200px] min-w-[200px] max-h-[30px] min-h-[30px] overflow-scroll break-normal">
                            <button style={{textDecoration:"underline", marginLeft:'1rem'}} onClick={() => {
                                props.setInd(row);
                                props.setIsOpen(true);
                              }}>detail</button>
                              </div></td>
                                            </tr>
                                          )
                                        })}
                                      </tbody>
                                    </table>
                        </div>
    );
}

export default LATableLg;