import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTokensComponent } from './manage-tokens.component';

describe('ManageTokensComponent', () => {
  let component: ManageTokensComponent;
  let fixture: ComponentFixture<ManageTokensComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageTokensComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTokensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
