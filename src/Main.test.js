import { addSearchParamsToUrl, flatMapPatient, getPatientSorter } from './helpers';
import samplePatient from './patient.json';
import patientsBundle from './patients.json';

test('can flatmap patient list', () => {
  const patients = [flatMapPatient(samplePatient)];

  expect(patients.length).toBeGreaterThan(0);
  expect(patients[0]?.firstname).toBe('Peter-James');
  expect(patients[0]?.lastname).toBe('Chalmers');
  expect(patients[0]?.birthdate).toBe('1974-12-25');
  expect(patients[0]?.address).toBe('622 College Street Toronto, Ontario Canada');
  expect(patients[0]?.gender).toBe('male');
  expect(patients[0]?.phone).toBe('1-800-683-1318');
  expect(patients[0]?.key).toBe("202");
  expect(patients[0]?.key).toBe(patients[0]?.id);
});

test('can create url with search parameters', () => {
  const url = 'test.com';
  const params = { search: 'term', patient_id: '202' }

  expect(addSearchParamsToUrl(url, params)).toBe(`${url}?search=term&patient_id=202`);
});

test('patient firstnames can be sorted ascending', () => {
  const patients = patientsBundle?.entry?.map(patient => flatMapPatient(patient.resource)).sort(getPatientSorter((patient) => patient.firstname));
  const firstnames = patients.map(p => p?.firstname);

  expect(firstnames[0]).toBe('Jadu');
  expect(firstnames[firstnames.length -1]).toBe('Sharma');
});