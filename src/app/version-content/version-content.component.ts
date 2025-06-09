import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Config } from '../config/config';
import { ConfigService } from '../config/config.service';
import { Svc, svcEnvVersion } from './models/svc';
import { VersionWrapper } from './models/version';
import { VersionService } from './services/version.service';

@Component({
  selector: 'app-version-content',
  imports: [],
  templateUrl: './version-content.component.html',
  styleUrl: './version-content.component.scss'
})


export class VersionContentComponent implements OnInit {

  versions: VersionWrapper | undefined;
  svcs: Svc[] = [];
  envs: string[] = [];
  public cfgs: Config[] | undefined;
  constructor(private versionSvc: VersionService) { }
  destroyRef = inject(DestroyRef);
  title: string | undefined;

  ngOnInit(): void {
    this.title = ConfigService.Title.title;
    this.cfgs = ConfigService.Config;
    ConfigService.Config?.map((cfg) => {
      cfg.urls.map((url) => {

        new Promise<any>((resolve, reject) => {
          this.versionSvc.getVersion(url).subscribe({
            next: (data: VersionWrapper) => {
              if (data?.data?.version) {
                resolve(data.data.version);
              } else if (data?.data) {
                resolve(data.data);
              }
            },
            error: (err: HttpErrorResponse) => {
              console.error(err.message);
              reject();
            }
          });
        }).then((items) => {
          this.populateSvcItem(items, cfg);
          this.sortSvcs(this.svcs);
        });
      });
    });

  }
  populateSvcItem(obj: any, cfg: Config) {
    const items = new Map<string, string>();
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        items.set(key, obj[key]);
      }
    }

    items.forEach((value: string, key: string) => {
      let svcEnvs: svcEnvVersion[] = [];
      //Skapa en serviceEnvironment med den här iterationens miljö och version.
      const svcEnv: svcEnvVersion = {
        env: cfg.env,
        version: value,
      }
      svcEnvs.push(svcEnv);
      let v = this.svcs.find(n => n.name === key)
      //Om det inte redan finns en service i listan så skapar vi en och lägger till den här miljöns serviceEnvironment 
      //samt tomma envs för de andra miljöerna.
      if (!v) {


        this.cfgs?.map((conf) => {
          if (conf.env !== cfg.env) {
            const svcEnvEmpty: svcEnvVersion = {
              env: conf.env,
              version: ""
            }
            svcEnvs.push(svcEnvEmpty)
          }
        });

        v = {
          name: key,
          envs: svcEnvs,
        }
        this.svcs.push(v);
      } else {
        //Byt ut det existerande tomma serviceEnvironment entryt i listan mot den aktuella iterationens miljö och version.
        v.envs.splice(v.envs.findIndex((e) => e.env === cfg.env), 1, svcEnv);
      }

    });
  }
  sortSvcs(svcs: Svc[]) {
    svcs.map((svc) => {
      svc.envs.sort((a, b) => {
        let aPos = this.cfgs?.findIndex(c => c?.env === a.env) ?? 0;
        let bPos = this.cfgs?.findIndex(c => c?.env === b.env) ?? 0;
        if (aPos > bPos) {
          return 1
        } else if (aPos < bPos) {
          return -1
        } else {
          return 0
        }
      })
    });
  }
}

