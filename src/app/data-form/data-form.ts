import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, computed, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormField, SubmitRequest } from '../form-fields';
import { IModel } from '../models';

@Component({
    selector: 'app-data-form',
    templateUrl: './data-form.html',
    styleUrl: './data-form.css',
    imports: [ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataForm<T extends IModel> implements OnInit {
  private fb = inject(FormBuilder);
  private cd = inject(ChangeDetectorRef);

  dataForm!: FormGroup;
  model!: T;
  readonly submissionSuccess = signal(false);
  readonly submissionError = signal("");

  readonly headerText = input("Form");
  readonly isReadonly = input(false);
  readonly buttonText = input("Submit");
  readonly config = input<FormField<T>[]>([]); // Definition of fields
  readonly initialData = input.required<T>();
  readonly submitRequest = output<SubmitRequest<T>>();

  readonly requiredFields = computed(() => {
    const requiredMap = new Map<string, boolean>();

    this.config().forEach(field => {
      // We check the raw config validators before the form is even built
      const isReq = field.validators?.some(v => v === Validators.required) ?? false;
      requiredMap.set(field.key, isReq);
    });

    return requiredMap;
  });

  constructor() {
    effect(() => {
        const data = this.initialData();
        if (this.dataForm && data) {
          this.dataForm.patchValue(data, { emitEvent: false });
        }
    });
  }

  ngOnInit(): void {
    const groupProps = Object.fromEntries(
      this.config().map(c => {
        const defaultVal = c.defaultValue !== undefined ? c.defaultValue : '';
        return [c.key, [defaultVal, c.validators || []]];
      })
    );
    this.dataForm = this.fb.group(groupProps);
  }

  onSubmitHandler(): void {
    if (this.dataForm.invalid) {
      return;
    }
    this.submitRequest.emit({
      model: { ...this.model, ...this.dataForm.value },
      callback: res => {
        this.submissionSuccess.set(!res.error);
        this.submissionError.set(res.message || "");

        if (res.error || !res.error) {
          setTimeout(() => {
            this.submissionSuccess.set(false);
            this.submissionError.set("");
          }, 3000);
        }
      }
    });
  }
}