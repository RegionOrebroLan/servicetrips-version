export interface Svc {
    name: string;
    env: svcEnvVersion;
}
export interface svcEnvVersion {
    env: string;
    version: string
}