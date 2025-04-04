export interface VersionWrapper {
    data: Data;
    success: boolean;
    message: string;
    token: any;
}

export interface Data {
    items?: Map<string, string>;

    version?: Map<string, string>;
}

export interface Version {
    items: Map<string, string>;
    // "address-api": string
    // "bankid-api": string
    // "planet-api": string
    // "planit": string
    // "ratten-api": string
    // "db": string
}

