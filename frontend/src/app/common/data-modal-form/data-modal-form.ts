import { ChangeDetectionStrategy, Component, computed, effect, inject, input, OnInit, output, viewChildren } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowLeft, heroXMark } from '@ng-icons/heroicons/outline';
import { IModel } from '../../models';
import { FormField } from '../form-fields';
import { FormattedInputDirective } from '../formatted-input/formatted-input.directive';

@Component({
  selector: 'app-data-modal-form',
  templateUrl: './data-modal-form.html',
  styleUrl: './data-modal-form.css',
  imports: [ReactiveFormsModule, FormattedInputDirective, NgIcon],
  providers: [provideIcons({ heroArrowLeft, heroXMark })],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataModalForm<T extends IModel> implements OnInit {
  readonly formattedInputs = viewChildren(FormattedInputDirective);
  private fb = inject(FormBuilder);

  dataForm!: FormGroup;
  model!: T;

  readonly show = input(true);
  readonly headerText = input('');
  readonly isReadonly = input(false);
  readonly buttonText = input('Submit');
  readonly config = input<FormField<T>[]>([]);
  readonly initialData = input.required<T>();
  readonly submitRequest = output<T>();
  readonly cancelRequest = output<void>();

  readonly requiredFields = computed(() => {
    const requiredMap = new Map<string, boolean>();
    this.config().forEach(field => {
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
    const rawValues = { ...this.model, ...this.dataForm.value };
    this.config().forEach(field => {
      if (field.format) {
        const inputDir = this.formattedInputs().find((dir: FormattedInputDirective) => dir.control.name === field.key);
        if (inputDir) {
          rawValues[field.key] = inputDir.lastRawValue;
        }
      }
    });
    this.submitRequest.emit(rawValues);
  }

  onCancelHandler(): void {
    this.cancelRequest.emit();
  }
}
