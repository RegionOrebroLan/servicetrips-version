import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Config } from './config';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private static _config: Config[];
  private http: HttpClient;
  constructor() {
    this.http = inject(HttpClient)
  }

  public static get Config(): Config[] {
    return ConfigService._config;
  }

  loadConfig(): Promise<Config[]> {
    console.log("Loading config");
    return new Promise<Config[]>((resolve) => {
      const sub = this.http.get<Config[]>("/config/cfg.json").subscribe({
        next: (config: Config[]) => {

          ConfigService._config = config
          resolve(config);
          console.log(`Config:\n${JSON.stringify(ConfigService._config)}`);
        },
        error: (err: HttpErrorResponse) => {
          console.error(err.message);
          sub.unsubscribe();
        },
        complete: () => {

          sub.unsubscribe();
        }
      });
    });
  }
}
