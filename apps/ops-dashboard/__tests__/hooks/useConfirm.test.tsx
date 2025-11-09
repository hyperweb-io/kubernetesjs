

import userEvent from '@testing-library/user-event';
import { useState } from 'react';

import { render, screen } from '@/__tests__/utils/test-utils';

import { confirmDialog, useConfirm } from '../../hooks/useConfirm';

const MockConfirmDialogElement = () => {
  const {confirm} = useConfirm();

  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleConfirm = async () => {
    const confirmed = await confirm({
      title: 'Test Confirm Dialog',
      description: 'Test',
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      confirmVariant: 'default',
    });
    setIsConfirmed(confirmed);
  };

  return (
    <div>
      <button onClick={handleConfirm}>Open a confirm dialog</button>
      {isConfirmed && <div>Confirmed</div>}
    </div>
  );
};

describe('useConfirm', () => {
  it('should open a dialog', async () =>{
    render(<MockConfirmDialogElement />);

    await userEvent.click(screen.getByText('Open a confirm dialog'));

    expect(screen.getByText('Test Confirm Dialog')).toBeInTheDocument();
  });
  
  it('should return true when confirmed', async () => {
    render(<MockConfirmDialogElement />);

    await userEvent.click(screen.getByText('Open a confirm dialog'));

    expect(screen.getByText('Test Confirm Dialog')).toBeInTheDocument();
 
    await userEvent.click(screen.getByText('Confirm'));

    expect(screen.getByText('Confirmed')).toBeInTheDocument();
  });
});

const MockConfirmDialogElementImperative = () => {
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = async () => {
    const confirmed = await confirmDialog({
      title: 'Test Confirm Imperative Dialog',
      description: 'Test',
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      confirmVariant: 'default',
    });
    if(confirmed) {
      setConfirmed(confirmed);
    }
  };

  return (
    <div>
      <button onClick={handleConfirm}>Open a confirm dialog</button>
      {confirmed && <div>Confirmed</div>}
    </div>
  );

};



describe('confirmDialogImperative', () => {

  it('should return true when confirmed', async () => {
    render(<MockConfirmDialogElementImperative />);

    await userEvent.click(screen.getByText('Open a confirm dialog'));

    expect(screen.getByText('Test Confirm Imperative Dialog')).toBeInTheDocument();
 
    await userEvent.click(screen.getByText('Confirm'));

    expect(screen.getByText('Confirmed')).toBeInTheDocument();
  });

  it('should open a dialog', async () =>{
    render(<MockConfirmDialogElementImperative />);

    await userEvent.click(screen.getByText('Open a confirm dialog'));

    expect(screen.getByText('Test Confirm Imperative Dialog')).toBeInTheDocument();
  });
  
});