import { useEffect, useState } from 'react';
import { Button, Card, Form, Input, message, Space, Table } from 'antd';
import moment from 'moment';
import { addSearchParamsToUrl, FETCH_PATIENTS_URL, flatMapPatient, getPatientSorter } from '../helpers';

function PatientList({patients, loading, setLoading}) {
  const ALPHA_PATTERN = /^[a-z0-9 ]+$/gi;
  const [myPatients, setMyPatients] = useState();
  const [form] = Form.useForm();

  useEffect(() => {
    setMyPatients(patients);
  }, [patients])

  const handleSubmit = async (evt, ...other) => {
    const firstname = form.getFieldValue('firstname');
    const lastname = form.getFieldValue('lastname');

    if (loading) { return; }
    setLoading(true);

    try {
      const response = await fetch(addSearchParamsToUrl(FETCH_PATIENTS_URL, {given: firstname, family: lastname}))
      
      if (response.ok === true) {
        const thePatients = await response.json();
        const matchingPatients = thePatients?.entry?.map(patient => flatMapPatient(patient.resource));
        setMyPatients(matchingPatients);
      }
      else { 
        setMyPatients(filter(patients, firstname, lastname));
        throw Error(`${response.status}: Could not retrieve patients`)
      }
    } catch(e) {
      message.error(e.message);
      console.log('e.message: ', {errorMessage: e.message, firstname, lastname});
    } finally {
      setLoading(false);
    }
  }

  const clearAll = () => {
    setMyPatients(patients)
    form.resetFields();
  };

  const filter = (patientList, firstname, lastname) => {
    if (!firstname && !lastname) { return patients; }
    return patientList.filter(patient => {
      if (firstname && lastname) {
        return patient?.firstname?.search(new RegExp(firstname, 'gi')) > -1 && patient?.lastname?.search(new RegExp(lastname, 'gi')) > -1;
      } else if (firstname && !lastname) {
        return patient?.firstname?.search(new RegExp(firstname, 'gi')) > -1;
      } else if (!firstname && lastname) {
        return patient?.lastname?.search(new RegExp(lastname, 'gi')) > -1;
      }
      else return patient;
    })
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a?.id - b?.id,
      ellipsis: true,
    },
    {
      title: 'First Name',
      dataIndex: 'firstname',
      key: 'firstname',
      sorter: (a, b) => a?.firstname.localeCompare(b?.firstname),
      ellipsis: true,
    },
    {
      title: 'Last Name',
      dataIndex: 'lastname',
      key: 'lastname',
      sorter: (a, b) => a?.lastname.localeCompare(b?.lastname),
      ellipsis: true,
    },
    {
      title: 'Birthdate',
      dataIndex: 'birthdate',
      key: 'birthdate',
      sorter: getPatientSorter((patient) => patient?.birthdate),
      ellipsis: true,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      render: (_, patient, index) => {
        return moment().diff(patient?.birthdate, 'years') || "-";
      },
    },
  ];  

  return (<div className="page patient-list container">
    <Card title="Patient List" style={{width: '100%', overflowX: 'hidden'}}>
      <Space style={{ marginBottom: 16, flexWrap: 'wrap' }}>
        <Form
          form={form}
          onFinish={handleSubmit}
        >
          <div className="flex-container">
            <Form.Item 
              name="firstname"
              label="First Name"
              rules={[
                {
                  pattern: ALPHA_PATTERN,
                  message: "Only alphanumeric characters allowed"
                },
              ]}>
              <Input placeholder="John" />
            </Form.Item>
            <Form.Item
              name="lastname"
              label="Last Name"
              rules={[
                {
                  pattern: ALPHA_PATTERN,
                  message: "Only alphanumeric characters allowed"
                }
              ]}
            >
              <Input placeholder="Doe" />
            </Form.Item>
            <div className="flex-container">
              <Form.Item>
                <Button type="primary" htmlType='submit' >Submit</Button>
              </Form.Item>
              <Form.Item>
                <Button type="secondary" onClick={clearAll}>Clear</Button>
              </Form.Item>
            </div>
          </div>
        </Form>
      </Space>
      <Table columns={columns} dataSource={myPatients} tableLayout={'auto'} style={{overflowX: 'scroll'}} />
    </Card>
  </div>)
}

export default PatientList;
