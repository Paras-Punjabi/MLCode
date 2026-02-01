import problemServiceApp from './problem-service/app';
import apiGatewayServiceApp from './api-gateway-service/app';
import submissionServiceApp from './submission-service/app';
import containerServiceApp from './container-service/app';
import config from './configs/dotenv.config';

let serviceAppMapping = {
  'api-gateway-service': apiGatewayServiceApp,
  'problem-service': problemServiceApp,
  'submission-service': submissionServiceApp,
  'container-service': containerServiceApp,
};

let serviceMap = new Map(Object.entries(serviceAppMapping));
let services = config.CURRENT_SERVICE.split(',');
let ports = config.PORT.split(',').map(Number);

for (let i = 0; i < services.length; i++) {
  let app = serviceMap.get(services[i]);
  let port = ports[i];

  app?.listen(port, () => {
    console.log(`${services[i]} started on port ${port}`);
  });
}
