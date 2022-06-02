import { useEffect, useState } from 'react';
import { message, Spin } from 'antd';
import { addSearchParamsToUrl, FETCH_PATIENTS_URL, flatMapPatient } from '../helpers';
import PatientList from './PatientList';

function Patients() {
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
  
          setPatients(thePatients?.entry?.map(patient => flatMapPatient(patient.resource)));
        } catch (e) {
          console.error(e.stack);
          message.error(e.message);
        } finally {
          setLoading(false);
        }
      }());
    }, [loading, loadedOnce]);
  
    return <>
      <Spin spinning={loading}><PatientList loading={loading} setLoading={setLoading} patients={patients} /></Spin>
      {apiPerformance && `Fetching patients took ${parseFloat(Number(apiPerformance).toFixed(2), 10)}ms`}
    </>
}

export default Patients;
