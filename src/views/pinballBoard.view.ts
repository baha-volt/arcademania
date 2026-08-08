import type { PinballMachine } from '../models';
import { PinballService } from '../services/pinball.service';
import { createFeaturedBannerElement } from '../components/FeaturedBanner';
import { createPinballCardElement } from '../components/PinballCard';
import { createLoadingSkeletonElement } from '../components/LoadingSkeleton';
import { createErrorStateElement, createEmptyStateElement } from '../components/StateViews';
import { createPinballFormElement } from '../components/PinballForm';
import { notifySuccess, notifyError, confirmDeletion } from '../utils/alert.utils';
import type { NewPinballMachinePayload } from '../models';

export class PinballBoardView {
  private readonly catalogContainer: HTMLElement | null;
  private readonly formContainer: HTMLElement | null;

  constructor() {

    // Show skeleton UI immediately before the network request to provide continuous visual feedback
    this.catalogContainer = document.getElementById('contenedor-catalogo');
    this.formContainer = document.getElementById('contenedor-formulario');
  }


  public init(): void {
    this.mountForm();
    void this.loadCatalog();
  }

  private mountForm(): void {
    //Null guard provided
    if (this.formContainer === null) return;

    const formElement = createPinballFormElement((payload: NewPinballMachinePayload) => {
      void this.handleCreate(payload);
    });

    this.formContainer.replaceChildren(formElement);
  }


  public async loadCatalog(): Promise<void> {
    //Null guard privided on laod
    if (this.catalogContainer === null) return;

    this.catalogContainer.replaceChildren(createLoadingSkeletonElement(6));

    try {
      const machines = await PinballService.getAllPinballs();
      this.renderCatalog(machines);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Error desconocido al contactar el servidor.';
      this.renderError(message);
    }
  }

  private renderCatalog(machines: PinballMachine[]): void {
    if (this.catalogContainer === null) return;

    if (machines.length === 0) {
      this.catalogContainer.replaceChildren(createEmptyStateElement());
      return;
    }

    const fragment = document.createDocumentFragment();

    const featured = PinballService.getFeaturedPinball(machines);
    if (featured !== null) {
      fragment.appendChild(createFeaturedBannerElement(featured));
    }

    const counter = document.createElement('p');
    counter.className = 'text-xs text-[--color-arcade-muted] font-data mb-3 tabular-nums';
    counter.textContent = `${machines.length} máquina${machines.length !== 1 ? 's' : ''} en la colección`;
    fragment.appendChild(counter);

    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4';

    const gridMachines = PinballService.getGridPinballs(machines);
    gridMachines.forEach((machine) => {
      grid.appendChild(
        createPinballCardElement(machine, (id: number) => {
          void this.handleDelete(id, machine.modelName);
        }),
      );
    });

    fragment.appendChild(grid);
    this.catalogContainer.replaceChildren(fragment);
  }

  private renderError(message: string): void {
    if (this.catalogContainer === null) return;
    this.catalogContainer.replaceChildren(
      createErrorStateElement(message, () => { void this.loadCatalog(); }),
    );
  }

  private async handleCreate(payload: NewPinballMachinePayload): Promise<void> {
    try {
      await PinballService.createPinball(payload);
      await notifySuccess(
        '¡Máquina registrada!',
        `"${payload.modelName}" fue agregada a la colección.`,
      );
      void this.loadCatalog();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'No se pudo registrar la máquina.';
      await notifyError('Error al registrar', message);
    }
  }

  private async handleDelete(id: number, modelName: string): Promise<void> {
    const confirmed = await confirmDeletion(modelName);
    if (!confirmed) return;

    try {
      await PinballService.deletePinball(id);
      await notifySuccess('Eliminada', `"${modelName}" fue quitada de la colección.`);
      void this.loadCatalog();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'No se pudo eliminar la máquina.';
      await notifyError('Error al eliminar', message);
    }
  }
}
