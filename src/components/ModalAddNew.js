import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {postCreateUser} from '../services/UserService'
import { toast } from 'react-toastify';

const ModalAddNew = (props) => {
    const {show, handleClose, handleUpdateTable} = props
    const [name, setName] = useState("")
    const [job, setJob] = useState("")

    const handleSave = async () => {
        let res = await postCreateUser(name, job)
        if(res && res.id) {
            handleClose()
            setName('')
            setJob('')
            toast.success("A User is created succeed!")
            handleUpdateTable({first_name: name, id: res.id})
        } else {
            toast.error("An error!")
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
                <Modal.Title>Add new user</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='body-add-new'>
                        <div className="form-group">
                            <label >Name</label>
                            <input
                                type="text" 
                                className="form-control" 
                                placeholder='Enter your name' 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            
                        </div>
                        <div className="form-group">
                            <label className='form-label'>Job</label>
                            <input
                                type="text" 
                                className="form-control" 
                                placeholder='Enter your job'
                                value={job}
                                onChange={(e) => setJob(e.target.value)}
                            />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={() => handleSave()}>
                    Save Changes
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ModalAddNew