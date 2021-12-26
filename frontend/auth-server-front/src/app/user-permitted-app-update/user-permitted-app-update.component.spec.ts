import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPermittedAppUpdateComponent } from './user-permitted-app-update.component';

describe('UserPermittedAppUpdateComponent', () => {
  let component: UserPermittedAppUpdateComponent;
  let fixture: ComponentFixture<UserPermittedAppUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPermittedAppUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPermittedAppUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
