import fp from 'fhirpath';
import moment from 'moment';
import { message, DatePicker, Input, Radio, Select } from 'antd';
import questionnaire from './questionnaire.json';
import questionnaireResponse from './questionnaire-response.json';

export const FETCH_PATIENTS_URL = `https://hapi.fhir.org/baseR4/Patient`;
export const SUPPORTED_INPUT_TYPES = ['boolean', 'choice', 'date', 'string'];
export const SUPPORTED_INPUT_VALUE_TYPES = ['valueBoolean', 'valueString', 'valueDate', 'valueString'];
export const SUPPORTED_INPUT_TYPE_TRANSFORMS = [transformBoolean, noop, transformDate, noop];

export function noop(value) { return value; }

export function transformBoolean(test) {
  switch (test) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      return;
  }
}

export function transformDate(test) {
  if (!test || !(test instanceof moment)) { return; }
  return test.format('YYYY-MM-DD');
}

export function copyToClipboard(string) {
  navigator.clipboard.writeText(string).then(function() {
    message.success("Copied QuestionnaireResponse resource to your clipboard!")
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
}

export function buildQuestionnaireResponseFromAnswers(answers, qrId) {
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

function getOptions(question) {
  return question?.option?.map(({valueCoding}, key) => ({key, label: valueCoding?.code, value: valueCoding?.display}));
}

export function getInput(question) {
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

export function flatMapPatient(patient) {
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