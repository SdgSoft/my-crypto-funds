import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormField, SubmitRequest } from '../form-fields';
import { Model } from '../models';

@Component({
    selector: 'app-data-form',
    templateUrl: './data-form.html',
    styleUrl: './data-form.css',
    imports: [ReactiveFormsModule, AsyncPipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataForm<T extends Model> implements OnInit {
  private fb = inject(FormBuilder);
  private cd = inject(ChangeDetectorRef);

  dataForm!: FormGroup;
  model!: T;
  submissionSuccess = false;
  submissionError = "";

  @Input() headerText = "Form";
  @Input() isReadonly = false;
  @Input() buttonText = "Submit";
  @Input() config: FormField<T>[] = []; // Definition of fields
  @Input() initialData!: T;
  @Output() onSubmit = new EventEmitter<SubmitRequest<T>>();

  ngOnInit(): void {
    // Clone data to avoid mutating parent state
    this.model = { ...this.initialData };
    const groupProps = Object.fromEntries(
      this.config.map(c => [c.key, ['',c.validators || []]])
    );
    this.dataForm = this.fb.group(groupProps);
    this.dataForm.patchValue(this.initialData)
  }

  onSubmitHandler(): void {
    if (this.dataForm.invalid) {
      return;
    }
    this.onSubmit.emit({
        model: { ...this.model, ...this.dataForm.value },
        callback: res => {
          this.submissionSuccess = !res.error;
          if (res.error) {
            this.submissionError = res.message || "";
          }

          this.showFormError();
        }
    });
  }

  showFormError() : void {
    this.cd.detectChanges();
    setTimeout(() => {
      this.submissionSuccess = false;
      this.submissionError = "";

      // Ensure the UI updates when the timer finishes
      this.cd.detectChanges();
      }, 3000);
  }

  isRequired(field: string) {
    const formField: any = this.dataForm.get(field);
    if (formField){
      console.log(typeof formField.validator);
      if (typeof formField.validator === "function") {
        const validator = formField.validator({} as AbstractControl);
        if (validator && validator.required) {
          return true;
        }
      }
    }
    return false;
  }
}