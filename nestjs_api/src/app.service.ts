import { Injectable } from '@nestjs/common';

const personalCodes = {
  49002010965: {
    credit_modifier: 0,
  },
  49002010976: {
    credit_modifier: 100,
  },
  49002010987: {
    credit_modifier: 300,
  },
  49002010998: {
    credit_modifier: 1000,
  },
};

@Injectable()
export class AppService {
  getDecision(req) {
    const personal_id = req.query.personal_id;
    const amount = req.query.amount;
    const noOfMonths = req.query.no_of_months;

    const result = this.getCreditScore(
      personalCodes[personal_id]['credit_modifier'],
      amount,
      noOfMonths,
    );

    return result > 1 ? 'Approved' : 'Rejected';
  }

  getCreditScore(modifier, loan_amount, loan_period) {
    return (modifier / loan_amount) * loan_period;
  }
}
