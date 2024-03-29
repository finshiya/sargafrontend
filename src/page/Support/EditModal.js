



// EditModal.js
import React,{useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import '../style/edit.css';
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditModal({ showModal, handleClose, selectedDatas, handleUpdate }) {
  
  const [isDeleted, setIsDeleted] = useState(false);
  const [supportType, setSupportType] = useState([]);
  const [supportTo,setSupportTo] =useState([]);


  
  const capitalizeFirstLetter = (value) => {
    return value
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  useEffect(()=>{

  fetchSupportTo();
  fetchSupportType();
  },[])
  
  const fetchSupportType = async () => {
    try {
      const response = await axios.get('http://localhost:3000/supportType');
      const filteredSupportType = response.data.supportType.filter(type => !type.isDeleted) 
        .sort((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        if (nameA < nameB) return -1; // Sort in alphabetical ascending order
        if (nameA > nameB) return 1;
        return 0;
      });;
      setSupportType(filteredSupportType);
      console.log(filteredSupportType);
    } catch (error) {
      console.error(error);
    }
  };
  
    const fetchSupportTo = async () => {
      try {
        const response = await axios.get('http://localhost:3000/users');
        const filteredUser = response.data.users.filter(to => !to.isDeleted) 
         .sort((a, b) => {
          const nameA = a.fname.toUpperCase();
          const nameB = b.fname.toUpperCase();
          if (nameA < nameB) return -1; // Sort in alphabetical ascending order
          if (nameA > nameB) return 1;
          return 0;
        });;
        setSupportTo(filteredUser);
        console.log(filteredUser);
      } catch (error) {
        console.error(error);
      }
    };


    const supportToSchema = Yup.string().required('Support To is required');
    const supportTypeSchema = Yup.string().required('Support Type is required');
    const statusSchema = Yup.string().required('Status is required');
    const remarksSchema = Yup.string().required('Remarks is required');
  
    // Combine the field validation schemas using Yup.object().shape
    const validationSchema = Yup.object().shape({
      supportTo: Yup.lazy((value) => (value && value.trim() !== '' ? supportToSchema : Yup.string())),
      supportType: Yup.lazy((value) => (value && value.trim() !== '' ? supportTypeSchema : Yup.string())),
      status: Yup.lazy((value) => (value && value.trim() !== '' ? statusSchema : Yup.string())),
      remarks:remarksSchema,
    });
  

  
  // Formik form configuration
  const formik = useFormik({
    initialValues: {
      supportTo: selectedDatas?.supportTo || '',
      supportType: selectedDatas?.supportType || '',
      status: selectedDatas?.status || '',
      remarks: selectedDatas?.remarks || ''

    },
   
  validationSchema: validationSchema,
    onSubmit: (values) => {
      handleUpdate(selectedDatas?._id, values);
      handleClose();
    },
  });
  const handleModalHide = () => {
    formik.resetForm();
    handleClose();
  };

  useEffect(() => {
    console.log("selectedDatas:", selectedDatas);
    formik.setValues({
      supportTo: selectedDatas?.supportTo?._id || '', 
      supportType: selectedDatas?.supportType?._id || '',
      status: selectedDatas?.status || '',
      remarks: selectedDatas?.remarks || '',
    });
  }, [selectedDatas]);
  

  return (
    <>
    <ToastContainer autoClose={2000}/>
    <Modal show={showModal} onHide={handleModalHide} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Support Enquiry</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form onSubmit={formik.handleSubmit}>
          <Row>
          <Col md={6}>
          <Form.Group className="mb-3" controlId="supportTo">
          <Form.Label style={{ fontSize: '14px' }}>Support To</Form.Label>
           <Form.Control
             as="select"
             name="supportTo"
             value={formik.values.supportTo}
             onChange={formik.handleChange}
             onBlur={formik.handleBlur}
             className={`form-select`}
           >
             <option value="" disabled>
               Support To
             </option>
             {supportTo.map(to => (
               <option key={to._id} value={to._id}>
                   { capitalizeFirstLetter (`${to.fname} ${to.lname}`)}
               </option>
             ))}
           </Form.Control>
           {formik.touched.supportTo && formik.errors.supportTo ? (
                <div className="error" style={{color:'red'}}>{formik.errors.supportTo}</div>
              ) : null}
         </Form.Group>
         </Col>
         
         <Col md={6}>
      <Form.Group className="mb-3" controlId="supportType">
      <Form.Label style={{ fontSize: '14px' }}>Support Type</Form.Label>
           <Form.Control
             as="select"
             name="supportType"
             value={formik.values.supportType}
             onChange={formik.handleChange}
             onBlur={formik.handleBlur}
             className={`form-select`}
           >
             <option value="" disabled>
               Support Type
             </option>
             {supportType.map(support => (
               <option key={support._id} value={support._id}>
                  {capitalizeFirstLetter (support.name)}
               </option>
             ))}
           </Form.Control>
           {formik.touched.supportType && formik.errors.supportType ? (
                <div className="error" style={{color:'red'}}>{formik.errors.supportType}</div>
              ) : null}
         </Form.Group>
         </Col>
        

         <Form.Group className="mb-3" controlId="remarks">
         <Form.Label style={{ fontSize: '14px' }}>Remarks</Form.Label>
           <Form.Control
             as="textarea"
             placeholder="Remarks"
             name="remarks"
             value={capitalizeFirstLetter (formik.values.remarks)}
             onChange={formik.handleChange}
             onBlur={formik.handleBlur}
           />
            {formik.touched.remarks && formik.errors.remarks ? (
                <div className="error" style={{color:'red'}}>{formik.errors.remarks}</div>
              ) : null}
         </Form.Group>
         </Row>
      </Form>
      </Modal.Body>
      <Modal.Footer>
          <Button style={{ background: 'none', color: '#5bb6ea', border: '1px solid #5bb6ea' }} onClick={handleClose}>
            Close
          </Button>
          <Button style={{ background: '#5bb6ea', border: 'none', fontWeight: '600' }} onClick={formik.submitForm}>
            Submit
          </Button>
        </Modal.Footer>

    </Modal>
    </>
  );
}

export default EditModal;