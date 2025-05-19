import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Config } from './config';
import { Title } from './title';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private static _config: Config[];
  private static _title: Title;
  constructor(private http: HttpClient) {
  }

  public static get Config(): Config[] {
    return ConfigService._config;
  }
  public static get Title(): Title {
    return ConfigService._title;
  }

  loadConfig(): Promise<Config[]> {
    const titleSub = this.http.get<Title>("/config/title.json").subscribe({
      next: (title: Title) => {
        ConfigService._title = title;
      },
      error: (err: HttpErrorResponse) => {
        console.log(err.message);
        titleSub.unsubscribe();
      },
      complete: () => {
        titleSub.unsubscribe();
      }
    })
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
