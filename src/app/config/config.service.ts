import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Config } from './config';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private static _config: Config[];
  constructor(private http: HttpClient) {
  }

  public static get Config(): Config[] {
    return ConfigService._config;
  }

  loadConfig(): Promise<Config[]> {
    return new Promise<Config[]>((resolve, reject) => {
      const sub = this.http.get<Config[]>("/config/cfg.json").subscribe({
        next: (config: Config[]) => {

          ConfigService._config = config
          console.log(`Config:\n${JSON.stringify(ConfigService._config)}`);
          resolve(config);
        },
        error: (err: HttpErrorResponse) => {
          console.error(err.message);
          reject();
          sub.unsubscribe();
        },
        complete: () => {

          sub.unsubscribe();
        }
      });
    });
  }
}
