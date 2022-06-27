import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ManageKeysComponent } from "./manage-keys.component";

describe("ManageKeysComponent", () => {
  let component: ManageKeysComponent;
  let fixture: ComponentFixture<ManageKeysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManageKeysComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageKeysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
