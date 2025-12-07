import problemServiceApp from './problem-service/app';
import apiGatewayServiceApp from './api-gateway-service/app';
import submissionServiceApp from './submission-service/app'
import config from './configs/dotenv.config';

let serviceAppMapping = {
  'api-gateway-service': apiGatewayServiceApp,
  'problem-service': problemServiceApp,
  'submission-service': submissionServiceApp
};

let serviceMap = new Map(Object.entries(serviceAppMapping));

let app = serviceMap.get(config.CURRENT_SERVICE);

app?.listen(config.PORT, () => {
  console.log(`${config.CURRENT_SERVICE} Started on port ${config.PORT}`);
});
