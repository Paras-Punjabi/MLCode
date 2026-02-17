import problemServiceApp from './problem-service/app';
import apiGatewayServiceApp from './api-gateway-service/app';
import submissionServiceApp from './submission-service/app';
import containerServiceApp from './container-service/app';
import SubmissionServiceKafkaConsumer from './submission-service/kafka/consumer';
import config from './configs/dotenv.config';

let serviceAppMapping = {
  'api-gateway-service': apiGatewayServiceApp,
  'problem-service': problemServiceApp,
  'submission-service': submissionServiceApp,
  'container-service': containerServiceApp,
  'consumer-service': new SubmissionServiceKafkaConsumer(),
};

let serviceMap = new Map(Object.entries(serviceAppMapping));
let services = config.CURRENT_SERVICE.split(',');

for (let i = 0; i < services.length; i++) {
  let [service, port] = services[i].split(':');
  let app = serviceMap.get(service);

  if (port) {
    app?.listen(Number(port), () => {
      console.log(`${services[i]} started on port ${port}`);
    });
  } else if (app instanceof SubmissionServiceKafkaConsumer) {
    app?.listen();
  }
}
