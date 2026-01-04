import * as k8s from '@kubernetes/client-node';
import config from '../../configs/dotenv.config';
import {
  getDeploymentManifestJSON,
  getServiceManifestJSON,
} from '../utils/k8s-manifest';

export default class ContainerService {
  private k8sClient: k8s.KubeConfig;
  private coreV1API: k8s.CoreV1Api;
  private appsV1API: k8s.AppsV1Api;
  private namespace: string;

  constructor() {
    this.k8sClient = new k8s.KubeConfig();
    this.k8sClient.loadFromDefault();
    this.namespace = config.NAMESPACE;
    this.coreV1API = this.k8sClient.makeApiClient(k8s.CoreV1Api);
    this.appsV1API = this.k8sClient.makeApiClient(k8s.AppsV1Api);
  }

  async startNotebookPod(sessionId: string, userId: string, problemId: string) {
    let deploymentManifest = getDeploymentManifestJSON(
      this.namespace,
      sessionId,
      userId,
      problemId
    );

    let serviceManifest = getServiceManifestJSON(this.namespace, sessionId);

    await this.appsV1API.createNamespacedDeployment({
      namespace: this.namespace,
      body: deploymentManifest as k8s.V1Deployment,
    });

    await this.coreV1API.createNamespacedService({
      namespace: this.namespace,
      body: serviceManifest as k8s.V1Service,
    });
  }

  async stopNotebookPod(sessionId: string) {
    await this.coreV1API.deleteNamespacedService({
      namespace: this.namespace,
      name: `notebook-service-${sessionId}`,
    });
    await this.appsV1API.deleteNamespacedDeployment({
      namespace: this.namespace,
      name: `notebook-deployment-${sessionId}`,
    });
  }

  async getNotebookPodStatus(sessionId: string) {
    let data = await this.coreV1API.listNamespacedPod({
      namespace: this.namespace,
      labelSelector: `app=notebook-pod-${sessionId}`,
    });

    if (data.items.length == 0) return null;

    return {
      currentStatus: data.items[0].status?.phase,
      startTime: data.items[0].status?.startTime?.getTime(),
    };
  }

  async getAllNotebookPods() {
    let data = await this.coreV1API.listNamespacedPod({
      namespace: this.namespace,
      labelSelector: 'pod=mlcode-pod',
    });

    let pods = data.items.map((it) => {
      let sessionId = it.metadata?.labels?.['sessionId'];
      let restartCount = it.status?.containerStatuses?.reduce(
        (count, item) => count + (item?.restartCount ?? 0),
        0
      );
      let startTime = it.status?.startTime;
      let currentStatus = it.status?.phase;
      let nodeName = it.spec?.nodeName;
      return { sessionId, restartCount, startTime, currentStatus, nodeName };
    });
    return pods;
  }
}

(async () => {
  let obj = new ContainerService();
  // await obj.startNotebookPod('test', 'paras', 'sklearn');
  // await obj.stopNotebokPod('test');
  // console.log(await obj.getNotebookPodStatus('test'));
  console.log(await obj.getAllNotebookPods());
})();
