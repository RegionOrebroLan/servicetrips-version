import { Component, OnInit } from '@angular/core';
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
  svcs: Svc[] | undefined;
  constructor(private versionSvc: VersionService) { }

  ngOnInit(): void {
    console.log("load versions")
    ConfigService.Config?.map((cfg) => {
      console.log("got config with urls for versions")
      this.versionSvc.getVersion(cfg.adminUrl).subscribe({
        next: (data: VersionWrapper) => {
          if (data?.data?.version) {
            this.populateSvcItem(data.data.version, cfg);
          } else if (data?.data?.versions) {
            this.populateSvcItem(data.data.versions.items, cfg)
          }
        }
      });
    
      this.versionSvc.getVersion(cfg.exposedUrl).subscribe({
        next: (data: VersionWrapper) => {
          if (data?.data?.version) {
            this.populateSvcItem(data.data.version, cfg);
          } else if (data?.data?.versions) {
            this.populateSvcItem(data.data.versions.items, cfg)
          }
        }
      })
    });
  }
  populateSvcItem(items: Map<string, string>, cfg: Config) {
    items.forEach((value: string, key: string) => {
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
