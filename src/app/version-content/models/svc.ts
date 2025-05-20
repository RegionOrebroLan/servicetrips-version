export interface Svc {
    name: string;
    envs: svcEnvVersion[];
}
export interface svcEnvVersion {
    env: string;
    version: string
}