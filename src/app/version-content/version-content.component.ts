import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Config } from '../config/config';
import { ConfigService } from '../config/config.service';
import { Svc } from './models/svc';
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
  constructor(private versionSvc: VersionService) { }
  destroyRef = inject(DestroyRef);
  title: string | undefined;

  ngOnInit(): void {
    this.title = ConfigService.Title.title;
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
      let v = this.svcs.find(n => n.name === key)
      if (!v) {
        v = {
          name: key,
          test: "",
          prod: "",
        }
        this.svcs.push(v)
      }
      this.svcs?.map((v) => {
        if (v.name == key) {
          if (cfg.env == "Prod") {
            v.prod = value;
          } else {
            v.test = value;
          }
        }
      })
    })
  }

}

