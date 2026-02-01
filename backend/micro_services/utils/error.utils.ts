export default class ApiError extends Error {
  message: string;
  statusCode: number;
  success: false = false;
  errorSource: 'DB' | 'Auth' | 'Container' | 'Problem';

  constructor(props: {
    message: string;
    statusCode: number;
    errorSource: 'DB' | 'Auth' | 'Container' | 'Problem';
  }) {
    super(props.message);
    this.message = props.message;
    this.statusCode = props.statusCode;
    this.name = 'ApiError';
    this.errorSource = props.errorSource;
  }
}
