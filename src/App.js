import logo from './ActeionLogo.png';
import React, { useState, useEffect  } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const API_BASE_URL = window.location.hostname === 'localhost' ? process.env.LOCALHOST_URL : process.env.PUBLIC_HOST_URL;

const App = () => {
  const [surveyname, setName] = useState('');
  const [surveydescription, setSurveyDesc] = useState('');
  const [surveydescriptionattheend, setSurveyDescatEnd] = useState('');
  const [surveydesthankyoumessage, setSurveyThankYouMessage] = useState('');
  const [children, setChildren] = useState([
    { questionname: '', type: '', minvalue: '', maxvalue: '', minword: '', maxword: '', choices: '', pickvalues: '', collectcomments: false, isrequired: false, ratingtype: '' },
    { questionname: '', type: '', minvalue: '', maxvalue: '', minword: '', maxword: '', choices: '', pickvalues: '', collectcomments: false, isrequired: false, ratingtype: '' },
    { questionname: '', type: '', minvalue: '', maxvalue: '', minword: '', maxword: '', choices: '', pickvalues: '', collectcomments: false, isrequired: false, ratingtype: '' }
  ]);
  const [typevalues, setTypeDropdownValues] = useState([]);
  const [ratingtypevalues, setRatingTypeDropdownValues] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshDropdowns, setRefreshDropdowns] = useState(false);
  
  // Fetch dropdown values from the API
  useEffect(() => {
    console.log('Effect running');
    const fetchTypeEnumValues = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/type-enum-values/survey_questions/Type`);
        setTypeDropdownValues(response.data);
      } catch (error) {
        alert('Error fetching ENUM values:', error);
      }
    };

    const fetchRatingTypeEnumValues = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/ratingtype-enum-values/survey_questions/Rating_Type`);
        setRatingTypeDropdownValues(response.data);
      } catch (error) {
        console.error('Error fetching ENUM values:', error);
      }
    };

    fetchTypeEnumValues();
    fetchRatingTypeEnumValues();
  }, [refreshDropdowns]);

  const handleAddChild = () => {
    setChildren([...children, { questionname: '', type:'', minvalue:'', maxvalue:'', minword:'', 
      maxword:'', choices:'', pickvalues:'', collectcomments:false, isrequired:false, ratingtype:'' }]);
  };

  const handleChildquestionnameChange = (index, value) => {
    const updatedQuestions = [...children];
    updatedQuestions[index].questionname = value;
    setChildren(updatedQuestions);
  };

  const handleChildtypeChange = (index, value) => {
    const updatedQuestions = [...children];
    updatedQuestions[index].type = value;
    setChildren(updatedQuestions);
  };

  const handleChildminvalueChange = (index, value) => {
    const updatedQuestions = [...children];
    updatedQuestions[index].minvalue = value;
    setChildren(updatedQuestions);
  };

  const handleChildmaxvalueChange = (index, value) => {
    const updatedQuestions = [...children];
    updatedQuestions[index].maxvalue = value;
    setChildren(updatedQuestions);
  };

  /*const handleChildminwordChange = (index, value) => {
    const updatedQuestions = [...children];
    updatedQuestions[index].minword = value;
    setChildren(updatedQuestions);
  };

  const handleChildmaxwordChange = (index, value) => {
    const updatedQuestions = [...children];
    updatedQuestions[index].maxword = value;
    setChildren(updatedQuestions);
  };*/

  const handleChildchoicesChange = (index, value) => {
    const updatedQuestions = [...children];
    updatedQuestions[index].choices = value;
    setChildren(updatedQuestions);
  };

  const handleChildpickvaluesChange = (index, value) => {
    const updatedQuestions = [...children];
    updatedQuestions[index].pickvalues = value;
    setChildren(updatedQuestions);
  };

  const handleChildcollectcommentsChange = (index, checked) => {
    const updatedQuestions = [...children];
    updatedQuestions[index].collectcomments = checked;
    setChildren(updatedQuestions);
  };

  const handleChildisrequiredChange = (index, checked) => {
    const updatedQuestions = [...children];
    updatedQuestions[index].isrequired = checked;
    setChildren(updatedQuestions);
  };

  const handleChildratingtypeChange = (index, value) => {
    const updatedQuestions = [...children];
    updatedQuestions[index].ratingtype = value;
    setChildren(updatedQuestions);
  };

  const handleSubmit = async () => {
    // Basic validation for survey name and thank you message
    if (!surveyname.trim()) {
      toast.error('Please enter Survey Questionnaire Name.', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        style: { backgroundColor: 'red', color: 'white' },
      });
      return;
    }

    if (!surveydesthankyoumessage.trim()) {
      toast.error('Please enter Thank You Message.', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        style: { backgroundColor: 'red', color: 'white' },
      });
      return;
    }

    // Validate that at least one question is present
    const hasAtLeastOneQuestion = children.some((child) => child.type.trim() !== '');
    if (!hasAtLeastOneQuestion) {
      toast.error('Please enter at least one question.', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        style: { backgroundColor: 'red', color: 'white' },
      });
      return;
    }

    // Validate each question in the children array
    for (let index = 0; index < children.length; index++) {
      const child = children[index];

      // If a question type is selected, perform additional validations
      if (child.type && child.type.trim() !== '') {
        // Validate Question Name
        if (!child.questionname || child.questionname.trim() === '') {
          toast.error(`Please enter Question Name for question #${index + 1}.`, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            style: { backgroundColor: 'red', color: 'white' },
          });
          return;
        }

        // Validate fields based on the selected Question Type
        if (child.type && child.type.trim() !== '') {
          if (child.type === 'Multi Select - Checkbox') {
            if (!child.choices || child.choices.length < 2) {
              toast.error(`Please provide at least two options for Question #${index + 1}.`, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                style: { backgroundColor: 'red', color: 'white' },
              });
              return; // Exit the function
            }
          } else if (child.type === 'Rating') {
            if (!child.ratingtype || child.ratingtype.trim() === '') {
              toast.error(`Please select a rating type for Question #${index + 1}.`, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                style: { backgroundColor: 'red', color: 'white' },
              });
              return; // Exit the function
            }
            if (!child.minvalue || child.minvalue <= 0) {
              toast.error(`Please enter a valid minimum range for Question #${index + 1}.`, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                style: { backgroundColor: 'red', color: 'white' },
              });
              return; // Exit the function
            }
            if (!child.maxvalue || child.maxvalue <= 0) {
              toast.error(`Please enter a valid maximum range for Question #${index + 1}.`, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                style: { backgroundColor: 'red', color: 'white' },
              });
              return; // Exit the function
            }
          } else if (child.type === 'Single Select - Dropdown' || child.type === 'Radio') {
            if (!child.choices || child.choices.length < 2) {
              toast.error(`Please provide at least two options for Question #${index + 1}.`, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                style: { backgroundColor: 'red', color: 'white' },
              });
              return; // Exit the function
            }
          } else {
            console.warn(`Unknown Question Type "${child.type}" for question #${index + 1}.`);
          }
        }
      }
    }

    try {
        // If validation passes, submit the form
        setIsSubmitting(true);
        axios.post(`${API_BASE_URL}/create`, {surveyname, surveydescription, surveydescriptionattheend, surveydesthankyoumessage, children})
        .then(response => {
          toast.success('Survey Form created successfully', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            style: { backgroundColor: 'lightgreen', color: 'white' },
          });
          setName('');
          setSurveyDesc('');
          setSurveyDescatEnd('');
          setSurveyThankYouMessage('');
          setChildren([
            { questionname: '', type: '', minvalue: '', maxvalue: '', minword: '', maxword: '', choices: '', pickvalues: '', collectcomments: false, isrequired: false, ratingtype: '' },
            { questionname: '', type: '', minvalue: '', maxvalue: '', minword: '', maxword: '', choices: '', pickvalues: '', collectcomments: false, isrequired: false, ratingtype: '' },
            { questionname: '', type: '', minvalue: '', maxvalue: '', minword: '', maxword: '', choices: '', pickvalues: '', collectcomments: false, isrequired: false, ratingtype: '' }
          ]);
          setRefreshDropdowns(prev => !prev);
          setIsSubmitting(false);
        })
      } catch (error) {
        console.error('Error submitting form:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred.';
        toast.error(`Error: ${errorMessage}`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          style: { backgroundColor: 'orange', color: 'white' },
        });
        setIsSubmitting(false);
      }
    };
  

  return (
    <div className="form-container">
      <div className="form-header">
        <img src={logo} className="App-logo" alt="logo"/>
        <h2 className="form-title">Define New Survey Questionnaire</h2>
      </div><br/><br/>
      <h2 className="section-header">Survey Information</h2>
      <div>
        <label htmlFor="surveyname" className="form-label">Survey Questionnaire Name<span style={{ color: 'red' }}> *</span></label>
        <input required id="surveyname" type="text" className="form-input" value={surveyname} onChange={(e) => setName(e.target.value)}/>
      </div>
      <div>
        <label htmlFor="surveydescription" className="form-label">Survey Description</label>
        <textarea id="surveydescription" maxLength="4999" rows="6" className="form-input" type="text" value={surveydescription} onChange={(e) => setSurveyDesc(e.target.value)}/>
      </div>
      <div>
        <label htmlFor="surveydescriptionattheend" className="form-label">Survey Description at the end</label>
        <textarea id="surveydescriptionattheend" maxLength="4999" rows="6" className="form-input" type="text" value={surveydescriptionattheend} onChange={(e) => setSurveyDescatEnd(e.target.value)}/>
      </div>
      <div>
        <label htmlFor="surveydesthankyoumessage" className="form-label">Thank You Message<span style={{ color: 'red' }}> *</span></label>
        <textarea id="surveydesthankyoumessage" maxLength="4999" rows="6" className="form-input" type="text" value={surveydesthankyoumessage} onChange={(e) => setSurveyThankYouMessage(e.target.value)}/>
      </div><br/>
      <div>
        {children.map((child, index) => (
          <div key={index}>
          <h2 className="section-header">Question {index + 1}</h2>
            <div className='child-div-box-model'>
              <label htmlFor="questiontype" className="form-label">Question Type</label>
              <select
                id="questiontype"
                className="form-input"
                value={child.type}
                onChange={(e) => handleChildtypeChange(index, e.target.value)}
              >
                <option value="">Select an option</option>
                {typevalues.map((value, i) => (
                  <option key={i} value={value}>
                    {value}
                  </option>
                ))}
              </select>
              {child.type !== '' && (
                <div>
                  <div>
                    <label htmlFor="questionname" className="form-label">Question Name</label>
                    <input id="questionname" type="text" className="form-input" value={child.questionname} onChange={(e) => handleChildquestionnameChange(index, e.target.value)}/>
                  </div>
                  <div>
                    <label htmlFor="isrequiredquwstion" className="form-label">Is Required Question?</label>
                    <input 
                    id="isrequiredquwstion" 
                    type="checkbox" 
                    className="checkbox" 
                    checked={child.isrequired} 
                    onChange={(e) => handleChildisrequiredChange(index, e.target.checked)}/>
                  </div>
                  <div>
                    <label htmlFor="iscollectcomments" className="form-label">Collect Comments?</label>
                    <input 
                    id="iscollectcomments" 
                    type="checkbox" 
                    className="checkbox" 
                    checked={child.collectcomments} 
                    onChange={(e) => handleChildcollectcommentsChange(index,  e.target.checked)}/>
                  </div>
                </div>
              )}
              {(child.type === 'Single Select - Dropdown' || child.type === 'Radio') && (
                <div>
                  <div>
                    <label htmlFor="iddontneedchoices" className="form-label">Please enter the list of answers/responses which <b>don't need</b> additional comments in the field below. Each value should be separated by a new line.</label>
                    <textarea id="iddontneedchoices" maxLength="32000" rows="6" className="form-input" type="text" value={child.choices} onChange={(e) => handleChildchoicesChange(index, e.target.value)}/>
                  </div>
                  <div>
                    <label htmlFor="isneedchoices" className="form-label">Please enter the list of answers/responses which <b>need</b> additional comments in the field below. Each value should be separated by a new line.</label>
                    <textarea id="isneedchoices" maxLength="32000" rows="6" className="form-input" type="text" value={child.pickvalues} onChange={(e) => handleChildpickvaluesChange(index, e.target.value)}/>
                  </div>
                </div>
              )}
              {child.type === 'Multi Select - Checkbox' && (
                <div>
                  <label htmlFor="ismultichoices" className="form-label">Please enter the list of answers/responses in the field below. Each value should be separated by a new line.</label>
                  <textarea id="ismultichoices" maxLength="32000" rows="6" className="form-input" type="text" value={child.choices} onChange={(e) => handleChildchoicesChange(index, e.target.value)}/>
                </div>
              )}
              {child.type === 'Rating' && (
                <div>
                  <label htmlFor="ratingtype" className="form-label">Rating Type</label>
                  <select
                    id="ratingtype"
                    className="form-input"
                    value={child.ratingtype}
                    onChange={(e) => handleChildratingtypeChange(index, e.target.value)}
                  >
                    <option value="">Select an option</option>
                    {ratingtypevalues.map((value, i) => (
                      <option key={i} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {(child.type === 'Rating' && child.ratingtype !== '') && (
                <div className="row">
                  <div className="column">
                    <label htmlFor="minvalue" className="form-label">Minimum Range</label>
                    <input type="number" min="1" max="1" id="minvalue" value={child.minvalue} className="form-input" onChange={(e) => handleChildminvalueChange(index, e.target.value)}/>
                  </div>
                  <div className="column columnright">
                    <label htmlFor="maxvalue" className="form-label">Maximum Range</label>
                    <input type="number" min="1" max="10" id="maxvalue" value={child.maxvalue} className="form-input" onChange={(e) => handleChildmaxvalueChange(index, e.target.value)}/>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        <div className="submit-button-containerright">
          <button onClick={handleAddChild} className="submit-button">Add Question</button>
        </div>
      </div>
      <div className="submit-button-containercenter">
        <button onClick={handleSubmit} className="submit-button" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Save'}</button>
      </div>
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar toastClassName="custom-toast" bodyClassName="custom-toast-body"/>
    </div>
  );
};

export default App;