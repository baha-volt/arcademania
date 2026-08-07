import Swal, { type SweetAlertResult } from 'sweetalert2';

const themedAlert = Swal.mixin({
  background: '#221a13',
  color: '#f3ead9',
  confirmButtonColor: '#eab54d',
  cancelButtonColor: '#3a2c1e',
  buttonsStyling: true,
});

export async function notifySuccess(title: string, text?: string): Promise<void> {
  await themedAlert.fire({ icon: 'success', title, text });
}

export async function notifyError(title: string, text?: string): Promise<void> {
  await themedAlert.fire({ icon: 'error', title, text });
}

export async function confirmDeletion(machineName: string): Promise<boolean> {
  const result: SweetAlertResult = await themedAlert.fire({
    icon: 'warning',
    title: '¿Eliminar máquina?',
    text: `"${machineName}" se quitará permanentemente de la colección.`,
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
  });
  return result.isConfirmed;
}
