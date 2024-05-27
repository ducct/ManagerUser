import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { deleteUser } from '../services/UserService';
import { toast } from 'react-toastify';

const ModalAddNew = (props) => {
    const {show, handleClose, dataUserDelete, handleDeleteUserFromModal} = props
   
    const confirmDelete = async () => {
        let res = await deleteUser(dataUserDelete.id)
        if(res && +res.statusCode === 204) {
            toast.success("Delete user succeed!")
            handleClose()
            handleDeleteUserFromModal(dataUserDelete)
        } else {
            toast.error("error delete user")
        }
    }

    return (
        <>
            <Modal
             show={show} 
             onHide={handleClose}
             backdrop="static"
             keyboard={false}
            >
                <Modal.Header closeButton>
                <Modal.Title>Delete a user</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='body-add-new'>
                        <h6>Are you sure to delete this user?</h6>
                        <br />
                        <b>Email = {dataUserDelete.email}</b>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={() => confirmDelete()}>
                    Confirm
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ModalAddNew