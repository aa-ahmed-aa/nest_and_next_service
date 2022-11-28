import {ErrorMessage, Field, Form, Formik} from 'formik';
import styles from './decision-engine.module.css'
import * as Yup from 'yup';
import {Simulate} from "react-dom/test-utils";

interface Values {
    personalId: string;
    amount: string;
    date: string;
}

let loanStatus = '';

const DEFAULT_BACKEND_BASE_URL = 'http://localhost:3001/decisionengine';

export default function DecisionEngine() {
    return (
            <div className={styles.engine_box + ' p-5'}>
            <h1 className="display-7 mb-5 text-center">Decision engine</h1>
            <Formik
                initialValues={{
                    personalId: '',
                    amount: '',
                    date: '',
                }}
                validationSchema={DecisionFormSchema}
                onSubmit={submitForm}

            >
                {({ errors, touched }) => (
                        <Form>
                            <div className="m-3">
                                <label>Personal id code</label>
                                <Field className="form-control" id="personalId" name="personalId" placeholder="Personal id code" />
                                <ErrorMessage name={"personalId"} render={msg => <div className={styles.invalid_form}>{msg}</div>} />
                            </div>

                            <div className="m-3">
                                <label>Amount</label>
                                <Field className="form-control" id="amount" name="amount" placeholder="Amount" type="number" />
                                <ErrorMessage name={"amount"} render={msg => <div className={styles.invalid_form}>{msg}</div>} />
                            </div>


                            <div className="m-3">
                                <label>Choose Date</label>
                                <Field className="form-control" id="date" name="date" placeholder="Date" type="date" />
                                <ErrorMessage name={"date"} render={msg => <div className={styles.invalid_form}>{msg}</div>} />
                            </div>

                            {loanStatus === 'Approved' ? <div className="alert alert-success">{loanStatus}</div> : ''}
                            {loanStatus === 'Rejected' ? <div className="alert alert-danger">{loanStatus}</div> : ''}

                            <div className="col text-center">
                                <button className="btn btn-outline-primary">Calculate</button>
                            </div>
                        </Form>
                    )}
            </Formik>
        </div>
    );
};

const DecisionFormSchema = Yup.object().shape({
    personalId: Yup.string()
        .oneOf(['49002010965','49002010976','49002010987','49002010998'])
        .required('Required'),
    amount: Yup.number()
        .min(2000, 'Minimuum is 2000 € !')
        .max(10000, 'Maxximum is 10000 € !')
        .required('Required'),
    date: Yup.date()
        .min(new Date(),'Please choose future date')
        .test(
            'date',
            'Should be between 12 and 60 months',
            function (value) {
                const noOfMonths = getNumberOfMonths(value);

                return noOfMonths >= 12 && noOfMonths <= 60;
            })
        .required('Required'),
});

function getNumberOfMonths(value: any) {
    const today = new Date();
    const date = new Date(value);

    return date.getMonth() -
        today.getMonth() +
        12 * (date.getFullYear() - today.getFullYear())
}

const submitForm = async (values: Values) => {
    const params = `?personal_id=${values.personalId}&amount=${values.amount}&no_of_months=${getNumberOfMonths(values.date)}`;

    loanStatus = await sendRequest(params);
}

async function sendRequest(url: string) {
    try {
        return await (await fetch((process.env.BACKEND_API || DEFAULT_BACKEND_BASE_URL ) + url)).json();
    } catch (e) {
        throw e;
    }
}
