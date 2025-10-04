export interface CustomErrorDetails {
  title: string;
  detail: string;
  additionalInfo: Record<string, any>;
  buttons: any[];
  planChoices: any[];
}

export interface CustomError {
  error: string;
  details: CustomErrorDetails;
  isExpected: boolean;
}

export interface ConnectErrorDetails {
  message: string;
  code?: string;
  stack?: string;
}

export interface ApplicationError {
  type: 'CUSTOM_ERROR' | 'CONNECT_ERROR' | 'HTTP_ERROR' | 'UNKNOWN_ERROR';
  originalError?: any;
  customError?: CustomError;
  connectError?: ConnectErrorDetails;
  httpError?: any;
  timestamp: Date;
  handled: boolean;
}

export interface FreeTrialLimitError extends CustomError {
  error: 'ERROR_CUSTOM_MESSAGE';
  details: {
    title: 'Too many free trials.';
    detail: string; // Contains the upgrade message and explanation
    additionalInfo: Record<string, any>;
    buttons: any[];
    planChoices: any[];
  };
  isExpected: true;
}