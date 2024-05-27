
import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { fetchAllUser } from '../services/UserService';
import ReactPaginate from 'react-paginate';
import ModalAddNew from './ModalAddNew';
import ModalEditUser from './ModalEditUser';
import ModalConfirm from './ModalConfirm'
import './TableUser.scss'

import _, { debounce } from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown, faArrowUp, faCirclePlus, faFileArrowDown, faFileExport, faFileImport } from '@fortawesome/free-solid-svg-icons';
import { CSVLink, CSVDownload } from 'react-csv';
import Papa from "papaparse"
import { toast } from 'react-toastify';

const TableUsers = (props) => {

    const [listUsers, setListUsers] = useState([])
    const [totalUsers, setTotalUsers] = useState(0) 
    const [totalPages, setTotalPages] = useState(0)
    
    const [isShowModalAddNew, setIsShowModalAddNew] = useState(false)

    const [isShowModalEdit, setIsShowModalEdit] = useState(false)
    const [dataUserEdit, setDataUserEdit] = useState({})

    const [isShowModalDelete, setIsShowModalDelete] = useState(false)
    const [dataUserDelete, setDataUserDelete] = useState([])

    const [sortBy, setSortBy] = useState("")
    const [sortField, setSortField] = useState("")

    const [keyWord, setKeyWord] = useState("")

    const [dataExport, setDataExport] = useState([])

    const handleUpdateTable = (user) => {
        setListUsers([user, ...listUsers])
    }

    const handleEditUserFromModal = (user) => {
        let cloneLisUsers = _.cloneDeep(listUsers)
        let index = listUsers.findIndex(item => item.id === user.id)
        cloneLisUsers[index].first_name = user.first_name
        setListUsers(cloneLisUsers)
        
    }

    const handleClose = () => {
        setIsShowModalAddNew(false)
        setIsShowModalEdit(false)
        setIsShowModalDelete(false)
    }

    useEffect(() => {
        getUsers(1)
    }, [])

    const getUsers = async (page) => {
        let res = await fetchAllUser(page)
        if(res && res.data) {
            setTotalUsers(res.total)
            setListUsers(res.data)
            setTotalPages(res.total_pages)
        }

    }

    const handlePageClick = (event) => {
        getUsers(+event.selected + 1)
    }

    const handleEditUser = (user) => {
        setDataUserEdit(user)
        setIsShowModalEdit(true)
    }

    const handleDeleteUser = (user) => {
        setIsShowModalDelete(true)
        setDataUserDelete(user)
    }

    const handleDeleteUserFromModal = (user) => {
        let cloneLisUsers = _.cloneDeep(listUsers)
        cloneLisUsers = cloneLisUsers.filter(item => item.id !== user.id)
        setListUsers(cloneLisUsers)
    }

    const handleSort = (sortBy, sortField) => {
        setSortBy(sortBy)
        setSortField(sortField)

        let cloneLisUsers = _.cloneDeep(listUsers)
        cloneLisUsers = _.orderBy(cloneLisUsers, [sortField], [sortBy])
        setListUsers(cloneLisUsers)
    }

    const handleSearch = debounce((event) => {
        let term = event.target.value
        if(term) {
            let cloneLisUsers = _.cloneDeep(listUsers)
            cloneLisUsers = cloneLisUsers.filter(item => item.email.includes(term))
            setListUsers(cloneLisUsers)
        } else {
            getUsers(1)
        }
    }, 300)

    //export dùng thư viện react csv
   const getUsersExport = (event, done) => {
    let result = []
    if(listUsers && listUsers.length > 0 ) {
        result.push(["Id", "Email", "First name", "Last name"])
        listUsers.map((item, index) => {
            let arr = []
            arr[0] = item.id
            arr[1] = item.email
            arr[2] = item.first_name
            arr[3] = item.last_name
            result.push(arr)
        })

        setDataExport(result)
        done()
    }
   }

   //import
   const handleImportCSV = (e) => {
        if(e.target && e.target.files && e.target.files[0]) {
            let file = e.target.files[0]
            if(file.type !== "text/csv") {
                toast.error("Only accept CSV files")
                return
            }

            Papa.parse(file, {
                //header: true,
                complete: function (results) {  
                    let rawCSV = results.data
                    if(rawCSV.length > 0) {
                        if(rawCSV[0] && rawCSV[0].length === 3) {
                            if(rawCSV[0][0] !== "email" || rawCSV[0][1] !== "first_name" || rawCSV[0][2] !== "last_name") {
                                toast.error("Wrong format Header csv file")
                            } else {
                                let result = []
                               rawCSV.map((item, index) => {
                                if(index > 0 && item.length === 3) {
                                    let obj = {}
                                    obj.email = item[0]
                                    obj.first_name = item[1]
                                    obj.last_name = item[2]
                                    result.push(obj)
                                }
                               })
                               setListUsers(result)
                            }
                             
                        } else {
                            toast.error("Wrong format csv file")
                        }
                    } else {
                        toast.error("Not found data on csv file")
                    }
                }
            })
            
        }  
   }

    return (
    <>
        <div className='my-3 add-new d-sm-flex'>
                <span className=''><b>List Users:</b></span>
                <div className='group-btn'>
                    <label htmlFor="import" className='btn btn-warning lable'>
                        <FontAwesomeIcon icon={faFileImport} className='me-2'/>
                        Import
                    </label>
                    <input
                        id='import' type='file' hidden
                        onChange={(e) => handleImportCSV(e)}
                     
                     />
                    <CSVLink 
                        data={dataExport}
                        filename={"users.csv"}
                        className="btn btn-primary mx-2"
                        target="_blank"
                        asyncOnClick={true}
                        onClick={getUsersExport}
                    >
                        <FontAwesomeIcon icon={faFileExport} className='me-2'/>
                        Export
                    </CSVLink>

                    <button className='btn btn-success' onClick={() => setIsShowModalAddNew(true)}>
                        <FontAwesomeIcon icon={faCirclePlus} className='me-2'/>
                        Add new
                    </button>
                </div>
        </div>
        <div className='col-sm-4 my-3'>
            <input
                className='form-control'
                placeholder='Search user by email...'
                //value={keyWord}
                onChange={(event) => handleSearch(event)}
            />
        </div>

        <div className='custom-table'>
            <Table striped bordered hover >
                <thead>
                <tr>
                    <th>
                        <div className='sort-header'>
                            <span>ID</span>
                            <span>
                                <FontAwesomeIcon icon={ faArrowDown } className='icon-down' onClick={() => handleSort("desc", "id")}/>
                                <FontAwesomeIcon icon={ faArrowUp } className='icon-down' onClick={() => handleSort("asc", "id")}/>
                            </span>
                        </div>
                        
                    </th>
                    <th>
                        Email
                    </th>
                    <th>
                        <div className='sort-header'>
                            <span >First name</span>
                            <span>
                                <FontAwesomeIcon icon={ faArrowDown } className='icon-down' onClick={() => handleSort("desc", "first_name")}/>
                                <FontAwesomeIcon icon={ faArrowUp } className='icon-down' onClick={() => handleSort("asc", "first_name")}/>
                            </span>
                        </div>
                    </th>
                    <th>Last name</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                    {listUsers && listUsers.length > 0 &&
                        listUsers.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td>{item.id}</td>
                                    <td>{item.email}</td>
                                    <td>{item.first_name}</td>
                                    <td>{item.last_name}</td>
                                    <td>
                                        <button 
                                            className='btn btn-warning mx-3'
                                            onClick={() => handleEditUser(item)}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className='btn btn-danger'
                                            onClick={() => handleDeleteUser(item)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            )
                        })
                }
            
            </tbody>
            </Table>
        </div>
        
        <ReactPaginate
            breakLabel="..."
            nextLabel="next >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={totalPages}
            previousLabel="< previous"

            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakClassName="page-item"
            breakLinkClassName="page-link"
            containerClassName="pagination"
            activeClassName="active"
        />

        <ModalAddNew 
          show = {isShowModalAddNew}
          handleClose = {handleClose}
          handleUpdateTable = {handleUpdateTable}
        />
        <ModalEditUser 
            show={isShowModalEdit}
            handleClose = {handleClose}
            dataUserEdit={dataUserEdit}
            handleEditUserFromModal = {handleEditUserFromModal}
        />

        <ModalConfirm 
            show={isShowModalDelete}
            handleClose = {handleClose}
            dataUserDelete = {dataUserDelete}
            handleDeleteUserFromModal={handleDeleteUserFromModal}
        />


    </>)

}

export default TableUsers