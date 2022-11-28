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

const MAX_LOAN_AMOUNT = 1000;
const MAX_PERIOD = 60;

@Injectable()
export class AppService {
  getDecision(req) {
    const personal_id = req.query.personal_id;
    const amount = req.query.amount;
    const noOfMonths = req.query.no_of_months;

    const score = this.getCreditScore(
      personalCodes[personal_id]['credit_modifier'],
      amount,
      noOfMonths,
    );

    const userLoanAmount = this.getAmount(score, amount);

    const maxLoanAmount = this.maxLoanAmount(
        personalCodes[personal_id]['credit_modifier'],
        MAX_LOAN_AMOUNT,
        MAX_PERIOD
    );

    return {
      userLoanAmount,
      maxLoanAmount,
      status: score >= 1 && amount <= userLoanAmount ? 'Approved' : 'Rejected'
    };
  }

  maxLoanAmount(
      creditModifier: number,
      loanLimit: number,
      periodLimit: number
  ): number {
    const maxScore = this.getCreditScore(
        creditModifier,
        loanLimit,
        periodLimit
    );
    return this.getAmount(maxScore, loanLimit);
  }

  getAmount(score: number, amount: number) {
    return  Math.round(score * amount);
  }

  getCreditScore(modifier, loan_amount, loan_period) {
    return (modifier / loan_amount) * loan_period;
  }
}
