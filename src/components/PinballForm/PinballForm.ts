import type { NewPinballMachinePayload } from '../../models';
import { RarityTier } from '../../models';
import { createIconElement } from '../../utils/icon.utils';
import { PlusCircle, Gamepad2 } from 'lucide';

function createField(opts: {
  labelText: string;
  inputId: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  min?: string;
  max?: string;
  step?: string;
}): HTMLDivElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'flex flex-col gap-1';

  const label = document.createElement('label');
  label.htmlFor = opts.inputId;
  label.className = 'text-[10px] font-black uppercase tracking-widest text-[--color-arcade-muted]';
  label.textContent = opts.labelText;

  const input = document.createElement('input');
  input.type = opts.type;
  input.id = opts.inputId;
  input.name = opts.inputId;
  input.className =
    'w-full bg-[--color-arcade-base] border border-[--color-arcade-line] rounded-lg px-3.5 py-2.5 text-sm text-[--color-arcade-cream] placeholder-[--color-arcade-muted]/50 focus:outline-none focus:border-[--color-arcade-gold] focus:ring-1 focus:ring-[--color-arcade-gold]/50 transition-all';
  if (opts.placeholder !== undefined) input.placeholder = opts.placeholder;
  if (opts.required === true) input.required = true;
  if (opts.min !== undefined) input.min = opts.min;
  if (opts.max !== undefined) input.max = opts.max;
  if (opts.step !== undefined) input.step = opts.step;

  wrapper.appendChild(label);
  wrapper.appendChild(input);
  return wrapper;
}

export function createPinballFormElement(
  onSubmit: (payload: NewPinballMachinePayload) => void,
): HTMLElement {
  const section = document.createElement('section');
  section.className =
    'w-full bg-[--color-arcade-surface] border border-[--color-arcade-line] rounded-2xl p-5 md:p-6 shadow-xl';

  const header = document.createElement('header');
  header.className = 'flex items-center gap-2 mb-5';
  header.appendChild(createIconElement(Gamepad2, 'w-5 h-5 text-[--color-arcade-gold]'));
  const heading = document.createElement('h2');
  heading.className =
    'font-display text-sm font-black uppercase tracking-tight text-[--color-arcade-cream]';
  heading.textContent = 'Agregar Máquina';
  header.appendChild(heading);
  section.appendChild(header);

  const form = document.createElement('form');
  form.id = 'form-pinball';
  form.noValidate = true;
  form.className = 'flex flex-col gap-4';

  const modelField = createField({
    labelText: 'Modelo *',
    inputId: 'input-modelo',
    type: 'text',
    placeholder: 'Ej: Theater of Magic',
    required: true,
  });
  const mfgField = createField({
    labelText: 'Fabricante *',
    inputId: 'input-fabricante',
    type: 'text',
    placeholder: 'Ej: Bally, Williams, Stern…',
    required: true,
  });
  const yearField = createField({
    labelText: 'Año de fabricación *',
    inputId: 'input-anio',
    type: 'number',
    placeholder: 'Ej: 1994',
    required: true,
    min: '1947',
    max: String(new Date().getFullYear()),
  });
  const unitsField = createField({
    labelText: 'Unidades producidas',
    inputId: 'input-unidades',
    type: 'number',
    placeholder: 'Ej: 10450',
    min: '1',
  });
  const costField = createField({
    labelText: 'Costo restauración (USD)',
    inputId: 'input-costo',
    type: 'number',
    placeholder: 'Ej: 3500',
    min: '0',
    step: '0.01',
  });
  const ratingField = createField({
    labelText: 'Rating de condición (1.0 – 5.0)',
    inputId: 'input-rating',
    type: 'number',
    placeholder: 'Ej: 4.2',
    min: '1',
    max: '5',
    step: '0.1',
  });
  const imageField = createField({
    labelText: 'URL de imagen',
    inputId: 'input-imagen',
    type: 'url',
    placeholder: 'https://ejemplo.com/foto.jpg',
  });

  const rarityWrapper = document.createElement('div');
  rarityWrapper.className = 'flex flex-col gap-1';
  const rarityLabel = document.createElement('label');
  rarityLabel.htmlFor = 'select-rareza';
  rarityLabel.className =
    'text-[10px] font-black uppercase tracking-widest text-[--color-arcade-muted]';
  rarityLabel.textContent = 'Nivel de rareza';
  const select = document.createElement('select');
  select.id = 'select-rareza';
  select.name = 'select-rareza';
  select.className =
    'w-full bg-[--color-arcade-base] border border-[--color-arcade-line] rounded-lg px-3.5 py-2.5 text-sm text-[--color-arcade-cream] focus:outline-none focus:border-[--color-arcade-gold] transition-all cursor-pointer';
  Object.values(RarityTier).forEach((tier) => {
    const option = document.createElement('option');
    option.value = tier;
    option.textContent = tier;
    select.appendChild(option);
  });
  rarityWrapper.appendChild(rarityLabel);
  rarityWrapper.appendChild(select);

  const checksRow = document.createElement('div');
  checksRow.className = 'flex gap-4';

  const addCheckbox = (id: string, labelText: string): HTMLInputElement => {
    const wrapper = document.createElement('div');
    wrapper.className = 'flex items-center gap-2';
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.id = id;
    cb.name = id;
    cb.className = 'w-4 h-4 accent-[--color-arcade-gold] cursor-pointer';
    const lbl = document.createElement('label');
    lbl.htmlFor = id;
    lbl.className = 'text-xs font-medium text-[--color-arcade-cream] cursor-pointer';
    lbl.textContent = labelText;
    wrapper.appendChild(cb);
    wrapper.appendChild(lbl);
    checksRow.appendChild(wrapper);
    return cb;
  };

  const cbFunctional = addCheckbox('cb-funcional', 'Totalmente funcional');
  const cbMultiball = addCheckbox('cb-multiball', 'Tiene Multiball');

  const errorBlock = document.createElement('div');
  errorBlock.id = 'bloque-error-pinball';
  errorBlock.className =
    'hidden text-xs font-semibold text-[--color-arcade-danger] bg-[--color-arcade-danger]/10 border border-[--color-arcade-danger]/30 rounded-lg p-3';

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className =
    'w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm uppercase tracking-wider bg-[--color-arcade-gold] text-[--color-arcade-base] hover:bg-[--color-arcade-gold-bright] transition-colors shadow-lg cursor-pointer';
  submitBtn.appendChild(createIconElement(PlusCircle, 'w-4 h-4'));
  submitBtn.appendChild(document.createTextNode('Registrar en la colección'));

  [
    modelField, mfgField, yearField, rarityWrapper,
    unitsField, costField, ratingField, imageField,
    checksRow, errorBlock, submitBtn,
  ].forEach((el) => form.appendChild(el));

  const showError = (msg: string): void => {
    errorBlock.textContent = msg;
    errorBlock.classList.remove('hidden');
  };
  const hideError = (): void => {
    errorBlock.textContent = '';
    errorBlock.classList.add('hidden');
  };

  form.addEventListener('submit', (event: Event) => {

    // Prevent native form submission to avoid page reload before processing input data
    event.preventDefault();
    hideError();

    const modelInput = document.getElementById('input-modelo') as HTMLInputElement | null;
    const mfgInput = document.getElementById('input-fabricante') as HTMLInputElement | null;
    const yearInput = document.getElementById('input-anio') as HTMLInputElement | null;
    const raritySelect = document.getElementById('select-rareza') as HTMLSelectElement | null;
    const unitsInput = document.getElementById('input-unidades') as HTMLInputElement | null;
    const costInput = document.getElementById('input-costo') as HTMLInputElement | null;
    const ratingInput = document.getElementById('input-rating') as HTMLInputElement | null;
    const imgInput = document.getElementById('input-imagen') as HTMLInputElement | null;

    //Null guard for field components
    if (modelInput === null || mfgInput === null || yearInput === null || raritySelect === null) {
      showError('Error interno: no se encontraron los campos del formulario.');
      return;
    }

    const modelName = modelInput.value.trim();
    const manufacturer = mfgInput.value.trim();
    const releaseYear = parseInt(yearInput.value, 10);
    const rarityTier = raritySelect.value as RarityTier;

    if (modelName.length === 0) {
      showError('El nombre del modelo es obligatorio.');
      modelInput.focus();
      return;
    }
    if (manufacturer.length === 0) {
      showError('El fabricante es obligatorio.');
      mfgInput.focus();
      return;
    }
    if (isNaN(releaseYear) || releaseYear < 1947 || releaseYear > new Date().getFullYear()) {
      showError(`El año debe estar entre 1947 y ${new Date().getFullYear()}.`);
      yearInput.focus();
      return;
    }

    const unitsRaw = unitsInput?.value.trim() ?? '';
    const costRaw = costInput?.value.trim() ?? '';
    const ratingRaw = ratingInput?.value.trim() ?? '';
    const imageUrl = imgInput?.value.trim() || undefined;

    const unitsProduced = unitsRaw !== '' ? parseInt(unitsRaw, 10) : undefined;
    const restorationCostUsd = costRaw !== '' ? parseFloat(costRaw) : undefined;
    const conditionRating = ratingRaw !== '' ? parseFloat(ratingRaw) : undefined;

    if (conditionRating !== undefined && (conditionRating < 1 || conditionRating > 5)) {
      showError('El rating de condición debe estar entre 1.0 y 5.0.');
      ratingInput?.focus();
      return;
    }

    const payload: NewPinballMachinePayload = {
      modelName,
      manufacturer,
      releaseYear,
      rarityTier,
      unitsProduced,
      restorationCostUsd,
      conditionRating,
      imageUrl,
      historicalSummary: undefined,
      isFullyFunctional: cbFunctional.checked,
      hasMultiball: cbMultiball.checked,
    };

    onSubmit(payload);
    form.reset();
  });

  section.appendChild(form);
  return section;
}
