import React from "react";
import { Button, Card, Row, Col, Form, Space } from 'antd';

import questionnaire from './questionnaire.json';
import { buildQuestionnaireResponseFromAnswers, copyToClipboard, getInput } from "./helpers";

function QuestionnairePage() {
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

export default QuestionnairePage;