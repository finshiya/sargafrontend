import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col } from 'react-bootstrap';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css';
import '../style/addmodel.css';

function App() {
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const apiUrl = 'http://localhost:3000/userroles';

    axios.get(apiUrl)
      .then(response => {
        setData(response.data.userRole);
        console.log(response.data.userRole);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleClose = () => {
    setShow(false);
    formik.resetForm();
  };

  const handleShow = () => setShow(true);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validationSchema = Yup.object({
    fname: Yup.string().required('First name is required'),
    lname: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
    mobile: Yup.string().required('Mobile is required'),
    userRoles: Yup.string().required('User roles are required'),
  });

  const formik = useFormik({
    initialValues: {
      fname: '',
      lname: '',
      email: '',
      password: '',
      confirmPassword: '',
      mobile: '',
      userRoles: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await validationSchema.validate(values, { abortEarly: false });

        const response = await axios.post('http://localhost:3000/users', values);
        console.log('Response:', response.data.user);

        // Show toast message
        toast.success('Data successfully added', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
          className: "toast-message",
        });

        handleClose();
        // window.location.reload();
      } catch (error) {
        if (error.response) {
          console.log('Error Response:', error.response.data);
          console.log('Status Code:', error.response.status);
        } else if (error.request) {
          console.log('No response received from the server.');
        } else {
          console.log('Error:', error.message);
        }
      }
    },
  });

  return (
    <>
      <ToastContainer autoClose={50000} />
      <Button style={{ background: '#5bb6ea', border: 'none', color: 'white', fontWeight: '600' }} onClick={handleShow}>
        + New
      </Button>

      <Modal className='modal-box' show={show} onHide={handleClose} aria-labelledby="contained-modal-title-vcenter" centered backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '17px' }}>Add My Team</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Form onSubmit={formik.handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3 floating-label-group" controlId="fname" >
                    <Form.Control
                      type="text"
                      name="fname"
                      placeholder=" "
                      value={formik.values.fname}
                      onChange={formik.handleChange}
                      onBlur={() => formik.setFieldTouched('fname', true)}
                      onFocus={() => formik.setFieldTouched('fname', false)} // Reset touch state on focus
                      className={(formik.touched.fname && formik.errors.fname) ? 'error-border' : ''}
                    />
                    <Form.Label className={formik.touched.fname || formik.values.fname ? 'floating' : ''} style={{ color: formik.touched.fname && formik.errors.fname ? 'red' : '#5bb6ea !importend' }}>First Name</Form.Label>
                    {formik.touched.fname && formik.errors.fname ? (
                      <div className="error">
                        {formik.errors.fname}
                      </div>
                    ) : null}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group  className="mb-3 floating-label-group" controlId="lname">
                    <Form.Control 
                      type="text"
                      placeholder=" "
                      name="lname"
                      value={formik.values.lname}
                      onChange={formik.handleChange}
                      onBlur={() => formik.setFieldTouched('lname', true)}
                      onFocus={() => formik.setFieldTouched('lname', false)} 
                      className={(formik.touched.lname && formik.errors.lname) ? 'error-border' : ''}
                    />
                      <Form.Label className={formik.touched.lname || formik.values.lname ? 'floating' : ''} style={{ color: formik.touched.lname && formik.errors.lname ? 'red' : '#5bb6ea  !importend' }}>Last Name</Form.Label>
                    {formik.touched.lname && formik.errors.lname ? (
                      <div className="error">
                        {formik.errors.lname}
                      </div>
                    ) : null}
                  </Form.Group>
                </Col>


                <Col md={6}>
                  <Form.Group  className="mb-3 floating-label-group" controlId="email">
                    <Form.Control
                      type="email"
                      placeholder=" "
                      name="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={() => formik.setFieldTouched('email', true)}
                      onFocus={() => formik.setFieldTouched('email', false)} 
                      className={(formik.touched.email && formik.errors.email) ? 'error-border' : ''}
                    />
                      <Form.Label className={formik.touched.email || formik.values.email ? 'floating' : ''} style={{ color: formik.touched.email && formik.errors.email ? 'red' : '#5bb6ea  !importend' }}>Email</Form.Label>
                    {formik.touched.email && formik.errors.email ? (
                      <div className="error">
                        {formik.errors.email}
                      </div>
                    ) : null}
                  </Form.Group>
                </Col>


                <Col md={6}>
                  <Form.Group  className="mb-3 floating-label-group" controlId="mobile">
                    <Form.Control 
                      type="text"
                      placeholder=" "
                      name="mobile"
                      value={formik.values.mobile}
                      onChange={formik.handleChange}
                      onBlur={() => formik.setFieldTouched('mobile', true)}
                      onFocus={() => formik.setFieldTouched('mobile', false)} 
                      className={(formik.touched.mobile && formik.errors.mobile) ? 'error-border' : ''}
                    />
                      <Form.Label className={formik.touched.mobile || formik.values.mobile ? 'floating' : ''} style={{ color: formik.touched.mobile && formik.errors.mobile ? 'red' : '#5bb6ea  !importend' }}>Mobile</Form.Label>
                    {formik.touched.mobile && formik.errors.mobile ? (
                      <div className="error">
                        {formik.errors.mobile}
                      </div>
                    ) : null}
                  </Form.Group>
                </Col>

                <Col md={6}>
  <Form.Group className="mb-3 floating-label-group" controlId="password">
      <Form.Control
        type={showPassword ? 'text' : 'password'}
        name="password"
        placeholder=''
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={() => formik.setFieldTouched('password', true)}
        onFocus={() => formik.setFieldTouched('password', false)}
        className={(formik.touched.password && formik.errors.password) ? 'error-border' : ''}
      />
      <Form.Label
        className={formik.touched.password || formik.values.password ? 'floating' : ''}
        style={{color: formik.touched.password && formik.errors.password ? 'red' : '#5bb6ea !importend' }}
      >
        Password
      </Form.Label>
      <div className="input-group-append">
        <div className="password-toggle-icon input-group-text" onClick={togglePasswordVisibility}>
          {showPassword ? <BsEyeSlash /> : <BsEye />}
        </div>
      </div>
    {formik.touched.password && formik.errors.password ? (
      <div className="error">
        {formik.errors.password}
      </div>
    ) : null}
  </Form.Group>
</Col>

                <Col md={6}>
                  <Form.Group  className="mb-3 floating-label-group" controlId="confirmPassword">
                    <Form.Control
                      type="password"
                      placeholder=" "
                      name="confirmPassword"
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                      onBlur={() => formik.setFieldTouched('confirmPassword', true)}
                      onFocus={() => formik.setFieldTouched('confirmPassword', false)} 
                      className={(formik.touched.confirmPassword && formik.errors.confirmPassword) ? 'error-border' : ''}
                    />
                     <Form.Label className={formik.touched.confirmPassword || formik.values.confirmPassword ? 'floating' : ''} style={{color: formik.touched.confirmPassword && formik.errors.confirmPassword ? 'red' : '#5bb6ea !importend' }}>Confirm Password</Form.Label>
                    {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                      <div className="error" >
                        {formik.errors.confirmPassword}
                      </div>
                    ) : null}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group  className="mb-3 input-box" controlId="userRoles">
                    <Form.Select className='input-controll'
                      name="userRoles"
                      value={formik.values.userRoles}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                       <Form.Label className='label' style={{ fontSize: '14px' }}>User Roles</Form.Label>
                      <option value="" label="Select a role" style={{color:'black'}} />
                      {data.map(item => (
                        <option key={item.id} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </Form.Select>
                    {formik.touched.userRoles && formik.errors.userRoles ? (
                      <div className="error">
                        {formik.errors.userRoles}
                      </div>
                    ) : null}
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Container>
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



export default App;