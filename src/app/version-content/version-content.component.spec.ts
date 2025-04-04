import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionContentComponent } from './version-content.component';

describe('VersionContentComponent', () => {
  let component: VersionContentComponent;
  let fixture: ComponentFixture<VersionContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VersionContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VersionContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
