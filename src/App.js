import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Link } from 'react-router-dom'
import { useLocation } from 'react-router';
import { Button, Card, Row, Col, DatePicker, Form, Input, message, Radio, Select, Space, Table, Spin } from 'antd';
import { CSSTransition } from 'react-transition-group';
import moment from 'moment';
import fp from 'fhirpath';
import questionnaire from './questionnaire.json';
import questionnaireResponse from './questionnaire-response.json';

import './App.css';
import smileLogo from './smile-cdr-logo.webp';

const FETCH_PATIENTS_URL = `https://try.smilecdr.com/baseR4/Patient`;

const SUPPORTED_INPUT_TYPES = ['boolean', 'choice', 'date', 'string'];
const SUPPORTED_INPUT_VALUE_TYPES = ['valueBoolean', 'valueString', 'valueDate', 'valueString'];
const SUPPORTED_INPUT_TYPE_TRANSFORMS = [transformBoolean, noop, transformDate, noop];

function noop(value) { return value; }

function transformBoolean(test) {
  switch (test) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      return;
  }
}

function transformDate(test) {
  if (!test || !(test instanceof moment)) { return; }
  return test.format('YYYY-MM-DD');
}

function copyToClipboard(string) {
  navigator.clipboard.writeText(string).then(function() {
    message.success("Copied QuestionnaireResponse resource to your clipboard!")
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
}

export function flatMapPatient(entry) {
  const patient = entry?.resource;
  if (!patient || patient.resourceType !== 'Patient') { return <></>; }

  return {
    firstname: fp.evaluate(patient, "Patient.name.given").join("-") || "-",
    lastname: fp.evaluate(patient, "Patient.name.family").pop() || "-",
    birthdate: patient?.birthDate || "-",
    address: fp.evaluate(patient, "Patient.address.line.first() + ' ' + Patient.address.city + ', ' + Patient.address.state + ' ' + Patient.address.country").pop() || "-",
    gender: patient?.gender || "-",
    phone: fp.evaluate(patient, "Patient.telecom.where(system='phone').value").pop() || "-",
    key: patient?.id || "-",
    id: patient?.id || "-",
  }
}

export function getPatientSorter(toString) {
  return (a, b) => (toString(a)?.toLowerCase() || '').localeCompare(toString(b)?.toLowerCase());
}

export function addSearchParamsToUrl(url, params) {
  if (!params || Object.keys(params).length === 0) { return url }
  const sp = new URLSearchParams();

  for (let [key, value] of Object.entries(params)) {
    value && sp.append(key, value);
  }

  return `${url}?${sp.toString()}`
}

function buildQuestionnaireResponseFromAnswers(answers, qrId) {
  const qr = {
    ...questionnaireResponse,
    id: qrId || questionnaireResponse?.id,
    item: questionnaireResponse.item.map(qrAnswer => {
      const question = fp.evaluate(questionnaire, `Questionnaire.item.where(linkId='${qrAnswer.linkId}')`).pop()
      const answer = answers.find(({id}) => qrAnswer.linkId === id);
      const answerTypeIndex = SUPPORTED_INPUT_TYPES.indexOf(question?.type);
      const valueType = SUPPORTED_INPUT_VALUE_TYPES[answerTypeIndex];
      const transform = SUPPORTED_INPUT_TYPE_TRANSFORMS[answerTypeIndex];

      return answer.value && {...qrAnswer, answer: [{[valueType]: transform(answer.value, valueType)}]}
    }).filter(item => !!item)
  }

  return qr;
}

function Navigation() {
  return <div className="nav-wrap flex">
    <div className="container flex">
      <img className="logo" alt="" src={smileLogo} />
      <ul className="nav flex">
        <li><Link to="patients">Patients</Link></li>
        <li><Link to="questionnaire">Questionnaire</Link></li>
        <li><Link to="/">About</Link></li>
      </ul>
    </div>
  </div>
}

function PatientList({patients}) {
  const ALPHA_PATTERN = /^[a-z0-9 ]+$/gi;
  const [myPatients, setMyPatients] = useState();
  const [loading, setLoading] = useState(false);
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
      const foundPatient = await fetch(addSearchParamsToUrl(FETCH_PATIENTS_URL, {given: firstname, family: lastname}))
      setMyPatients(filter(patients, firstname, lastname));
      console.log("Submitting", {evt, other, firstname, lastname, form, foundPatient});
      if (foundPatient.ok === false) { throw Error(`${foundPatient.status}: Could not retrieve patients`)}
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

function getOptions(question) {
  return question?.option?.map(({valueCoding}, key) => ({key, label: valueCoding?.code, value: valueCoding?.display}));
}

function Questionnaire() {
  const [form] = Form.useForm();
  const clearAll = () => form.resetFields();
  const handleSubmit = () => {
    const questionIds = questionnaire?.item?.map(question => question?.linkId);
    const answers = questionIds.map(id => ({id, value: form.getFieldValue(id)}));
    const qr = buildQuestionnaireResponseFromAnswers(answers, 'new-id');
    const output = JSON.stringify(qr, null, 4);

    copyToClipboard(output);
    clearAll();

    console.info("QuestionnaireResponse has been copied to your clipboard!", {qr});
  }
  const getInput = (question) => {
    if (SUPPORTED_INPUT_TYPES.indexOf(question.type) < 0) { return "No Question here"; }

    switch(question.type) {
      case 'boolean':
        return <Radio.Group options={[{label: 'True', value: 'true'}, {label: 'False', value: 'false'}]} />;
      case 'choice':
        return <Select>
          {getOptions(question).map((option, key) => {
            return <Select.Option key={key} value={option?.label}>{option?.value}</Select.Option>
          })}
        </Select>;
      case 'date':
        return <DatePicker style={{width: "100%"}} />;
      case 'string':
        return <Input />;
      default:
        return;
    }
  }

  return <div className="page questionnaire container">
    <Card title="Questionnaire" style={{width: '100%', overflowX: 'hidden'}}>
      <Space style={{ marginBottom: 16, flexWrap: 'wrap' }}>
          <Form
            layout="vertical"
            form={form}
            onFinish={handleSubmit}
          >
            <Row gutter={16}>
              {questionnaire.item.map(question => {
                const itemInput = getInput(question);
                if (!itemInput) { return<></>; }
                return (
                  <Col span={12} key={question?.linkId}>
                    <Form.Item name={question?.linkId} label={question.text} rules={[{
                      required: true,
                      message: "Required field",
                    }]}>
                      {itemInput}
                    </Form.Item>
                  </Col>
              )})}
            </Row>
            <Row gutter={[16, 24]} style={{width: '100%', justifyContent: 'center'}}>
              <Col md={6}>
                <Form.Item>
                  <Button style={{width: '100%'}} type="primary" htmlType='submit'>Submit</Button>
                </Form.Item>
              </Col>
              <Col md={6}>
                <Form.Item>
                  <Button style={{width: '100%'}} type="secondary" onClick={clearAll}>Clear</Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Space>
    </Card>
  </div>
}

function App() {
  const [patients, setPatients] = useState([]);
  const [apiPerformance, setPerformance] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [loadedOnce, setLoadedOnce] = useState(false);

  useEffect(() => {
    if (!loadedOnce) { setLoadedOnce(true); }
    else return;

    setLoading(true);

    ;(async function () {
      try {
        const start = Date.now();
        const thePatients = await fetch(addSearchParamsToUrl(FETCH_PATIENTS_URL), { method: "GET" })
          .then(res => {
            setPerformance(Date.now() - start);
            return res;
          })
          .then(res => res.json());

        setPatients(thePatients?.entry?.map(flatMapPatient));
      } catch (e) {
        console.error(e.stack);
        message.error(e.message);
      } finally {
        setLoading(false);
      }
    }());
  }, [loading, loadedOnce]);

  return <>
    <Spin spinning={loading}><PatientList patients={patients} /></Spin>
    {apiPerformance && `Fetching patients took ${parseFloat(Number(apiPerformance).toFixed(2), 10)}ms`}
  </>
}

function About() {  
  return (<div className="page about container">
    <div style={{marginBottom: 25}}>
      <h2 style={{textAlign: 'center'}}>Made with &#9825;</h2>
      <h6 style={{textAlign: 'center', wordWrap: 'break-word'}}>Thank you for giving me the opportunity to showcase my skills!</h6>
    </div>
    <hr/>
    <p style={{margin: 0}}>
      This project was made with the following tools
    </p>
    <ul style={{margin: 0}}>
      <li style={{listStyle: 'inside'}}>React: Create React App</li>
      <li style={{listStyle: 'inside'}}>Ant Design: A Design System For Enterprise-Level Products</li>
      <li style={{listStyle: 'inside'}}>FHIR: Fast Health Interoperability Resources Server</li>
    </ul>
    <hr/>
    <div style={{margin: "10px auto"}}>
      <Card title={<h3 style={{textAlign: 'center'}}>About Me: <span style={{fontSize: '.75rem'}}>Tech Ninja</span></h3>} style={{marginTop: 24}}>
        <p style={{margin: 0}}>
          I'm really into Permaculture and Natural Building Design.<br /><br />
          With a bit of care, I believe we can create products that produce waste which can be used as 
          fuel, allowing for sustainable feedback loops in the production chain.<br /><br />
        </p>
      </Card>
      <Card title={<h3 style={{textAlign: 'center'}}>Favourite Books:</h3>} style={{marginTop: 24}}>
        <Row gutter={[12, 12]}>
          <Col md={{span: 8}} xs={{span: 24}}>
            <a href="https://www.amazon.com/Short-History-Nearly-Everything/dp/076790818X" target="_blank" rel="noreferrer">
              <Card
                size="sm"
                hoverable
                style={{ height: '100%' }}
                cover={<img style={{height: 300}} alt="Bill Bryson: A Short History Of Nearly Everything" src="//images-na.ssl-images-amazon.com/images/I/41gdQTWQgEL._SY291_BO1,204,203,200_QL40_FMwebp_.jpg" />}
              >
                <Card.Meta
                  title="A Short History Of Nearly Everything"
                  description="book that explains some areas of science, using easily accessible language that appeals more to the general public than many other books dedicated to the subject."
                />
              </Card>
            </a>
          </Col>
          <Col md={{span: 8}} xs={{span: 24}}>
            <a href="https://www.amazon.com/48-Laws-Power-Robert-Greene-ebook/dp/B0024CEZR6" target="_blank" rel="noreferrer">
              <Card
                size="sm"
                hoverable
                style={{ height: '100%' }}
                cover={<img style={{height: 300}} alt="example" src="https://m.media-amazon.com/images/I/41EhEN9nsmL.jpg" />}
              >
                <Card.Meta title="The 48 Laws of Power" description="The 48 Laws of Power is a book about the “laws” that powerful people throughout history have used to get and maintain power." />
              </Card>
            </a>
          </Col>
          <Col md={{span: 8}} xs={{span: 24}}>
            <a href="https://www.amazon.com/Charlie-Great-Glass-Elevator-Bucket-ebook/dp/B0093X80VQ" target="_blank" rel="noreferrer">
              <Card
                size="sm"
                hoverable
                style={{ height: '100%' }}
                cover={<img style={{height: 300}} alt="Charlie and the Great Glass Elevator" src="https://m.media-amazon.com/images/I/51wzU9LbImL.jpg" />}
              >
                <Card.Meta title="Charlie and the Great Glass Elevator" description="Last seen flying through the sky in a giant elevator in Charlie and the Chocolate Factory, Charlie Bucket's back for another adventure. When the giant elevator picks up speed, Charlie, Willy Wonka, and the gang are sent hurtling through space and time. " />
              </Card>
            </a>
          </Col>
        </Row>
      </Card>
    </div>
  </div>)
}

function TransitionWrapper({children, triggered, reset}) {
  const location = useLocation();
  const [opacity, setOpacity] = useState(0);
  
  useEffect(() => {
    console.log("Location stuff", {location});
    const timeout = setTimeout(() => setOpacity(1), 200);
    return () => { reset(); clearTimeout(timeout); }
  }, [location, reset])
  
  return <CSSTransition
    in={triggered}
    timeout={3000}
    classNames="transition"
    unmountOnExit
  >
    <div style={{opacity}}>{children}</div>
  </CSSTransition>
}

function Main() {
  const [triggered, setTriggered] = useState(true);

  useEffect(() => {
    if (triggered) { return; }
    setTriggered(true)
  }, [triggered, setTriggered])
  
  return <Router>
    <Routes>
      <Route path="/" element={<><Navigation /><TransitionWrapper triggered={triggered} reset={setTriggered}><Outlet /></TransitionWrapper></>}>
        <Route index element={<About />} />
        <Route path="/patients" element={<App />} />
        <Route path="/questionnaire" element={<Questionnaire />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Route>
    </Routes>
  </Router>
}

export default Main;
