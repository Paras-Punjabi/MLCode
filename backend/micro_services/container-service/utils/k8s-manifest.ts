import config from '../../configs/dotenv.config';
import { V1Deployment, V1Service } from '@kubernetes/client-node';

export function getDeploymentManifestJSON(
  namespace: string,
  sessionId: string,
  userId: string,
  problemId: string
): V1Deployment {
  return {
    kind: 'Deployment',
    apiVersion: 'apps/v1',
    metadata: {
      name: `notebook-deployment-${sessionId}`,
      namespace: namespace,
    },
    spec: {
      replicas: 1,
      selector: {
        matchLabels: {
          app: `notebook-pod-${sessionId}`,
          pod: 'mlcode-pod',
          sessionId: sessionId,
        },
      },
      template: {
        metadata: {
          labels: {
            app: `notebook-pod-${sessionId}`,
            pod: 'mlcode-pod',
            sessionId: sessionId,
            userId: userId,
            problemId: problemId,
          },
        },
        spec: {
          containers: [
            {
              name: `notebook-pod-${sessionId}`,
              image: config.NOTEBOOK_DOCKER_IMAGE,
              imagePullPolicy: 'Always',
              env: [
                {
                  name: 'MINIO_ACCESS_KEY',
                  valueFrom: {
                    configMapKeyRef: {
                      name: 'mlcode-config',
                      key: 'MINIO_ACCESS_KEY',
                    },
                  },
                },
                {
                  name: 'MINIO_SECRET_KEY',
                  valueFrom: {
                    configMapKeyRef: {
                      name: 'mlcode-config',
                      key: 'MINIO_SECRET_KEY',
                    },
                  },
                },
                {
                  name: 'USER_ID',
                  value: userId,
                },
                {
                  name: 'PROBLEM_ID',
                  value: problemId,
                },
                {
                  name: 'SESSION_ID',
                  value: sessionId,
                },
                {
                  name: 'MINIO_ENDPOINT',
                  value: 'minio:9000',
                },
              ],
              ports: [
                {
                  containerPort: 8888,
                },
              ],
            },
          ],
        },
      },
    },
  };
}

export function getServiceManifestJSON(
  namespace: string,
  sessionId: string
): V1Service {
  return {
    apiVersion: 'v1',
    kind: 'Service',
    metadata: {
      name: `notebook-service-${sessionId}`,
      namespace: namespace,
    },
    spec: {
      type: 'ClusterIP',
      selector: {
        app: `notebook-pod-${sessionId}`,
        pod: 'mlcode-pod',
        sessionId: sessionId,
      },
      ports: [
        {
          port: 8888,
          targetPort: 8888,
        },
      ],
    },
  };
}
